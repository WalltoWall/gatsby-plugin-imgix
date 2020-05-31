import { Cache } from 'gatsby'
import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLFieldConfig,
} from 'gatsby/graphql'
import { FixedObject, FluidObject } from 'gatsby-image'
import * as O from 'fp-ts/es6/Option'
import * as T from 'fp-ts/es6/Task'
import * as TE from 'fp-ts/es6/TaskEither'
import { Task } from 'fp-ts/es6/Task'
import { pipe } from 'fp-ts/es6/pipeable'

import { fetchImgixBase64Url, ImgixResolveUrl } from './shared'
import { taskEitherFromUrlResolver } from './utils'

interface CreateImgixBase64UrlFieldConfigArgs {
  resolveUrl?: ImgixResolveUrl<FixedObject | FluidObject>
  secureUrlToken?: string
  cache: Cache['cache']
}

export const createImgixBase64UrlFieldConfig = <TContext>({
  resolveUrl = (obj): string | null | undefined => obj.base64,
  secureUrlToken: rawSecureUrlToken,
  cache,
}: CreateImgixBase64UrlFieldConfigArgs): GraphQLFieldConfig<
  FixedObject | FluidObject,
  TContext
> => {
  const secureUrlToken = O.fromNullable(rawSecureUrlToken)

  return {
    type: new GraphQLNonNull(GraphQLString),
    resolve: (obj): Task<string | undefined> =>
      pipe(
        obj,
        taskEitherFromUrlResolver(resolveUrl),
        TE.chain(fetchImgixBase64Url(cache, secureUrlToken)),
        TE.fold(() => T.of(undefined), T.of),
      ),
  }
}
