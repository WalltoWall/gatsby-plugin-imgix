import { Cache } from 'gatsby'
import {
  GraphQLInputObjectType,
  GraphQLInputFieldConfigMap,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
} from 'gatsby/graphql'
import fetch from 'node-fetch'
import { camelCase } from 'camel-case'
import imgixUrlParameters from 'imgix-url-params/dist/parameters.json'

import { buildImgixUrl } from './builders'
import { Nullable, OptionalPromise } from './utils'

export const ImgixUrlParamsInputType = new GraphQLInputObjectType({
  name: 'ImgixUrlParamsInput',
  fields: Object.keys(imgixUrlParameters.parameters).reduce((fields, param) => {
    const spec =
      imgixUrlParameters.parameters[
        param as keyof typeof imgixUrlParameters.parameters
      ]

    // The param name is camel-cased here to appease the GraphQL field
    // requirements. This will need to be reversed with param-case when the
    // URL is constructed in `buildImgixUrl`.
    const name = camelCase(param)

    const expects = spec.expects as { type: string }[]
    const expectsTypes = Array.from(
      new Set(expects.map((expect) => expect.type)),
    )

    // TODO: Clean up this mess.
    const type = expectsTypes.every(
      (type) => type === 'integer' || type === 'unit_scalar',
    )
      ? GraphQLInt
      : expectsTypes.every(
          (type) =>
            type === 'integer' || type === 'unit_scalar' || type === 'number',
        )
      ? GraphQLFloat
      : expectsTypes.every((type) => type === 'boolean')
      ? GraphQLBoolean
      : GraphQLString

    fields[name] = {
      type,
      description:
        spec.short_description +
        // Ensure the description ends with a period.
        (spec.short_description.slice(-1) === '.' ? '' : '.'),
    }

    // Add the default value as part of the description. Setting it as a
    // GraphQL default value will automatically assign it in the final URL.
    // Doing so would result in a huge number of unwanted params.
    if ('default' in spec)
      fields[name].description =
        fields[name].description + ` Default: \`${spec.default}\`.`

    // Add Imgix documentation URL as part of the description.
    if ('url' in spec)
      fields[name].description =
        fields[name].description + ` [See docs](${spec.url}).`

    // Create aliased fields.
    if ('aliases' in spec)
      for (const alias of spec.aliases)
        fields[camelCase(alias)] = {
          ...fields[name],
          description: `Alias for \`${name}\`.`,
        }

    return fields
  }, {} as GraphQLInputFieldConfigMap),
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
