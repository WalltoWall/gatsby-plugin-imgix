import * as gatsby from 'gatsby'
import { ComposeFieldConfigAsObject } from 'graphql-compose'
import { FixedObject, FluidObject } from 'gatsby-image'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/pipeable'

import { fetchImgixBase64Url, ImgixSourceDataResolver } from './shared'
import { taskEitherFromSourceDataResolver } from './utils'

export interface CreateImgixBase64UrlFieldConfigArgs {
  /** Function mapping the source object to the URL to resolve to a Base64 URL. */
  resolveUrl?: ImgixSourceDataResolver<FixedObject | FluidObject, string>
  /** Gatsby cache from a Gatsby Node API. */
  cache: gatsby.GatsbyCache
}

/**
 * Creates a configuration object for a GraphQL type's field that resolves to a Base64 URL from a given image URL.
 *
 * Because the image will be converted to a Base64 URL, which effectively inlines the image's data, ensure that the image's filesize is small (< 15 KB recommended).
 *
 * **Note**: A network request will be made to gather the image's data.
 *
 * @param args Arguments used to build the type.
 *
 * @returns Configuration object for a GraphQL type's field.
 */
export const createImgixBase64UrlFieldConfig = <TContext>({
  resolveUrl = (obj: FixedObject | FluidObject): string | null | undefined =>
    obj.base64,
  cache,
}: CreateImgixBase64UrlFieldConfigArgs): ComposeFieldConfigAsObject<
  FixedObject | FluidObject,
  TContext
> => ({
  type: 'String!',
  resolve: (obj): Promise<string | undefined> =>
    pipe(
      obj,
      taskEitherFromSourceDataResolver(resolveUrl),
      TE.chain(fetchImgixBase64Url(cache)),
      TE.fold(() => T.of(undefined), T.of),
    )(),
})
