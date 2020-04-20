import {
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLString,
} from 'gatsby/graphql'

import { buildImgixUrl } from './builders'
import {
  ImgixResolveUrl,
  ImgixUrlParams,
  ImgixUrlParamsInputType,
} from './shared'

export interface ImgixUrlArgs {
  imgixParams: ImgixUrlParams
}

const imgixUrlArgs = {
  imgixParams: { type: ImgixUrlParamsInputType, defaultValue: {} },
} as GraphQLFieldConfigArgumentMap

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
  args: imgixUrlArgs,
  resolve: async (obj, args) => {
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
