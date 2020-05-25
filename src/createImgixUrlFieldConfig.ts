import { GraphQLFieldConfig, GraphQLString } from 'gatsby/graphql'
import { ComposeFieldConfigAsObject } from 'graphql-compose'

import { buildImgixUrl } from './builders'
import { ImgixResolveUrl, ImgixUrlParamsInputType } from './shared'
import { ImgixUrlParams } from './types'
import { Maybe } from './utils'

export interface ImgixUrlArgs {
  imgixParams?: ImgixUrlParams
}

interface CreateImgixUrlFieldConfigArgs<TSource> {
  resolveUrl: ImgixResolveUrl<TSource>
  secureUrlToken?: string
  defaultImgixParams?: ImgixUrlParams
}

export const createImgixUrlFieldConfig = <TSource, TContext>({
  resolveUrl,
  secureUrlToken,
  defaultImgixParams,
}: CreateImgixUrlFieldConfigArgs<TSource>): GraphQLFieldConfig<
  TSource,
  TContext,
  ImgixUrlArgs
> => ({
  type: GraphQLString,
  args: {
    imgixParams: {
      type: ImgixUrlParamsInputType,
      defaultValue: {},
    },
  },
  resolve: async (obj, args): Promise<Maybe<string>> => {
    const url = await resolveUrl(obj)
    if (!url) return

    return buildImgixUrl(
      url,
      secureUrlToken,
    )({
      ...defaultImgixParams,
      ...args.imgixParams,
    })
  },
})

export const createImgixUrlSchemaFieldConfig = <TSource, TContext>(
  args: CreateImgixUrlFieldConfigArgs<TSource>,
): ComposeFieldConfigAsObject<TSource, TContext, ImgixUrlArgs> =>
  createImgixUrlFieldConfig(args) as ComposeFieldConfigAsObject<
    TSource,
    TContext,
    ImgixUrlArgs
  >
