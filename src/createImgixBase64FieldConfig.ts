import { GatsbyCache } from 'gatsby'
import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLFieldConfig,
} from 'gatsby/graphql'
import { FixedObject, FluidObject } from 'gatsby-image'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'

import { fetchImgixBase64Url, ImgixSourceDataResolver } from './shared'
import { taskEitherFromSourceDataResolver } from './utils'

interface CreateImgixBase64UrlFieldConfigArgs {
  resolveUrl?: ImgixSourceDataResolver<FixedObject | FluidObject, string>
  cache: GatsbyCache
}

export const createImgixBase64UrlFieldConfig = <TContext>({
  resolveUrl = (obj: FixedObject | FluidObject): string | null | undefined =>
    obj.base64,
  cache,
}: CreateImgixBase64UrlFieldConfigArgs): GraphQLFieldConfig<
  FixedObject | FluidObject,
  TContext
> => ({
  type: new GraphQLNonNull(GraphQLString),
  resolve: (obj: FixedObject | FluidObject): Promise<string | undefined> =>
    pipe(
      obj,
      taskEitherFromSourceDataResolver(resolveUrl),
      TE.chain(fetchImgixBase64Url(cache)),
      TE.fold(() => T.of(undefined), T.of),
    )(),
})
