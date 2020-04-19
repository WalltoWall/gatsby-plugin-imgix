import { Cache } from 'gatsby'
import {
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'gatsby/graphql'

import { createImgixBase64UrlFieldConfig } from './createImgixBase64FieldConfig'
import {
  ImgixResolveUrl,
  ImgixUrlParams,
  ImgixUrlParamsInputType,
} from './shared'
import { ns } from './utils'

export interface ImgixFluidArgs {
  maxWidth: number
  maxHeight?: number
  imgixParams: ImgixUrlParams
}

const imgixFluidArgs = {
  maxWidth: { type: GraphQLInt, defaultValue: 800 },
  maxHeight: { type: GraphQLInt },
  imgixParams: { type: ImgixUrlParamsInputType, defaultValue: {} },
} as GraphQLFieldConfigArgumentMap

interface CreateImgixFluidFieldConfigArgs<TSource> {
  resolveUrl: ImgixResolveUrl<TSource>
  secureURLToken?: string
  namespace?: string
  cache: Cache['cache']
}

export const createImgixFluidFieldConfig = <TSource, TContext>({
  resolveUrl,
  secureURLToken,
  namespace,
  cache,
}: CreateImgixFluidFieldConfigArgs<TSource>): GraphQLFieldConfig<
  TSource,
  TContext,
  ImgixFluidArgs
> => {
  const ImgixFluidType = new GraphQLObjectType({
    name: ns(namespace, 'ImgixFluid'),
    fields: {
      base64: createImgixBase64UrlFieldConfig({ cache, secureURLToken }),
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

      return buildImgixFluid(url, secureURLToken)(args.imgixParams)
    },
  }
}
