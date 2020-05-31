import { GatsbyCache } from 'gatsby'
import {
  GraphQLInputObjectType,
  GraphQLInputFieldConfigMap,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
} from 'gatsby/graphql'
import imgixUrlParameters from 'imgix-url-params/dist/parameters.json'
import { camelCase } from 'camel-case'
import * as TE from 'fp-ts/lib/TaskEither'
import { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { sequenceS } from 'fp-ts/lib/Apply'

import { ImgixMetadata } from './types'
import { buildImgixUrl } from './builders'
import {
  Nullable,
  OptionalPromise,
  getFromCacheOr,
  fetchBase64,
  fetchJSON,
  buildBase64URL,
} from './utils'

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

export const fetchImgixMetadata = (
  cache: GatsbyCache,
  secureUrlToken: Option<string>,
) => (url: string): TE.TaskEither<Error, ImgixMetadata> =>
  getFromCacheOr(`gatsby-plugin-imgix-metadata-${url}`, cache, () =>
    pipe({ fm: 'json' }, buildImgixUrl(url, secureUrlToken), (u) =>
      fetchJSON(u),
    ),
  )

export const fetchImgixBase64Url = (
  cache: GatsbyCache,
  secureUrlToken: Option<string>,
) => (url: string): TE.TaskEither<Error, string> =>
  getFromCacheOr(`gatsby-plugin-imgix-base64-url-${url}`, cache, () =>
    pipe(
      {
        metadata: fetchImgixMetadata(cache, secureUrlToken)(url),
        base64: fetchBase64(url),
      },
      sequenceS(TE.taskEither),
      TE.map(({ metadata, base64 }) =>
        buildBase64URL(metadata['Content-Type'], base64),
      ),
    ),
  )
