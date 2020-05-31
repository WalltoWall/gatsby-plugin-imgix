import _fetch, { Response } from 'node-fetch'
import { GatsbyCache, Reporter } from 'gatsby'
import md5 from 'md5'
import * as O from 'fp-ts/es6/Option'
import * as TE from 'fp-ts/es6/TaskEither'
import { Option } from 'fp-ts/es6/Option'
import { Semigroup, getObjectSemigroup } from 'fp-ts/es6/Semigroup'
import { Task } from 'fp-ts/es6/Task'
import { TaskEither } from 'fp-ts/es6/TaskEither'
import { flow } from 'fp-ts/es6/function'
import { pipe } from 'fp-ts/es6/pipeable'

import { ImgixUrlParams } from './types'
import { ImgixResolveUrl } from './shared'

export type Maybe<T> = T | undefined
export type Nullable<T> = Maybe<T | null>
export type OptionalPromise<T> = T | Promise<T>

export function invariant(
  condition: unknown,
  msg: string,
  reporter: Reporter,
): asserts condition {
  if (!condition) reporter.panic(`Invariant failed: ${msg}`)
}

export const transformUrlForWebProxy = (
  url: string,
  domain: string,
): string => {
  const instance = new URL(`https://${domain}`)
  instance.pathname = encodeURIComponent(url)
  return instance.toString()
}

export const ns = (namespace = '', str: string): string => `${namespace}${str}`

// getFromCache :: Cache -> String -> Task Option String
export const getFromCache = <A>(
  key: string,
  cache: GatsbyCache,
): Task<Option<A>> => (): Promise<Option<A>> =>
  cache.get(key).then((value?: A) => O.fromNullable(value))

// setToCache :: Cache -> String -> Task Option String
export const setToCache = <A>(key: string, cache: GatsbyCache) => (
  value: A,
): Task<A> => (): Promise<A> => cache.set(key, value).then(() => value)

// getFromCacheOr :: Cache, () => TaskEither A B -> String -> TaskEither A B
export const getFromCacheOr = <A, B>(
  key: string,
  cache: GatsbyCache,
  f: () => TE.TaskEither<A, B>,
): TE.TaskEither<A, B> =>
  pipe(
    getFromCache<B>(key, cache),
    TE.rightTask,
    TE.chain(
      O.fold(
        flow(
          f,
          TE.chain(flow(setToCache(key, cache), (x) => TE.rightTask<A, B>(x))),
        ),
        TE.right,
      ),
    ),
  )

// fetch :: String -> TaskEither Error Response
export const fetch = (url: string): TaskEither<Error, Response> =>
  TE.tryCatch(
    () => _fetch(url),
    (reason) => new Error(String(reason)),
  )

// fetchJSON :: String -> TaskEither Error String
export const fetchJSON = <A>(url: string): TaskEither<Error, A> =>
  pipe(
    url,
    fetch,
    TE.chain((res) => TE.rightTask(() => res.json())),
  )

// fetchBase64 :: String -> TaskEither Error String
export const fetchBase64 = flow(
  fetch,
  TE.chain((res) => TE.rightTask(() => res.buffer())),
  TE.chain((res) => TE.right(res.toString('base64'))),
)

export const setURLSearchParam = (key: string, value: string | number) => (
  url: string,
): string => {
  const u = new URL(url)
  u.searchParams.set(key, String(value))
  return u.toString()
}

export const appendURLSearchParam = (key: string, value: string | number) => (
  url: string,
): string => {
  const u = new URL(url)
  u.searchParams.append(key, String(value))
  return u.toString()
}

export const deleteURLSearchParam = (key: string) => (url: string): string => {
  const u = new URL(url)
  u.searchParams.delete(key)
  return u.toString()
}

export const semigroupImgixUrlParams = getObjectSemigroup<ImgixUrlParams>()

const semigroupURLSearchParams: Semigroup<URLSearchParams> = {
  concat: (x, y) => {
    const product = new URLSearchParams(x.toString())
    y.forEach((value, key) => product.set(key, value))
    return product
  },
}

export const setURLSearchParams = <K extends string>(url: string) => (
  params: Record<K, string>,
): string => {
  const u = new URL(url)

  const mergedParams = semigroupURLSearchParams.concat(
    u.searchParams,
    new URLSearchParams(params),
  )
  u.search = mergedParams.toString()

  return u.toString()
}

export const createURLSignature = (secureUrlToken: string) => (
  url: string,
): string =>
  pipe(new URL(url), (u) => secureUrlToken + u.pathname + u.search, md5)

export const buildBase64URL = (contentType: string, base64: string): string =>
  `data:${contentType};base64,${base64}`

export const signURL = (secureUrlToken: Option<string>) => (
  url: string,
): string =>
  pipe(
    secureUrlToken,
    O.fold(
      () => url,
      (token) =>
        pipe(
          url,
          deleteURLSearchParam('s'),
          appendURLSearchParam('s', createURLSignature(token)(url)),
        ),
    ),
  )

export const join = <A>(separator?: string) => (arr: A[]): string =>
  arr.join(separator)

export const taskEitherFromUrlResolver = <TSource>(
  resolveUrl: ImgixResolveUrl<TSource>,
) => (obj: TSource): TaskEither<Error, string> =>
  TE.tryCatch(
    () =>
      Promise.resolve(resolveUrl(obj)).then((url) =>
        typeof url === 'string'
          ? url
          : Promise.reject('Resolved URL is not a string.'),
      ),
    (reason) => new Error(String(reason)),
  )
