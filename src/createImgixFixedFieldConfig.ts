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
import { buildImgixFixed, DEFAULT_FIXED_WIDTH } from './urlBuilders'
import {
  ImgixResolveUrl,
  ImgixUrlParams,
  ImgixUrlParamsInputType,
  fetchImgixMetadata,
} from './shared'
import { ns } from './utils'

export interface ImgixFixedArgs {
  width: number
  height?: number
  imgixParams: ImgixUrlParams
}

const imgixFixedArgs = {
  width: { type: GraphQLInt, defaultValue: DEFAULT_FIXED_WIDTH },
  height: { type: GraphQLInt },
  imgixParams: { type: ImgixUrlParamsInputType, defaultValue: {} },
} as GraphQLFieldConfigArgumentMap

interface CreateImgixFixedFieldConfigArgs<TSource> {
  resolveUrl: ImgixResolveUrl<TSource>
  secureUrlToken?: string
  namespace?: string
  cache: Cache['cache']
  defaultImgixParams?: ImgixUrlParams
}

export const createImgixFixedFieldConfig = <TSource, TContext>({
  resolveUrl,
  secureUrlToken,
  namespace,
  cache,
  defaultImgixParams,
}: CreateImgixFixedFieldConfigArgs<TSource>): GraphQLFieldConfig<
  TSource,
  TContext,
  ImgixFixedArgs
> => {
  const ImgixFixedType = new GraphQLObjectType({
    name: ns(namespace, 'ImgixFixed'),
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

  return {
    type: ImgixFixedType,
    args: imgixFixedArgs,
    resolve: async (obj, args) => {
      const url = await resolveUrl(obj)
      if (!url) return

      const metadata = await fetchImgixMetadata({ url, cache, secureUrlToken })

      return buildImgixFixed({
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
