import { buildImgixUrl, ImgixUrlQueryParams, ImgixFit } from 'ts-imgix'
import { FixedObject, FluidObject } from 'gatsby-image'

import { signURL } from './utils'

// Default width for `fixed` images. Same as `gatsby-plugin-sharp`.
const DEFAULT_FIXED_WIDTH = 400

// Default resolutions for `fixed` images. Same as `gatsby-plugin-sharp`.
const FIXED_RESOLUTIONS = [1, 1.5, 2]

// Default maxWidth for `fluid` images. Same as `gatsby-plugin-sharp`.
const DEFAULT_FLUID_MAX_WIDTH = 800

// Default breakpoint factors for `fluid` images. Same as
// `gatsby-plugin-sharp`.
const DEFAULT_FLUID_BREAKPOINT_FACTORS = [0.25, 0.5, 1.5, 2]

/**
 * Default params for all images.
 */
const DEFAULT_PARAMS: ImgixUrlQueryParams = {
  // `max` ensures the resulting image is never larger than the source file.
  fit: ImgixFit.max,

  // 50 is fairly aggressive.
  q: 50,

  // Automatically apply compression and use webp when possible.
  auto: { compress: true, format: true },
}

/**
 * Default params for the placeholder image.
 */
const DEFAULT_LQIP_PARAMS: ImgixUrlQueryParams = {
  // 100 is greater than the default `gatsby-transformer-sharp` size, but it
  // improves the placeholder quality significantly.
  w: 100,

  // The image requires some blurring since it may be stretched large. This
  // softens the pixelation.
  blur: 15,

  // Since this is a low quality placeholer, we can drop down the quality.
  q: 20,
}

type BuildURLArgs = {
  url: string
  params?: ImgixUrlQueryParams
  secureURLToken?: string
}

const buildURL = (args: BuildURLArgs) => {
  const { url, params, secureURLToken } = args

  const imgixURL = buildImgixUrl(url)({ ...DEFAULT_PARAMS, ...params })

  return secureURLToken ? signURL(imgixURL, secureURLToken) : imgixURL
}

type BuildPlaceholderURLArgs = BuildURLArgs

const buildLQIPURL = (args: BuildPlaceholderURLArgs) =>
  buildURL({
    ...args,
    params: {
      ...DEFAULT_LQIP_PARAMS,
      ...args.params,
    },
  })

type BuildFixedSrcSetArgs = BuildURLArgs

const buildFixedSrcSet = (args: BuildFixedSrcSetArgs) => {
  const { url: baseURL, params, secureURLToken } = args

  return FIXED_RESOLUTIONS.map(resolution => {
    const url = buildURL({
      url: baseURL,
      params: { ...params, dpr: resolution },
      secureURLToken,
    })

    return `${url} ${resolution}x`
  }).join(', ')
}

type BuildFluidSrcSetArgs = {
  url: string
  aspectRatio: number
  params: ImgixUrlQueryParams & { w: NonNullable<ImgixUrlQueryParams['w']> }
  srcSetBreakpoints?: number[]
  secureURLToken?: string
}

const buildFluidSrcSet = (args: BuildFluidSrcSetArgs) => {
  const { url: baseURL, aspectRatio, params, secureURLToken } = args
  const { w: width } = params
  let { srcSetBreakpoints } = args

  if (!srcSetBreakpoints)
    srcSetBreakpoints = DEFAULT_FLUID_BREAKPOINT_FACTORS.map(x => width * x)

  // Remove duplicates, sort by numerical value, and ensure maxWidth is added.
  const uniqSortedBreakpoints = Array.from(
    new Set([...srcSetBreakpoints, width]),
  ).sort()

  return uniqSortedBreakpoints
    .map(breakpoint => {
      if (!breakpoint) return undefined

      const url = buildURL({
        url: baseURL,
        params: {
          ...params,
          w: breakpoint,
          h: Math.round(breakpoint / aspectRatio),
        },
        secureURLToken,
      })

      return `${url} ${Math.round(breakpoint)}w`
    })
    .filter(Boolean)
    .join(', ')
}

export type GatsbyImageFixedArgs = {
  width?: number
  height?: number
  imgixParams?: ImgixUrlQueryParams
}

type BuildFixedGatsbyImageArgs = {
  /** A valid Imgix image URL. */
  url: string

  /** Width of the source image in pixels. **/
  sourceWidth: number

  /** Height of the source image in pixels. **/
  sourceHeight: number

  /** Arguments from the GraphQL field. **/
  args: GatsbyImageFixedArgs

  /** Secure URL token to sign images if provided. **/
  secureURLToken?: string
}

/**
 * Builds a gatsby-image-compatible fixed image object from a base Imgix image URL.
 *
 * @returns gatsby-image-compatible fixed image object.
 */
export const buildFixedGatsbyImage = (
  args: BuildFixedGatsbyImageArgs,
): FixedObject => {
  const { url, sourceWidth, sourceHeight, args: gqlArgs, secureURLToken } = args

  const aspectRatio = sourceWidth / sourceHeight
  const width = gqlArgs.width ?? DEFAULT_FIXED_WIDTH
  const height = gqlArgs.height ?? Math.round(width / aspectRatio)

  const base64 = buildLQIPURL({
    url,
    params: gqlArgs.imgixParams,
    secureURLToken,
  })
  const src = buildURL({
    url,
    params: { ...gqlArgs.imgixParams, w: width, h: height },
    secureURLToken,
  })
  const srcSet = buildFixedSrcSet({
    url,
    params: { ...gqlArgs.imgixParams, w: width, h: height },
    secureURLToken,
  })

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

export type GatsbyImageFluidArgs = {
  maxWidth?: number
  maxHeight?: number
  sizes?: string
  srcSetBreakpoints?: number[]
  imgixParams?: ImgixUrlQueryParams
}

type BuildFluidGatsbyImageArgs = {
  /** A valid Imgix image URL. */
  url: string

  /** Width of the source image in pixels. */
  sourceWidth: number

  /** Height of the source image in pixels. */
  sourceHeight: number

  /** Arguments from the GraphQL field. */
  args: GatsbyImageFluidArgs

  /** Secure URL token to sign images if provided. Required for web proxy images. */
  secureURLToken?: string
}

/**
 * Builds a gatsby-image-compatible fluid image object from a base Imgix image URL.
 *
 * @returns gatsby-image-compatible fluid image object.
 */
export const buildFluidGatsbyImage = (
  args: BuildFluidGatsbyImageArgs,
): FluidObject => {
  const { url, sourceWidth, sourceHeight, args: gqlArgs, secureURLToken } = args

  const aspectRatio = sourceWidth / sourceHeight
  const maxWidth = gqlArgs.maxWidth ?? DEFAULT_FLUID_MAX_WIDTH

  const base64 = buildLQIPURL({
    url,
    params: gqlArgs.imgixParams,
    secureURLToken,
  })
  const src = buildURL({
    url,
    params: { ...gqlArgs.imgixParams, w: maxWidth, h: gqlArgs.maxHeight },
    secureURLToken,
  })
  const srcSet = buildFluidSrcSet({
    url,
    params: { ...gqlArgs.imgixParams, w: maxWidth, h: gqlArgs.maxHeight },
    aspectRatio,
    srcSetBreakpoints: gqlArgs.srcSetBreakpoints,
    secureURLToken,
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
