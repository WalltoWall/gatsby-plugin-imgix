import {
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLString,
} from 'gatsby/graphql'

import { buildImgixUrl } from './builders'
import { ImgixResolveUrl, ImgixUrlParamsInputType } from './shared'
import { ImgixUrlParams } from './types'
import { Maybe } from './utils'

export interface ImgixUrlArgs {
  imgixParams?: ImgixUrlParams
}

const imgixUrlArgs = {
  imgixParams: { type: ImgixUrlParamsInputType, defaultValue: {} },
} as GraphQLFieldConfigArgumentMap

interface CreateImgixUrlFieldConfigArgs<TSource> {
  resolveUrl: ImgixResolveUrl<TSource>
  secureUrlToken?: string
  defaultImgixParams?: ImgixUrlParams
}

/**
 * Creates a GraphQL field config object that resolves an Imgix URL string to one with URL parameters.
 *
 * @returns GraphQL field config to pass to a GraphQL constructor or a Gatsby schema builder.
 */
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
