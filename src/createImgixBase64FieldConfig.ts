import { Cache } from 'gatsby'
import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLFieldConfig,
} from 'gatsby/graphql'

import { fetchImgixBase64Url } from './shared'

interface CreateImgixBase64UrlFieldConfigArgs {
  cache: Cache['cache']
  secureUrlToken?: string
}

export const createImgixBase64UrlFieldConfig = <TContext>({
  cache,
  secureUrlToken,
}: CreateImgixBase64UrlFieldConfigArgs): GraphQLFieldConfig<
  string,
  TContext
> => ({
  type: new GraphQLNonNull(GraphQLString),
  resolve: async url => {
    if (!url) return

    return await fetchImgixBase64Url({ url, cache, secureUrlToken })
  },
})
