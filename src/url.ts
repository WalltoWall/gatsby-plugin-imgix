import { ImgixUrlQueryParams } from 'ts-imgix'

import { buildURL } from './urlBuilders'

interface CreateUrlResolverArgs {
  secureURLToken?: string
}

export type UrlArgs = {
  imgixParams?: ImgixUrlQueryParams
}

export const createUrlResolver = ({
  secureURLToken,
}: CreateUrlResolverArgs) => (url: string, args: UrlArgs) =>
  buildURL({ url, params: args.imgixParams, secureURLToken })
