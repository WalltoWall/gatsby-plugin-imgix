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
// import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
// import { Either } from 'fp-ts/lib/Either'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import { sequenceT } from 'fp-ts/lib/Apply'

import { ImgixMetadata } from './types'
import { buildImgixUrl } from './builders'
import {
  getFromCacheOr,
  fetchJSON,
  taskEitherFromSourceDataResolver,
  fetch,
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

export type ImgixSourceDataResolver<TSource, TData> = (
  obj: TSource,
) => TData | null | undefined | void | Promise<TData | null | undefined | void>

export const fetchImgixMetadata = (
  cache: GatsbyCache,
  secureUrlToken?: string,
) => (url: string): TE.TaskEither<Error, ImgixMetadata> =>
  getFromCacheOr(`gatsby-plugin-imgix-metadata-${url}`, cache, () =>
    pipe({ fm: 'json' }, buildImgixUrl(url, secureUrlToken), (u) =>
      fetchJSON(u),
    ),
  )

export const fetchImgixBase64Url = (cache: GatsbyCache) => (
  url: string,
): TE.TaskEither<Error, string> =>
  getFromCacheOr(`gatsby-plugin-imgix-base64-url-${url}`, cache, () =>
    pipe(
      url,
      fetch,
      TE.chain((res) =>
        pipe(
          TE.rightTask<Error, Buffer>(() => res.buffer()),
          TE.chain((buffer) => TE.right(buffer.toString('base64'))),
          TE.chain((base64) =>
            TE.right(
              buildBase64URL(String(res.headers.get('content-type')), base64),
            ),
          ),
        ),
      ),
    ),
  )

const sequenceTTE = sequenceT(TE.taskEither)

export const resolveDimensions = <TSource>(
  source: TSource,
  resolveWidth: ImgixSourceDataResolver<TSource, number>,
  resolveHeight: ImgixSourceDataResolver<TSource, number>,
  cache: GatsbyCache,
  secureUrlToken?: string,
) => (url: string): TaskEither<Error, [number, number]> =>
  pipe(
    sequenceTTE(
      taskEitherFromSourceDataResolver(resolveWidth)(source),
      taskEitherFromSourceDataResolver(resolveHeight)(source),
    ),
    TE.fold(
      () =>
        pipe(
          url,
          fetchImgixMetadata(cache, secureUrlToken),
          TE.map(
            ({ PixelWidth, PixelHeight }) =>
              [PixelWidth, PixelHeight] as [number, number],
          ),
        ),
      TE.right,
    ),
  )

// export const aspectRatio = (
//   width: number,
//   height: number,
// ): Either<Error, number> =>
//   height === 0
//     ? E.left(new Error('Height cannot be 0'))
//     : E.right(width / height)
