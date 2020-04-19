import { Reporter } from 'gatsby'

export type Nullable<T> = T | null | undefined
export type OptionalPromise<T> = T | Promise<T>

export function invariant(
  condition: any,
  msg: string,
  reporter: Reporter,
): asserts condition {
  if (!condition) reporter.panic(`Invariant failed: ${msg}`)
}

export const transformUrlForWebProxy = (url: string, domain: string) => {
  const instance = new URL(`https://${domain}`)
  instance.pathname = encodeURIComponent(url)
  return instance.href
}

export const ns = (namespace: string = '', str: string) => `${namespace}${str}`
