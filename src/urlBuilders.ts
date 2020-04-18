import { buildImgixUrl, ImgixUrlQueryParams, ImgixFit } from 'ts-imgix'

import { signURL } from './utils'

// Resolutions for `fixed` images. Same as `gatsby-plugin-sharp`.
const FIXED_RESOLUTIONS = [1, 1.5, 2]

// Breakpoint factors for `fluid` images. Same as `gatsby-plugin-sharp`.
const FLUID_BREAKPOINT_FACTORS = [0.25, 0.5, 1.5, 2]

// Default params for all images.
const DEFAULT_PARAMS: ImgixUrlQueryParams = {
  fit: ImgixFit.max,
  q: 50,
  auto: { compress: true, format: true },
}

// Default params for placeholder images.
const DEFAULT_LQIP_PARAMS: ImgixUrlQueryParams = {
  w: 100,
  blur: 15,
  q: 20,
}

type BuildURLArgs = {
  url: string
  params?: ImgixUrlQueryParams
  secureURLToken?: string
}

export const buildURL = ({ url, params, secureURLToken }: BuildURLArgs) => {
  const imgixURL = buildImgixUrl(url)({ ...DEFAULT_PARAMS, ...params })

  return secureURLToken ? signURL(imgixURL, secureURLToken) : imgixURL
}

type BuildPlaceholderURLArgs = BuildURLArgs

export const buildLQIPURL = (args: BuildPlaceholderURLArgs) =>
  buildURL({
    ...args,
    params: {
      ...DEFAULT_LQIP_PARAMS,
      ...args.params,
    },
  })

type BuildFixedSrcSetArgs = BuildURLArgs

export const buildFixedSrcSet = ({
  url: baseURL,
  params,
  secureURLToken,
}: BuildFixedSrcSetArgs) => {
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

export const buildFluidSrcSet = ({
  url: baseURL,
  aspectRatio,
  params,
  secureURLToken,
  srcSetBreakpoints = FLUID_BREAKPOINT_FACTORS.map(x => params.w * x),
}: BuildFluidSrcSetArgs) => {
  const { w: width } = params

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
