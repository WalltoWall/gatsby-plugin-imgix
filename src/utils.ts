import { Reporter } from 'gatsby'

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
  return instance.href
}

export const ns = (namespace = '', str: string): string => `${namespace}${str}`
