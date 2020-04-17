import { Cache as GatsbyCache } from 'gatsby'
import fetch from 'node-fetch'

import {
  buildFixedGatsbyImage,
  buildFluidGatsbyImage,
  GatsbyImageFixedArgs,
  GatsbyImageFluidArgs,
  signURL,
} from './builders'

interface ImgixMetadata {
  PixelWidth: number
  PixelHeight: number
}

const probeMetadata = async (
  url: string,
  cache: GatsbyCache['cache'],
  token?: string,
) => {
  const key = `metadata___${url}`

  const cached = await cache.get(key)
  if (cached) return cached

  const instance = new URL(url)
  instance.searchParams.set('fm', 'json')
  const jsonUrl = token ? signURL(instance.href, token) : instance.href

  const res = await fetch(jsonUrl)
  const metadata = (await res.json()) as ImgixMetadata

  cache.set(key, metadata)

  return metadata
}

export const createFixedResolver = (
  cache: GatsbyCache['cache'],
  token?: string,
) => async (url: string, args: GatsbyImageFixedArgs) => {
  if (!url) return

  const {
    PixelWidth: sourceWidth,
    PixelHeight: sourceHeight,
  } = await probeMetadata(url, cache, token)

  return buildFixedGatsbyImage(url, sourceWidth, sourceHeight, args, token)
}

export const createFluidResolver = (
  cache: GatsbyCache['cache'],
  token?: string,
) => async (url: string, args: GatsbyImageFluidArgs) => {
  if (!url) return

  const {
    PixelWidth: sourceWidth,
    PixelHeight: sourceHeight,
  } = await probeMetadata(url, cache, token)

  return buildFluidGatsbyImage(url, sourceWidth, sourceHeight, args, token)
}
