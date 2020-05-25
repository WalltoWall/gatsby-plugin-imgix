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

import { createImgixBase64UrlFieldConfig } from './createImgixBase64FieldConfig'
import { buildImgixFixed, DEFAULT_FIXED_WIDTH } from './builders'
import {
  ImgixResolveUrl,
  ImgixUrlParamsInputType,
  fetchImgixMetadata,
} from './shared'
import { Maybe } from './utils'
import { ImgixFixedArgs, ImgixUrlParams } from './types'

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
  secureUrlToken,
  cache,
  defaultImgixParams,
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
  },
  resolve: async (obj, args): Promise<Maybe<FixedObject>> => {
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
})

export const createImgixFixedSchemaFieldConfig = <TSource, TContext>(
  args: CreateImgixFixedFieldConfigArgs<TSource>,
): ComposeFieldConfigAsObject<TSource, TContext, ImgixFixedArgs> =>
  createImgixFixedFieldConfig(args) as ComposeFieldConfigAsObject<
    TSource,
    TContext,
    ImgixFixedArgs
  >
