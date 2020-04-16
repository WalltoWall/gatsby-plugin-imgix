import {
  buildImgixUrl,
  ImgixUrlQueryParams,
  ImgixFit,
  ImgixRect,
} from 'ts-imgix'
import { FixedObject, FluidObject } from 'gatsby-image'
import { createHash } from 'crypto'
import probe from 'probe-image-size'

// Default width for `fixed` images. Same as `gatsby-plugin-sharp`.
const DEFAULT_FIXED_WIDTH = 400

// Default resolutions for `fixed` images. Same as `gatsby-plugin-sharp`.
const DEFAULT_FIXED_RESOLUTIONS = [1, 1.5, 2]

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
const DEFAULT_PLACEHOLDER_PARAMS: ImgixUrlQueryParams = {
  // 100 is greater than the default `gatsby-transformer-sharp` size, but it
  // improves the placeholder quality significantly.
  w: 100,

  // The image requires some blurring since it may be stretched large. This
  // softens the pixelation.
  blur: 15,

  // Since this is a low quality placeholer, we can drop down the quality.
  q: 20,
}

/**
 * Converts a rect value from a URL parameter string to an ImgixRect object for use with ts-imgix.
 *
 * @param rect String `rect` from an Imgix URL.
 *
 * @returns An object representation of `rect`.
 */
const rectStrToObj = (rect: string): ImgixRect => {
  const [x, y, w, h] = rect.split(',')

  return {
    x: Number.parseInt(x),
    y: Number.parseInt(y),
    w: Number.parseInt(w),
    h: Number.parseInt(h),
  }
}

const extractURLParts = (url: string) => {
  const instance = new URL(url)
  const baseURL = instance.origin + instance.pathname
  const params = instance.searchParams

  return { baseURL, params }
}

const signURL = (url: string, token: string) => {
  const instance = new URL(url)
  const signatureBase = token + instance.pathname + instance.search
  const signature = createHash('md5').update(signatureBase).digest('hex')

  instance.searchParams.set('s', signature)

  return instance.href
}

const buildURL = (url: string, params: ImgixUrlQueryParams, token?: string) => {
  const imgixURL = buildImgixUrl(url)({ ...DEFAULT_PARAMS, ...params })
  return token ? signURL(imgixURL, token) : imgixURL
}

const buildPlaceholderURL = (
  url: string,
  params: ImgixUrlQueryParams,
  token?: string,
) => buildURL(url, { ...DEFAULT_PLACEHOLDER_PARAMS, ...params }, token)

const buildFixedSrcSet = (
  baseURL: string,
  params: ImgixUrlQueryParams,
  resolutions: number[] = DEFAULT_FIXED_RESOLUTIONS,
  token?: string,
) =>
  resolutions
    .map((resolution) => {
      const url = buildURL(baseURL, { ...params, dpr: resolution }, token)
      return `${url} ${resolution}x`
    })
    .join(', ')

const buildFluidSrcSet = (
  baseURL: string,
  aspectRatio: number,
  params: ImgixUrlQueryParams & {
    w: NonNullable<ImgixUrlQueryParams['w']>
  },
  breakpoints?: number[],
  token?: string,
) => {
  const { w: width } = params

  if (!breakpoints)
    breakpoints = DEFAULT_FLUID_BREAKPOINT_FACTORS.map((x) => width * x)

  // Remove duplicates, sort by numerical value, and ensure maxWidth is added.
  const uniqSortedBreakpoints = Array.from(new Set([...breakpoints, width]))

  return uniqSortedBreakpoints
    .map((breakpoint) => {
      if (!breakpoint) return
      const url = buildURL(
        baseURL,
        {
          ...params,
          w: breakpoint,
          h: Math.round(breakpoint / aspectRatio),
        },
        token,
      )
      return `${url} ${Math.round(breakpoint)}w`
    })
    .filter(Boolean)
    .join(', ')
}

type GatsbyImageFixedArgs = {
  width?: number
  height?: number
  quality?: number
}

export const buildFixedGatsbyImage = (
  url: string,
  sourceWidth: number,
  sourceHeight: number,
  args: GatsbyImageFixedArgs = {},
): FixedObject => {
  const { baseURL, params } = extractURLParts(url)

  const rect = params.get('rect') ?? undefined
  const aspectRatio = sourceWidth / sourceHeight
  const width = args.width ?? DEFAULT_FIXED_WIDTH
  const height = args.height ?? Math.round(width / aspectRatio)
  const quality = args.quality

  const base64 = buildPlaceholderURL(baseURL, {
    rect: rect ? rectStrToObj(rect) : undefined,
  })
  const src = buildURL(baseURL, {
    w: width,
    h: height,
    rect: rect ? rectStrToObj(rect) : undefined,
    q: quality,
  })
  const srcSet = buildFixedSrcSet(baseURL, {
    w: width,
    h: height,
    rect: rect ? rectStrToObj(rect) : undefined,
    q: quality,
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

type GatsbyImageFluidArgs = {
  maxWidth?: number
  maxHeight?: number
  sizes?: string
  srcSetBreakpoints?: number[]
  quality?: number
}

export const buildFluidGatsbyImage2 = async (
  url: string,
  args: GatsbyImageFluidArgs = {},
  secureURLToken?: string,
): Promise<FluidObject> => {
  const { width: sourceWidth, height: sourceHeight } = await probe(url)

  const aspectRatio = sourceWidth / sourceHeight
  const width = args.maxWidth ?? DEFAULT_FLUID_MAX_WIDTH
  const height = args.maxHeight ?? Math.round(width / aspectRatio)
  const quality = args.quality
  const breakpoints = args.srcSetBreakpoints

  const base64 = buildPlaceholderURL(url, {}, secureURLToken)
  const src = buildURL(
    url,
    {
      w: width,
      h: height,
      q: quality,
    },
    secureURLToken,
  )
  const srcSet = buildFluidSrcSet(
    url,
    aspectRatio,
    {
      w: width,
      h: height,
      q: quality,
    },
    breakpoints,
    secureURLToken,
  )

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

export const buildFluidGatsbyImage = (
  url: string,
  sourceWidth: number,
  sourceHeight: number,
  args: GatsbyImageFluidArgs = {},
): FluidObject => {
  const { baseURL, params } = extractURLParts(url)

  const rect = params.get('rect') ?? undefined
  const aspectRatio = sourceWidth / sourceHeight
  const width = args.maxWidth ?? DEFAULT_FLUID_MAX_WIDTH
  const height = args.maxHeight ?? Math.round(width / aspectRatio)
  const quality = args.quality
  const breakpoints = args.srcSetBreakpoints

  const base64 = buildPlaceholderURL(baseURL, {
    rect: rect ? rectStrToObj(rect) : undefined,
  })
  const src = buildURL(baseURL, {
    w: width,
    h: height,
    rect: rect ? rectStrToObj(rect) : undefined,
    q: quality,
  })
  const srcSet = buildFluidSrcSet(
    baseURL,
    aspectRatio,
    {
      w: width,
      h: height,
      rect: rect ? rectStrToObj(rect) : undefined,
      q: quality,
    },
    breakpoints,
  )

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
