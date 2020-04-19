import {
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLString,
} from 'gatsby/graphql'

import {
  ImgixResolveUrl,
  ImgixUrlParams,
  ImgixUrlParamsInputType,
  buildImgixUrl,
} from './shared'

export interface ImgixUrlArgs {
  imgixParams: ImgixUrlParams
}

const imgixUrlArgs = {
  imgixParams: { type: ImgixUrlParamsInputType, defaultValue: {} },
} as GraphQLFieldConfigArgumentMap

interface CreateImgixUrlFieldConfigArgs<TSource> {
  resolveUrl: ImgixResolveUrl<TSource>
  secureURLToken?: string
}

export const createImgixUrlFieldConfig = <TSource, TContext>({
  resolveUrl,
  secureURLToken,
}: CreateImgixUrlFieldConfigArgs<TSource>): GraphQLFieldConfig<
  TSource,
  TContext,
  ImgixUrlArgs
> => ({
  type: GraphQLString,
  args: imgixUrlArgs,
  resolve: async (obj, args) => {
    const url = await resolveUrl(obj)
    if (!url) return

    buildImgixUrl(url, secureURLToken)(args.imgixParams)
  },
})
