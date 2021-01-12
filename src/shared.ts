import { GatsbyCache } from 'gatsby'
import * as TE from 'fp-ts/lib/TaskEither'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import { sequenceT } from 'fp-ts/lib/Apply'

import { ImgixMetadata } from './types'
import { buildImgixUrl } from './builders'
import {
  getFromCacheOr,
  fetchJSON,
  taskEitherFromSourceDataResolver,
  fetch,
  buildBase64URL,
} from './utils'

export type ImgixSourceDataResolver<TSource, TData> = (
  obj: TSource,
) => TData | null | undefined | void | Promise<TData | null | undefined | void>

export const fetchImgixMetadata = (
  cache: GatsbyCache,
  secureUrlToken?: string,
) => (url: string): TE.TaskEither<Error, ImgixMetadata> =>
  getFromCacheOr(`gatsby-plugin-imgix-metadata-${url}`, cache, () =>
    pipe({ fm: 'json' }, buildImgixUrl(url, secureUrlToken), (u) =>
      fetchJSON(u),
    ),
  )

export const fetchImgixBase64Url = (cache: GatsbyCache) => (
  url: string,
): TE.TaskEither<Error, string> =>
  getFromCacheOr(`gatsby-plugin-imgix-base64-url-${url}`, cache, () =>
    pipe(
      url,
      fetch,
      TE.chain((res) =>
        pipe(
          TE.rightTask<Error, Buffer>(() => res.buffer()),
          TE.chain((buffer) => TE.right(buffer.toString('base64'))),
          TE.chain((base64) =>
            TE.right(
              buildBase64URL(String(res.headers.get('content-type')), base64),
            ),
          ),
        ),
      ),
    ),
  )

const sequenceTTE = sequenceT(TE.taskEither)

export const resolveDimensions = <TSource>(
  source: TSource,
  resolveWidth: ImgixSourceDataResolver<TSource, number>,
  resolveHeight: ImgixSourceDataResolver<TSource, number>,
  cache: GatsbyCache,
  secureUrlToken?: string,
) => (url: string): TaskEither<Error, [number, number]> =>
  pipe(
    sequenceTTE(
      taskEitherFromSourceDataResolver(resolveWidth)(source),
      taskEitherFromSourceDataResolver(resolveHeight)(source),
    ),
    TE.fold(
      () =>
        pipe(
          url,
          fetchImgixMetadata(cache, secureUrlToken),
          TE.map(
            ({ PixelWidth, PixelHeight }) =>
              [PixelWidth, PixelHeight] as [number, number],
          ),
        ),
      TE.right,
    ),
  )
