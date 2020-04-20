export const splitSrcSet = (srcSet: string) =>
  srcSet.split(/,\s+/).map(x => x.split(' '))

export const normalizeUrl = (url: string) => {
  const instance = new URL(url)
  instance.searchParams.sort()
  return instance.href
}
