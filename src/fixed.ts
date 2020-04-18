import {
  Cache as GatsbyCache,
  NodePluginSchema as GatsbyNodePluginSchema,
} from 'gatsby'
import { FixedObject } from 'gatsby-image'
import { ImgixUrlQueryParams } from 'ts-imgix'

import { createBase64URLResolver } from './base64'
import { buildURL, buildLQIPURL, buildFixedSrcSet } from './urlBuilders'
import { probeMetadata } from './utils'

const DEFAULT_WIDTH = 400

interface CreateFixedTypeArgs {
  cache: GatsbyCache['cache']
  schema: GatsbyNodePluginSchema
  secureURLToken?: string
}

export const createFixedType = ({
  cache,
  schema,
  secureURLToken,
}: CreateFixedTypeArgs) =>
  schema.buildObjectType({
    name: 'ImgixImageFixedType',
    fields: {
      base64: {
        type: 'String!',
        resolve: createBase64URLResolver({ cache, secureURLToken }),
      },
      width: 'Float!',
      height: 'Float!',
      src: 'String!',
      srcSet: 'String!',
      srcWebp: 'String!',
      srcSetWebp: 'String!',
    },
  })

export type GatsbyImageFixedArgs = {
  width?: number
  height?: number
  imgixParams?: ImgixUrlQueryParams
}

interface CreateFixedResolverArgs {
  cache: GatsbyCache['cache']
  secureURLToken?: string
}

export const createFixedResolver = ({
  cache,
  secureURLToken,
}: CreateFixedResolverArgs) => async (
  url: string,
  args: GatsbyImageFixedArgs,
) => {
  if (!url) return

  const {
    PixelWidth: sourceWidth,
    PixelHeight: sourceHeight,
  } = await probeMetadata({ url, cache, secureURLToken })

  return buildFixedGatsbyImage({
    url,
    sourceWidth,
    sourceHeight,
    args,
    secureURLToken,
  })
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
export const buildFixedGatsbyImage = ({
  url,
  sourceWidth,
  sourceHeight,
  args,
  secureURLToken,
}: BuildFixedGatsbyImageArgs): FixedObject => {
  const aspectRatio = sourceWidth / sourceHeight
  const width = args.width ?? DEFAULT_WIDTH
  const height = args.height ?? Math.round(width / aspectRatio)

  const base64 = buildLQIPURL({
    url,
    params: args.imgixParams,
    secureURLToken,
  })
  const src = buildURL({
    url,
    params: { ...args.imgixParams, w: width, h: height },
    secureURLToken,
  })
  const srcSet = buildFixedSrcSet({
    url,
    params: { ...args.imgixParams, w: width, h: height },
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
