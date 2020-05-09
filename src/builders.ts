import { FixedObject, FluidObject } from 'gatsby-image'
import { createHash } from 'crypto'
import { paramCase } from 'param-case'

import { ImgixUrlParams, ImgixFixedArgs, ImgixFluidArgs } from './types'

export const DEFAULT_FIXED_WIDTH = 400
export const DEFAULT_FLUID_MAX_WIDTH = 800

// Resolutions for `fixed` images. Same as `gatsby-plugin-sharp`.
const FIXED_RESOLUTIONS = [1, 1.5, 2]

// Breakpoint factors for `fluid` images. Same as `gatsby-plugin-sharp`.
const FLUID_BREAKPOINT_FACTORS = [0.25, 0.5, 1.5, 2]

// Default params for placeholder images.
const DEFAULT_LQIP_PARAMS: ImgixUrlParams = { w: 100, blur: 15, q: 20 }

export const buildImgixUrl = (url: string, secureUrlToken?: string) => (
  params: ImgixUrlParams,
): string => {
  const instance = new URL(url)

  for (const param in params) {
    const val = params[param as keyof ImgixUrlParams]

    if (val !== undefined && val !== null) {
      // The input param name is camel-cased to appease the GraphQL field
      // requirements. This is converted to param-case per the Imgix API.
      const name = paramCase(param)

      instance.searchParams.set(name, String(val))
    }
  }

  // If a secure URL token is provided, sign the URL using its path and params.
  if (secureUrlToken) {
    // We don't want the existing signature as part of the computed params.
    instance.searchParams.delete('s')

    const signatureBase = secureUrlToken + instance.pathname + instance.search
    const signature = createHash('md5').update(signatureBase).digest('hex')

    // Ensure `s` is the last param.
    instance.searchParams.append('s', signature)
  }

  return instance.href
}

const buildImgixLqipUrl: typeof buildImgixUrl = (...args) => (params): string =>
  buildImgixUrl(...args)({ ...params, ...DEFAULT_LQIP_PARAMS })

const buildImgixFixedSrcSet = (baseUrl: string, secureUrlToken?: string) => (
  params: ImgixUrlParams,
): string =>
  FIXED_RESOLUTIONS.map((resolution) => {
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

const buildImgixFluidSrcSet = (baseUrl: string, secureUrlToken?: string) => (
  params: ImgixUrlParams,
) => ({
  aspectRatio,
  maxWidth,
  srcSetBreakpoints = FLUID_BREAKPOINT_FACTORS.map((x) => maxWidth * x),
}: BuildFluidSrcSetArgs): string => {
  // Remove duplicates, sort by numerical value, and ensure maxWidth is added.
  const uniqSortedBreakpoints = Array.from(
    new Set([...srcSetBreakpoints, maxWidth]),
  ).sort((a, b) => a - b)

  return uniqSortedBreakpoints
    .map((breakpoint) => {
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
