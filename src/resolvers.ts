import { Cache as GatsbyCache } from 'gatsby'
import { FluidObject, FixedObject } from 'gatsby-image'

import {
  buildFixedGatsbyImage,
  buildFluidGatsbyImage,
  GatsbyImageFixedArgs,
  GatsbyImageFluidArgs,
} from './builders'
import { probeMetadata, fetchBase64URL } from './utils'

type CreateResolverArgs = {
  cache: GatsbyCache['cache']
  secureURLToken?: string
}

export const createBase64Resolver = (args: CreateResolverArgs) => async (
  obj: FixedObject | FluidObject,
) => {
  const { cache, secureURLToken } = args
  const { base64: url } = obj

  if (!url) return

  return await fetchBase64URL({ url, cache, secureURLToken })
}

export const createFixedResolver = (args: CreateResolverArgs) => async (
  url: string,
  gqlArgs: GatsbyImageFixedArgs,
) => {
  const { cache, secureURLToken } = args

  if (!url) return

  const {
    PixelWidth: sourceWidth,
    PixelHeight: sourceHeight,
  } = await probeMetadata({ url, cache, secureURLToken })

  return buildFixedGatsbyImage({
    url,
    sourceWidth,
    sourceHeight,
    args: gqlArgs,
    secureURLToken,
  })
}

export const createFluidResolver = (args: CreateResolverArgs) => async (
  url: string,
  gqlArgs: GatsbyImageFluidArgs,
) => {
  const { cache, secureURLToken } = args

  if (!url) return

  const {
    PixelWidth: sourceWidth,
    PixelHeight: sourceHeight,
  } = await probeMetadata({ url, cache, secureURLToken })

  return buildFluidGatsbyImage({
    url,
    sourceWidth,
    sourceHeight,
    args: gqlArgs,
    secureURLToken,
  })
}
