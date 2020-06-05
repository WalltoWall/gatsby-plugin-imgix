import { GatsbyCache } from 'gatsby'
import {
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'gatsby/graphql'
import { FixedObject } from 'gatsby-image'
import { ComposeFieldConfigAsObject } from 'graphql-compose'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'

import { ImgixFixedArgs, ImgixUrlParams } from './types'
import { createImgixBase64UrlFieldConfig } from './createImgixBase64FieldConfig'
import { buildImgixFixed, DEFAULT_FIXED_WIDTH } from './builders'
import {
  ImgixSourceDataResolver,
  ImgixUrlParamsInputType,
  resolveDimensions,
} from './shared'
import { taskEitherFromSourceDataResolver, noop } from './utils'

interface CreateImgixFixedTypeArgs {
  name: string
  cache: GatsbyCache
}

export const createImgixFixedType = ({
  name,
  cache,
}: CreateImgixFixedTypeArgs): GraphQLObjectType<FixedObject> =>
  new GraphQLObjectType({
    name,
    fields: {
      base64: createImgixBase64UrlFieldConfig({ cache }),
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
  resolveUrl: ImgixSourceDataResolver<TSource, string>
  resolveWidth?: ImgixSourceDataResolver<TSource, number>
  resolveHeight?: ImgixSourceDataResolver<TSource, number>
  secureUrlToken?: string
  cache: GatsbyCache
  defaultImgixParams?: ImgixUrlParams
  defaultPlaceholderImgixParams?: ImgixUrlParams
}

export const createImgixFixedFieldConfig = <TSource, TContext>({
  type,
  resolveUrl,
  resolveWidth = noop,
  resolveHeight = noop,
  secureUrlToken,
  cache,
  defaultImgixParams,
  defaultPlaceholderImgixParams,
}: CreateImgixFixedFieldConfigArgs<TSource>): GraphQLFieldConfig<
  TSource,
  TContext,
  ImgixFixedArgs
> => ({
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
    placeholderImgixParams: {
      type: ImgixUrlParamsInputType,
      defaultValue: {},
    },
  },
  resolve: (
    obj: TSource,
    args: ImgixFixedArgs,
  ): Promise<FixedObject | undefined> =>
    pipe(
      obj,
      taskEitherFromSourceDataResolver(
        resolveUrl,
        (url) => typeof url === 'string',
      ),
      TE.chain((url) =>
        pipe(
          url,
          resolveDimensions(
            obj,
            resolveWidth,
            resolveHeight,
            cache,
            secureUrlToken,
          ),
          TE.map(([width, height]) =>
            buildImgixFixed({
              url,
              sourceWidth: width,
              sourceHeight: height,
              secureUrlToken,
              args: {
                ...args,
                imgixParams: {
                  ...defaultImgixParams,
                  ...args.imgixParams,
                },
                placeholderImgixParams: {
                  ...defaultPlaceholderImgixParams,
                  ...args.placeholderImgixParams,
                },
              },
            }),
          ),
        ),
      ),
      TE.getOrElseW(() => T.of(undefined)),
    )(),
})

export const createImgixFixedSchemaFieldConfig = <TSource, TContext>(
  args: CreateImgixFixedFieldConfigArgs<TSource>,
): ComposeFieldConfigAsObject<TSource, TContext, ImgixFixedArgs> =>
  createImgixFixedFieldConfig(args) as ComposeFieldConfigAsObject<
    TSource,
    TContext,
    ImgixFixedArgs
  >
