export const splitSrcSet = (srcSet: string): string[][] =>
  srcSet.split(/,\s+/).map((x) => x.split(' '))

export const normalizeUrl = (url: string): string => {
  const instance = new URL(url)
  instance.searchParams.sort()
  return instance.href
}
