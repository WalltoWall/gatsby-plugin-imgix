import { Cache } from 'gatsby'
import {
  GraphQLFieldConfigArgumentMap,
  GraphQLInputObjectType,
  GraphQLInt,
} from 'gatsby/graphql'
import { buildImgixUrl as _buildImgixUrl, ImgixUrlQueryParams } from 'ts-imgix'
import { createHash } from 'crypto'
import fetch from 'node-fetch'

import { Nullable, OptionalPromise } from './utils'

export interface ImgixUrlParams {
  w?: number
  h?: number
}

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

export const buildImgixUrl = (url: string, token?: string) => (
  params: ImgixUrlQueryParams,
) => {
  const imgixUrl = _buildImgixUrl(url)(params)
  const parsed = new URL(imgixUrl)

  const signatureBase = token + parsed.pathname + parsed.search
  const signature = createHash('md5')
    .update(signatureBase)
    .digest('hex')

  parsed.searchParams.append('s', signature)

  return parsed.href
}

interface ImgixMetadata {
  'Content-Type': string
  PixelWidth: number
  PixelHeight: number
}

interface GetImgixMetadataArgs {
  url: string
  cache: Cache['cache']
  secureURLToken?: string
}

export const fetchImgixMetadata = async ({
  url,
  cache,
  secureURLToken,
}: GetImgixMetadataArgs): Promise<ImgixMetadata> => {
  const cacheKey = `gatsby-plugin-imgix-metadata-${url}`
  const cached = await cache.get(cacheKey)
  if (cached) return cached

  const jsonUrl = buildImgixUrl(url, secureURLToken)({ fm: 'json' })
  const res = await fetch(jsonUrl)
  const metadata = (await res.json()) as ImgixMetadata

  cache.set(cacheKey, metadata)

  return metadata
}

interface FetchImgixBase64UrlArgs {
  url: string
  cache: Cache['cache']
  secureURLToken?: string
}

export const fetchImgixBase64Url = async ({
  url,
  cache,
  secureURLToken,
}: FetchImgixBase64UrlArgs): Promise<string> => {
  const cacheKey = `gatsby-plugin-imgix-base64-url-${url}`
  const cachedValue = await cache.get(cacheKey)
  if (cachedValue) return cachedValue

  const res = await fetch(url)
  const buffer = await res.buffer()
  const base64 = buffer.toString('base64')

  const metadata = await fetchImgixMetadata({ url, cache, secureURLToken })
  const base64URL = `data:${metadata['Content-Type']};base64,${base64}`

  cache.set(cacheKey, base64URL)

  return base64URL
}
