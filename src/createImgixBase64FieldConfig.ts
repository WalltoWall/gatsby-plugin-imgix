import { Cache } from 'gatsby'
import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLFieldConfig,
} from 'gatsby/graphql'
import { FixedObject, FluidObject } from 'gatsby-image'

import { fetchImgixBase64Url, ImgixResolveUrl } from './shared'

interface CreateImgixBase64UrlFieldConfigArgs {
  resolveUrl?: ImgixResolveUrl<FixedObject | FluidObject>
  secureUrlToken?: string
  cache: Cache['cache']
}

export const createImgixBase64UrlFieldConfig = <TContext>({
  resolveUrl = obj => obj.base64,
  secureUrlToken,
  cache,
}: CreateImgixBase64UrlFieldConfigArgs): GraphQLFieldConfig<
  FixedObject | FluidObject,
  TContext
> => ({
  type: new GraphQLNonNull(GraphQLString),
  resolve: async obj => {
    const url = await resolveUrl(obj)
    if (!url) return

    return await fetchImgixBase64Url({ url, cache, secureUrlToken })
  },
})
