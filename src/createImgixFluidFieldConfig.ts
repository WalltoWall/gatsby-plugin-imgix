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
import * as O from 'fp-ts/lib/Option'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'

import { ImgixFluidArgs, ImgixUrlParams } from './types'
import { createImgixBase64UrlFieldConfig } from './createImgixBase64FieldConfig'
import { buildImgixFluid, DEFAULT_FLUID_MAX_WIDTH } from './builders'
import {
  ImgixResolveUrl,
  ImgixUrlParamsInputType,
  fetchImgixMetadata,
} from './shared'
import { taskEitherFromUrlResolver } from './utils'

interface CreateImgixFluidTypeArgs {
  name: string
  cache: GatsbyCache
  secureUrlToken?: string
}

export const createImgixFluidType = ({
  name,
  cache,
  secureUrlToken,
}: CreateImgixFluidTypeArgs): GraphQLObjectType<FluidObject> =>
  new GraphQLObjectType({
    name,
    fields: {
      base64: createImgixBase64UrlFieldConfig({ cache, secureUrlToken }),
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
  resolveUrl: ImgixResolveUrl<TSource>
  secureUrlToken?: string
  cache: GatsbyCache
  defaultImgixParams?: ImgixUrlParams
  defaultPlaceholderImgixParams?: ImgixUrlParams
}

export const createImgixFluidFieldConfig = <TSource, TContext>({
  type,
  resolveUrl,
  secureUrlToken: rawSecureUrlToken,
  cache,
  defaultImgixParams,
  defaultPlaceholderImgixParams,
}: CreateImgixFluidFieldConfigArgs<TSource>): GraphQLFieldConfig<
  TSource,
  TContext,
  ImgixFluidArgs
> => {
  const secureUrlToken = O.fromNullable(rawSecureUrlToken)

  return {
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
        taskEitherFromUrlResolver(resolveUrl),
        TE.chain((url) =>
          pipe(
            url,
            fetchImgixMetadata(cache, secureUrlToken),
            TE.map((metadata) =>
              buildImgixFluid({
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
                  placeholderImgixParams: {
                    ...defaultImgixParams,
                    ...args.imgixParams,
                    ...defaultPlaceholderImgixParams,
                    ...args.placeholderImgixParams,
                  },
                },
              }),
            ),
          ),
        ),
        TE.fold(() => T.of(undefined), T.of),
      )(),
  }
}

export const createImgixFluidSchemaFieldConfig = <TSource, TContext>(
  args: CreateImgixFluidFieldConfigArgs<TSource>,
): ComposeFieldConfigAsObject<TSource, TContext, ImgixFluidArgs> =>
  createImgixFluidFieldConfig(args) as ComposeFieldConfigAsObject<
    TSource,
    TContext,
    ImgixFluidArgs
  >
