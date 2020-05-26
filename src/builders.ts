import { FixedObject, FluidObject } from 'gatsby-image'
import * as A from 'fp-ts/es6/Array'
import * as R from 'fp-ts/es6/Record'
import { Option } from 'fp-ts/es6/Option'
import { eqNumber } from 'fp-ts/es6/Eq'
import { ordNumber } from 'fp-ts/es6/Ord'
import { pipe } from 'fp-ts/es6/pipeable'

import { ImgixUrlParams, ImgixFixedArgs, ImgixFluidArgs } from './types'
import {
  setURLSearchParams,
  signURL,
  semigroupImgixUrlParams,
  join,
} from './utils'

export const DEFAULT_FIXED_WIDTH = 400
export const DEFAULT_FLUID_MAX_WIDTH = 800

// Resolutions for `fixed` images. Same as `gatsby-plugin-sharp`.
const FIXED_RESOLUTIONS = [1, 1.5, 2]

// Breakpoint factors for `fluid` images. Same as `gatsby-plugin-sharp`.
const FLUID_BREAKPOINT_FACTORS = [0.25, 0.5, 1.5, 2]

// Default params for placeholder images.
const DEFAULT_LQIP_PARAMS: ImgixUrlParams = { w: 100, blur: 15, q: 20 }

export const buildImgixUrl = (url: string, secureUrlToken: Option<string>) => (
  params: ImgixUrlParams,
): string =>
  pipe(params, R.map(String), setURLSearchParams(url), signURL(secureUrlToken))

const buildImgixLqipUrl = (url: string, secureUrlToken: Option<string>) => (
  params: ImgixUrlParams,
): string =>
  pipe(
    semigroupImgixUrlParams.concat(params, DEFAULT_LQIP_PARAMS),
    buildImgixUrl(url, secureUrlToken),
  )

const buildImgixFixedSrcSet = (
  baseUrl: string,
  secureUrlToken: Option<string>,
) => (params: ImgixUrlParams): string =>
  pipe(
    FIXED_RESOLUTIONS,
    A.map((dpr) =>
      pipe(
        semigroupImgixUrlParams.concat(params, { dpr }),
        buildImgixUrl(baseUrl, secureUrlToken),
        (url) => `${url} ${dpr}x`,
      ),
    ),
    join(', '),
  )

type BuildImgixFixedArgs = {
  url: string
  sourceWidth: number
  sourceHeight: number
  secureUrlToken?: string
  args?: ImgixFixedArgs
}

/**
 * Builds a gatsby-image-compatible fixed image object from a base Imgix image URL.
 *
 * @returns gatsby-image-compatible fixed image object.
 */
export const buildImgixFixed = ({
  url,
  sourceWidth,
  sourceHeight,
  secureUrlToken,
  args = {},
}: BuildImgixFixedArgs): FixedObject => {
  const aspectRatio = sourceWidth / sourceHeight

  let width: number
  let height: number

  if (args.width != undefined && args.height != undefined) {
    width = args.width
    height = args.height
  } else if (args.width != undefined) {
    width = args.width
    height = Math.round(width / aspectRatio)
  } else if (args.height != undefined) {
    width = Math.round(args.height * aspectRatio)
    height = args.height
  } else {
    width = DEFAULT_FIXED_WIDTH
    height = Math.round(width / aspectRatio)
  }

  const base64 = buildImgixLqipUrl(url, secureUrlToken)(args.imgixParams ?? {})
  const src = buildImgixUrl(
    url,
    secureUrlToken,
  )({ ...args.imgixParams, w: width, h: height })
  const srcSet = buildImgixFixedSrcSet(
    url,
    secureUrlToken,
  )({ ...args.imgixParams, w: width, h: height })

  return {
    base64,
    width,
    height,
    src,
    srcWebp: src,
    srcSet,
    srcSetWebp: srcSet,
  }
}

type BuildFluidSrcSetArgs = {
  aspectRatio: number
  maxWidth: number
  srcSetBreakpoints?: number[]
}

const buildImgixFluidSrcSet = (
  baseUrl: string,
  secureUrlToken: Option<string>,
) => (params: ImgixUrlParams) => ({
  aspectRatio,
  maxWidth,
  srcSetBreakpoints = FLUID_BREAKPOINT_FACTORS.map((x) => maxWidth * x),
}: BuildFluidSrcSetArgs): string =>
  pipe(
    A.cons(maxWidth, srcSetBreakpoints),
    A.uniq(eqNumber),
    A.sort(ordNumber),
    A.map((breakpoint) =>
      pipe(
        semigroupImgixUrlParams.concat(params, {
          w: Math.round(breakpoint),
          h: Math.round(breakpoint / aspectRatio),
        }),
        buildImgixUrl(baseUrl, secureUrlToken),
        (url) => `${url} ${Math.round(breakpoint)}`,
      ),
    ),
    join(', '),
  )

type BuildImgixFluidArgs = {
  url: string
  sourceWidth: number
  sourceHeight: number
  secureUrlToken?: string
  args?: ImgixFluidArgs
}

/**
 * Builds a gatsby-image-compatible fluid image object from a base Imgix image URL.
 *
 * @returns gatsby-image-compatible fluid image object.
 */
export const buildImgixFluid = ({
  url,
  sourceWidth,
  sourceHeight,
  secureUrlToken,
  args = {},
}: BuildImgixFluidArgs): FluidObject => {
  const aspectRatio = sourceWidth / sourceHeight
  const maxWidth = args.maxWidth ?? DEFAULT_FLUID_MAX_WIDTH

  const base64 = buildImgixLqipUrl(url, secureUrlToken)(args.imgixParams ?? {})
  const src = buildImgixUrl(
    url,
    secureUrlToken,
  )({
    ...args.imgixParams,
    w: maxWidth,
    h: args.maxHeight,
  })
  const srcSet = buildImgixFluidSrcSet(
    url,
    secureUrlToken,
  )(args.imgixParams ?? {})({
    aspectRatio,
    maxWidth: maxWidth,
    srcSetBreakpoints: args.srcSetBreakpoints,
  })

  return {
    base64,
    aspectRatio,
    src,
    srcWebp: src,
    srcSet,
    srcSetWebp: srcSet,
    sizes: '',
  }
}
