import { GatsbyCache } from 'gatsby'
import {
  GraphQLFieldConfig,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'gatsby/graphql'
import { FluidObject } from 'gatsby-image'
import { ComposeFieldConfigAsObject } from 'graphql-compose'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'

import { ImgixFluidArgs, ImgixUrlParams } from './types'
import { createImgixBase64UrlFieldConfig } from './createImgixBase64FieldConfig'
import { buildImgixFluid, DEFAULT_FLUID_MAX_WIDTH } from './builders'
import {
  ImgixSourceDataResolver,
  ImgixUrlParamsInputType,
  resolveDimensions,
} from './shared'
import { taskEitherFromSourceDataResolver, noop } from './utils'

interface CreateImgixFluidTypeArgs {
  name: string
  cache: GatsbyCache
}

export const createImgixFluidType = ({
  name,
  cache,
}: CreateImgixFluidTypeArgs): GraphQLObjectType<FluidObject> =>
  new GraphQLObjectType({
    name,
    fields: {
      base64: createImgixBase64UrlFieldConfig({ cache }),
      src: { type: new GraphQLNonNull(GraphQLString) },
      srcSet: { type: new GraphQLNonNull(GraphQLString) },
      srcWebp: { type: new GraphQLNonNull(GraphQLString) },
      srcSetWebp: { type: new GraphQLNonNull(GraphQLString) },
      sizes: { type: new GraphQLNonNull(GraphQLString) },
      aspectRatio: { type: new GraphQLNonNull(GraphQLFloat) },
    },
  })

interface CreateImgixFluidFieldConfigArgs<TSource> {
  type: GraphQLObjectType<FluidObject>
  resolveUrl: ImgixSourceDataResolver<TSource, string>
  resolveWidth?: ImgixSourceDataResolver<TSource, number>
  resolveHeight?: ImgixSourceDataResolver<TSource, number>
  secureUrlToken?: string
  cache: GatsbyCache
  defaultImgixParams?: ImgixUrlParams
  defaultPlaceholderImgixParams?: ImgixUrlParams
}

export const createImgixFluidFieldConfig = <TSource, TContext>({
  type,
  resolveUrl,
  resolveWidth = noop,
  resolveHeight = noop,
  secureUrlToken,
  cache,
  defaultImgixParams,
  defaultPlaceholderImgixParams,
}: CreateImgixFluidFieldConfigArgs<TSource>): GraphQLFieldConfig<
  TSource,
  TContext,
  ImgixFluidArgs
> => ({
  type,
  args: {
    maxWidth: {
      type: GraphQLInt,
      defaultValue: DEFAULT_FLUID_MAX_WIDTH,
    },
    maxHeight: {
      type: GraphQLInt,
    },
    srcSetBreakpoints: {
      type: new GraphQLList(GraphQLInt),
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
    args: ImgixFluidArgs,
  ): Promise<FluidObject | undefined> =>
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
            buildImgixFluid({
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

export const createImgixFluidSchemaFieldConfig = <TSource, TContext>(
  args: CreateImgixFluidFieldConfigArgs<TSource>,
): ComposeFieldConfigAsObject<TSource, TContext, ImgixFluidArgs> =>
  createImgixFluidFieldConfig(args) as ComposeFieldConfigAsObject<
    TSource,
    TContext,
    ImgixFluidArgs
  >
