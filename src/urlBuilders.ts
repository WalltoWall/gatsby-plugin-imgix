import { FixedObject, FluidObject } from 'gatsby-image'
import { buildImgixUrl as _buildImgixUrl, ImgixUrlQueryParams } from 'ts-imgix'
import { createHash } from 'crypto'

import { ImgixFixedArgs } from './createImgixFixedFieldConfig'
import { ImgixFluidArgs } from './createImgixFluidFieldConfig'

export const DEFAULT_FIXED_WIDTH = 400
export const DEFAULT_FLUID_MAX_WIDTH = 800

// Resolutions for `fixed` images. Same as `gatsby-plugin-sharp`.
const FIXED_RESOLUTIONS = [1, 1.5, 2]

// Breakpoint factors for `fluid` images. Same as `gatsby-plugin-sharp`.
const FLUID_BREAKPOINT_FACTORS = [0.25, 0.5, 1.5, 2]

// Default params for placeholder images.
const DEFAULT_LQIP_PARAMS: ImgixUrlQueryParams = { w: 100, blur: 15, q: 20 }

export const buildImgixUrl = (url: string, secureUrlToken?: string) => (
  params: ImgixUrlQueryParams,
) => {
  const imgixUrl = _buildImgixUrl(url)(params)
  const parsed = new URL(imgixUrl)

  parsed.searchParams.delete('s')

  const signatureBase = secureUrlToken + parsed.pathname + parsed.search
  const signature = createHash('md5')
    .update(signatureBase)
    .digest('hex')

  parsed.searchParams.append('s', signature)

  return parsed.href
}

const buildImgixLqipUrl: typeof buildImgixUrl = (...args1) => params =>
  buildImgixUrl(...args1)({ ...DEFAULT_LQIP_PARAMS, ...params })

const buildImgixFixedSrcSet = (baseUrl: string, secureUrlToken?: string) => (
  params: ImgixUrlQueryParams,
) =>
  FIXED_RESOLUTIONS.map(resolution => {
    const url = buildImgixUrl(
      baseUrl,
      secureUrlToken,
    )({ ...params, dpr: resolution })

    return `${url} ${resolution}x`
  }).join(', ')

type BuildImgixFixedArgs = {
  url: string
  sourceWidth: number
  sourceHeight: number
  secureUrlToken?: string
  args: ImgixFixedArgs
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
  args,
}: BuildImgixFixedArgs): FixedObject => {
  const aspectRatio = sourceWidth / sourceHeight
  const width = args.width ?? DEFAULT_FIXED_WIDTH
  const height = args.height ?? Math.round(width / aspectRatio)

  const base64 = buildImgixLqipUrl(url, secureUrlToken)(args.imgixParams)
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

const buildImgixFluidSrcSet = (baseUrl: string, secureUrlToken?: string) => (
  params: ImgixUrlQueryParams,
) => ({
  aspectRatio,
  maxWidth,
  srcSetBreakpoints = FLUID_BREAKPOINT_FACTORS.map(x => maxWidth * x),
}: BuildFluidSrcSetArgs) => {
  // Remove duplicates, sort by numerical value, and ensure maxWidth is added.
  const uniqSortedBreakpoints = Array.from(
    new Set([...srcSetBreakpoints, maxWidth]),
  ).sort()

  return uniqSortedBreakpoints
    .map(breakpoint => {
      const url = buildImgixUrl(
        baseUrl,
        secureUrlToken,
      )({
        ...params,
        w: breakpoint,
        h: Math.round(breakpoint / aspectRatio),
      })

      return `${url} ${Math.round(breakpoint)}w`
    })
    .join(', ')
}

type BuildImgixFluidArgs = {
  url: string
  sourceWidth: number
  sourceHeight: number
  secureUrlToken?: string
  args: ImgixFluidArgs
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
  args,
}: BuildImgixFluidArgs): FluidObject => {
  const aspectRatio = sourceWidth / sourceHeight
  const maxWidth = args.maxWidth ?? DEFAULT_FLUID_MAX_WIDTH

  const base64 = buildImgixLqipUrl(url, secureUrlToken)(args.imgixParams)
  const src = buildImgixUrl(
    url,
    secureUrlToken,
  )({
    ...args.imgixParams,
    w: maxWidth,
    h: args.maxHeight,
  })
  const srcSet = buildImgixFluidSrcSet(url, secureUrlToken)(args.imgixParams)({
    aspectRatio,
    maxWidth: args.maxWidth,
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
