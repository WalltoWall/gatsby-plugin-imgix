import { Reporter as GatsbyReporter, Cache as GatsbyCache } from 'gatsby'
import { createHash } from 'crypto'
import fetch from 'node-fetch'

export function invariant(
  condition: any,
  msg: string,
  reporter: GatsbyReporter,
): asserts condition {
  if (!condition) reporter.panic(`Invariant failed: ${msg}`)
}

export const transformUrlForWebProxy = (url: string, domain: string) => {
  const instance = new URL(`https://${domain}`)
  instance.pathname = encodeURIComponent(url)
  return instance.href
}

export const signURL = (url: string, token: string) => {
  const instance = new URL(url)
  const signatureBase = token + instance.pathname + instance.search
  const signature = createHash('md5').update(signatureBase).digest('hex')

  instance.searchParams.set('s', signature)

  return instance.href
}

interface ImgixMetadata {
  PixelWidth: number
  PixelHeight: number
}

type ProbeMetadataArgs = {
  url: string
  cache: GatsbyCache['cache']
  secureURLToken?: string
}

export const probeMetadata = async (args: ProbeMetadataArgs) => {
  const { url, cache, secureURLToken } = args

  const key = `metadata___${url}`

  const cached = await cache.get(key)
  if (cached) return cached

  const instance = new URL(url)
  instance.searchParams.set('fm', 'json')
  const jsonUrl = secureURLToken
    ? signURL(instance.href, secureURLToken)
    : instance.href

  const res = await fetch(jsonUrl)
  const metadata = (await res.json()) as ImgixMetadata

  cache.set(key, metadata)

  return metadata
}

