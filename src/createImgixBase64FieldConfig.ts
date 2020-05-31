import { GatsbyCache } from 'gatsby'
import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLFieldConfig,
} from 'gatsby/graphql'
import { FixedObject, FluidObject } from 'gatsby-image'
import * as O from 'fp-ts/lib/Option'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'

import { fetchImgixBase64Url, ImgixResolveUrl } from './shared'
import { taskEitherFromUrlResolver } from './utils'

interface CreateImgixBase64UrlFieldConfigArgs {
  resolveUrl?: ImgixResolveUrl<FixedObject | FluidObject>
  secureUrlToken?: string
  cache: GatsbyCache
}

export const createImgixBase64UrlFieldConfig = <TContext>({
  resolveUrl = (obj: FixedObject | FluidObject): string | null | undefined =>
    obj.base64,
  secureUrlToken: rawSecureUrlToken,
  cache,
}: CreateImgixBase64UrlFieldConfigArgs): GraphQLFieldConfig<
  FixedObject | FluidObject,
  TContext
> => {
  const secureUrlToken = O.fromNullable(rawSecureUrlToken)

  return {
    type: new GraphQLNonNull(GraphQLString),
    resolve: (obj: FixedObject | FluidObject): Promise<string | undefined> =>
      pipe(
        obj,
        taskEitherFromUrlResolver(resolveUrl),
        TE.chain(fetchImgixBase64Url(cache, secureUrlToken)),
        TE.fold(() => T.of(undefined), T.of),
      )(),
  }
}
