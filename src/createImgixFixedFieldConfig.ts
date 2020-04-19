import { Cache } from 'gatsby'
import {
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
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

export interface ImgixFixedArgs {
  width: number
  height?: number
  imgixParams: ImgixUrlParams
}

const imgixFixedArgs = {
  width: { type: GraphQLInt, defaultValue: 400 },
  height: { type: GraphQLInt },
  imgixParams: { type: ImgixUrlParamsInputType, defaultValue: {} },
} as GraphQLFieldConfigArgumentMap

interface CreateImgixFixedFieldConfigArgs<TSource> {
  resolveUrl: ImgixResolveUrl<TSource>
  secureURLToken?: string
  namespace?: string
  cache: Cache['cache']
}

export const createImgixFixedFieldConfig = <TSource, TContext>({
  resolveUrl,
  secureURLToken,
  namespace,
  cache,
}: CreateImgixFixedFieldConfigArgs<TSource>): GraphQLFieldConfig<
  TSource,
  TContext,
  ImgixFixedArgs
> => {
  const ImgixFixedType = new GraphQLObjectType({
    name: ns(namespace, 'ImgixFixed'),
    fields: {
      base64: createImgixBase64UrlFieldConfig({ cache, secureURLToken }),
      src: { type: new GraphQLNonNull(GraphQLString) },
      srcSet: { type: new GraphQLNonNull(GraphQLString) },
      srcWebp: { type: new GraphQLNonNull(GraphQLString) },
      srcSetWebp: { type: new GraphQLNonNull(GraphQLString) },
      sizes: { type: new GraphQLNonNull(GraphQLString) },
      width: { type: new GraphQLNonNull(GraphQLInt) },
      height: { type: new GraphQLNonNull(GraphQLInt) },
    },
  })

  return {
    type: ImgixFixedType,
    args: imgixFixedArgs,
    resolve: async (obj, args) => {
      const url = await resolveUrl(obj)
      if (!url) return

      return buildImgixFixed(url, secureURLToken)(args.imgixParams)
    },
  }
}
