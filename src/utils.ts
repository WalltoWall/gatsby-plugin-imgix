import { Reporter } from 'gatsby'

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
