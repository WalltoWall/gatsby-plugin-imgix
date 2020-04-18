import { Cache as GatsbyCache } from 'gatsby'
import { FixedObject, FluidObject } from 'gatsby-image'
import { GraphQLResolveInfo } from 'graphql'

import { fetchBase64URL } from './utils'

interface CreateBase64URLResolverArgs {
  cache: GatsbyCache['cache']
  secureURLToken?: string
}

export const createBase64URLResolver = ({
  cache,
  secureURLToken,
}: CreateBase64URLResolverArgs) => async (
  obj: FixedObject | FluidObject,
  _args: any,
  _context: any,
  info: GraphQLResolveInfo,
) => {
  const url = obj[info.fieldName as keyof typeof obj]

  if (!url) return

  return await fetchBase64URL({ url, cache, secureURLToken })
}
