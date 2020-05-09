import {
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLString,
} from 'gatsby/graphql'

import { buildImgixUrl } from './builders'
import { ImgixUrlParamsInputType } from './shared'
import { ImgixUrlParams, ImgixResolveUrl } from './types'
import { Maybe } from './utils'

export interface ImgixUrlArgs {
  imgixParams?: ImgixUrlParams
}

const imgixUrlArgs = {
  imgixParams: { type: ImgixUrlParamsInputType, defaultValue: {} },
} as GraphQLFieldConfigArgumentMap

interface CreateImgixUrlFieldConfigArgs<TSource> {
  /**
   * Function that maps the field's parent object to an Imgix URL.
   *
   * @example If the parent is the URL
   * ```
   * (url: string) => url
   * ```
   *
   * @example If the parent is an object with a field named `image` containing an Imgix URL
   * ```
   * (parent: ParentNode) => parent.image
   * ```
   */
  resolveUrl: ImgixResolveUrl<TSource>

  /** Imgix secure URL token used to sign URLs. If a token is provided, all URLs will be signed. This is recommended. */
  secureUrlToken?: string

  /**
   * Default Imgix URL parameters to assign to all images.
   *
   * @example Automatic compression and format
   * ```
   * { auto: { format: true, compress: true } }
   * ```
   *
   * @example Convert all images to grayscale
   * ```
   * { sat: -100 }
   * ```
   */
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
