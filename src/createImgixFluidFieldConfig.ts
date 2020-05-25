import { Cache } from 'gatsby'
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

import { createImgixBase64UrlFieldConfig } from './createImgixBase64FieldConfig'
import { buildImgixFluid, DEFAULT_FLUID_MAX_WIDTH } from './builders'
import {
  ImgixResolveUrl,
  ImgixUrlParamsInputType,
  fetchImgixMetadata,
} from './shared'
import { Maybe } from './utils'
import { ImgixFluidArgs, ImgixUrlParams } from './types'

interface CreateImgixFluidTypeArgs {
  name: string
  cache: Cache['cache']
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
  cache: Cache['cache']
  defaultImgixParams?: ImgixUrlParams
}

export const createImgixFluidFieldConfig = <TSource, TContext>({
  type,
  resolveUrl,
  secureUrlToken,
  cache,
  defaultImgixParams,
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
  },
  resolve: async (obj, args): Promise<Maybe<FluidObject>> => {
    const url = await resolveUrl(obj)
    if (!url) return

    const metadata = await fetchImgixMetadata({ url, cache, secureUrlToken })

    return buildImgixFluid({
      url,
      sourceWidth: metadata.PixelWidth,
      sourceHeight: metadata.PixelHeight,
      secureUrlToken,
      args: {
        ...args,
        imgixParams: {
          ...defaultImgixParams,
          ...args.imgixParams,
        },
      },
    })
  },
})

export const createImgixFluidSchemaFieldConfig = <TSource, TContext>(
  args: CreateImgixFluidFieldConfigArgs<TSource>,
): ComposeFieldConfigAsObject<TSource, TContext, ImgixFluidArgs> =>
  createImgixFluidFieldConfig(args) as ComposeFieldConfigAsObject<
    TSource,
    TContext,
    ImgixFluidArgs
  >
