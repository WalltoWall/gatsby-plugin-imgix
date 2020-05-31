import { Cache } from 'gatsby'
import {
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'gatsby/graphql'
import { FixedObject } from 'gatsby-image'
import { ComposeFieldConfigAsObject } from 'graphql-compose'
import * as O from 'fp-ts/es6/Option'
import * as T from 'fp-ts/es6/Task'
import * as TE from 'fp-ts/es6/TaskEither'
import { Task } from 'fp-ts/es6/Task'
import { pipe } from 'fp-ts/es6/pipeable'

import { ImgixFixedArgs, ImgixUrlParams } from './types'
import { createImgixBase64UrlFieldConfig } from './createImgixBase64FieldConfig'
import { buildImgixFixed, DEFAULT_FIXED_WIDTH } from './builders'
import {
  ImgixResolveUrl,
  ImgixUrlParamsInputType,
  fetchImgixMetadata,
} from './shared'
import { taskEitherFromUrlResolver } from './utils'

interface CreateImgixFixedTypeArgs {
  name: string
  cache: Cache['cache']
  secureUrlToken?: string
}

export const createImgixFixedType = ({
  name,
  cache,
  secureUrlToken,
}: CreateImgixFixedTypeArgs): GraphQLObjectType<FixedObject> =>
  new GraphQLObjectType({
    name,
    fields: {
      base64: createImgixBase64UrlFieldConfig({ cache, secureUrlToken }),
      src: { type: new GraphQLNonNull(GraphQLString) },
      srcSet: { type: new GraphQLNonNull(GraphQLString) },
      srcWebp: { type: new GraphQLNonNull(GraphQLString) },
      srcSetWebp: { type: new GraphQLNonNull(GraphQLString) },
      sizes: { type: new GraphQLNonNull(GraphQLString) },
      width: { type: new GraphQLNonNull(GraphQLInt) },
      height: { type: new GraphQLNonNull(GraphQLInt) },
    },
  })

interface CreateImgixFixedFieldConfigArgs<TSource> {
  type: GraphQLObjectType<FixedObject>
  resolveUrl: ImgixResolveUrl<TSource>
  secureUrlToken?: string
  cache: Cache['cache']
  defaultImgixParams?: ImgixUrlParams
}

export const createImgixFixedFieldConfig = <TSource, TContext>({
  type,
  resolveUrl,
  secureUrlToken: rawSecureUrlToken,
  cache,
  defaultImgixParams,
}: CreateImgixFixedFieldConfigArgs<TSource>): GraphQLFieldConfig<
  TSource,
  TContext,
  ImgixFixedArgs
> => {
  const secureUrlToken = O.fromNullable(rawSecureUrlToken)

  return {
    type,
    args: {
      width: {
        type: GraphQLInt,
        defaultValue: DEFAULT_FIXED_WIDTH,
      },
      height: {
        type: GraphQLInt,
      },
      imgixParams: {
        type: ImgixUrlParamsInputType,
        defaultValue: {},
      },
    },
    resolve: (obj, args): Task<FixedObject | undefined> =>
      pipe(
        obj,
        taskEitherFromUrlResolver(resolveUrl),
        TE.chain((url) =>
          pipe(
            url,
            fetchImgixMetadata(cache, secureUrlToken),
            TE.map((metadata) =>
              buildImgixFixed({
                url,
                sourceWidth: metadata.PixelWidth,
                sourceHeight: metadata.PixelHeight,
                secureUrlToken: rawSecureUrlToken,
                args: {
                  ...args,
                  imgixParams: {
                    ...defaultImgixParams,
                    ...args.imgixParams,
                  },
                },
              }),
            ),
          ),
        ),
        TE.fold(() => T.of(undefined), T.of),
      ),
  }
}

export const createImgixFixedSchemaFieldConfig = <TSource, TContext>(
  args: CreateImgixFixedFieldConfigArgs<TSource>,
): ComposeFieldConfigAsObject<TSource, TContext, ImgixFixedArgs> =>
  createImgixFixedFieldConfig(args) as ComposeFieldConfigAsObject<
    TSource,
    TContext,
    ImgixFixedArgs
  >
