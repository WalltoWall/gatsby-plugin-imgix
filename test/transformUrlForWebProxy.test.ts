import { transformUrlForWebProxy } from '../src'

test('transforms an external image URL to a Web Proxy-compatible URL', () => {
  const sourceUrl = 'https://example.com/path.jpg?foo=bar'
  const webProxyUrl = transformUrlForWebProxy(sourceUrl, 'example.imgix.net')

  expect(webProxyUrl).toBe(
    'https://example.imgix.net/https%3A%2F%2Fexample.com%2Fpath.jpg%3Ffoo%3Dbar',
  )
})
