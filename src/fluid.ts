import {
  Cache as GatsbyCache,
  NodePluginSchema as GatsbyNodePluginSchema,
} from 'gatsby'
import { FluidObject } from 'gatsby-image'
import { ImgixUrlQueryParams } from 'ts-imgix'

import { createBase64URLResolver } from './base64'
import { buildURL, buildLQIPURL, buildFluidSrcSet } from './urlBuilders'
import { probeMetadata } from './utils'

const DEFAULT_MAX_WIDTH = 800

interface CreateFluidTypeArgs {
  cache: GatsbyCache['cache']
  schema: GatsbyNodePluginSchema
  secureURLToken?: string
}

export const createFluidType = ({
  cache,
  schema,
  secureURLToken,
}: CreateFluidTypeArgs) =>
  schema.buildObjectType({
    name: 'ImgixImageFluidType',
    fields: {
      base64: {
        type: 'String!',
        resolve: createBase64URLResolver({ cache, secureURLToken }),
      },
      aspectRatio: 'Float!',
      src: 'String!',
      srcSet: 'String!',
      srcWebp: 'String!',
      srcSetWebp: 'String!',
      sizes: 'String!',
    },
  })

export type GatsbyImageFluidArgs = {
  maxWidth?: number
  maxHeight?: number
  sizes?: string
  srcSetBreakpoints?: number[]
  imgixParams?: ImgixUrlQueryParams
}

interface CreateFluidResolverArgs {
  cache: GatsbyCache['cache']
  secureURLToken?: string
}

export const createFluidResolver = ({
  cache,
  secureURLToken,
}: CreateFluidResolverArgs) => async (
  url: string,
  args: GatsbyImageFluidArgs,
) => {
  if (!url) return

  const {
    PixelWidth: sourceWidth,
    PixelHeight: sourceHeight,
  } = await probeMetadata({ url, cache, secureURLToken })

  return buildFluidGatsbyImage({
    url,
    sourceWidth,
    sourceHeight,
    args,
    secureURLToken,
  })
}

type BuildFluidGatsbyImageArgs = {
  /** A valid Imgix image URL. */
  url: string

  /** Width of the source image in pixels. */
  sourceWidth: number

  /** Height of the source image in pixels. */
  sourceHeight: number

  /** Arguments from the GraphQL field. */
  args?: GatsbyImageFluidArgs

  /** Secure URL token to sign images if provided. Required for web proxy images. */
  secureURLToken?: string
}

/**
 * Builds a gatsby-image-compatible fluid image object from a base Imgix image URL.
 *
 * @returns gatsby-image-compatible fluid image object.
 */
export const buildFluidGatsbyImage = ({
  url,
  sourceWidth,
  sourceHeight,
  args = {},
  secureURLToken,
}: BuildFluidGatsbyImageArgs): FluidObject => {
  const aspectRatio = sourceWidth / sourceHeight
  const maxWidth = args.maxWidth ?? DEFAULT_MAX_WIDTH

  const base64 = buildLQIPURL({
    url,
    params: args.imgixParams,
    secureURLToken,
  })
  const src = buildURL({
    url,
    params: { ...args.imgixParams, w: maxWidth, h: args.maxHeight },
    secureURLToken,
  })
  const srcSet = buildFluidSrcSet({
    url,
    params: { ...args.imgixParams, w: maxWidth, h: args.maxHeight },
    aspectRatio,
    srcSetBreakpoints: args.srcSetBreakpoints,
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
