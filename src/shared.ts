import { Cache } from 'gatsby'
import {
  GraphQLFieldConfigArgumentMap,
  GraphQLInputObjectType,
  GraphQLInt,
} from 'gatsby/graphql'
import fetch from 'node-fetch'

import { buildImgixUrl } from './builders'
import { Nullable, OptionalPromise } from './utils'

export const imgixUrlParams = {
  w: { type: GraphQLInt },
  h: { type: GraphQLInt },
} as GraphQLFieldConfigArgumentMap

export const ImgixUrlParamsInputType = new GraphQLInputObjectType({
  name: 'ImgixParamsInputType',
  fields: imgixUrlParams,
})

export type ImgixResolveUrl<TSource> = (
  obj: TSource,
) => OptionalPromise<Nullable<string>>

interface ImgixMetadata {
  'Content-Type': string
  PixelWidth: number
  PixelHeight: number
}

interface GetImgixMetadataArgs {
  url: string
  cache: Cache['cache']
  secureUrlToken?: string
}

export const fetchImgixMetadata = async ({
  url,
  cache,
  secureUrlToken,
}: GetImgixMetadataArgs): Promise<ImgixMetadata> => {
  const cacheKey = `gatsby-plugin-imgix-metadata-${url}`
  const cached = await cache.get(cacheKey)
  if (cached) return cached

  const instance = new URL(url)
  instance.searchParams.set('fm', 'json')
  const unsignedJsonUrl = instance.href

  const jsonUrl = buildImgixUrl(unsignedJsonUrl, secureUrlToken)({})
  const res = await fetch(jsonUrl)
  const metadata = (await res.json()) as ImgixMetadata

  cache.set(cacheKey, metadata)

  return metadata
}

interface FetchImgixBase64UrlArgs {
  url: string
  cache: Cache['cache']
  secureUrlToken?: string
}

export const fetchImgixBase64Url = async ({
  url,
  cache,
  secureUrlToken,
}: FetchImgixBase64UrlArgs): Promise<string> => {
  const cacheKey = `gatsby-plugin-imgix-base64-url-${url}`
  const cachedValue = await cache.get(cacheKey)
  if (cachedValue) return cachedValue

  const res = await fetch(url)
  const buffer = await res.buffer()
  const base64 = buffer.toString('base64')

  const metadata = await fetchImgixMetadata({ url, cache, secureUrlToken })
  const base64URL = `data:${metadata['Content-Type']};base64,${base64}`

  cache.set(cacheKey, base64URL)

  return base64URL
}
