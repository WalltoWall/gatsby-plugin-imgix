import { Cache } from 'gatsby'
import {
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'gatsby/graphql'

import { createImgixBase64UrlFieldConfig } from './createImgixBase64FieldConfig'
import { buildImgixFluid, DEFAULT_FLUID_MAX_WIDTH } from './builders'
import {
  ImgixResolveUrl,
  ImgixUrlParams,
  ImgixUrlParamsInputType,
  fetchImgixMetadata,
} from './shared'
import { ns } from './utils'

export interface ImgixFluidArgs {
  maxWidth: number
  maxHeight?: number
  srcSetBreakpoints?: number[]
  imgixParams: ImgixUrlParams
}

const imgixFluidArgs = {
  maxWidth: { type: GraphQLInt, defaultValue: DEFAULT_FLUID_MAX_WIDTH },
  maxHeight: { type: GraphQLInt },
  srcSetBreakpoints: { type: new GraphQLList(GraphQLInt) },
  imgixParams: { type: ImgixUrlParamsInputType, defaultValue: {} },
} as GraphQLFieldConfigArgumentMap

interface CreateImgixFluidFieldConfigArgs<TSource> {
  resolveUrl: ImgixResolveUrl<TSource>
  secureUrlToken?: string
  namespace?: string
  cache: Cache['cache']
  defaultImgixParams?: ImgixUrlParams
}

export const createImgixFluidFieldConfig = <TSource, TContext>({
  resolveUrl,
  secureUrlToken,
  namespace,
  cache,
  defaultImgixParams,
}: CreateImgixFluidFieldConfigArgs<TSource>): GraphQLFieldConfig<
  TSource,
  TContext,
  ImgixFluidArgs
> => {
  const ImgixFluidType = new GraphQLObjectType({
    name: ns(namespace, 'ImgixFluid'),
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

  return {
    type: ImgixFluidType,
    args: imgixFluidArgs,
    resolve: async (obj, args) => {
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
  }
}
