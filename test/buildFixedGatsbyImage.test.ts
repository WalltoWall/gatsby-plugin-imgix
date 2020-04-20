import { buildImgixUrl, ImgixFit, ImgixUrlQueryParams } from 'ts-imgix'
import { buildFixedGatsbyImage } from '../src'

import { splitSrcSet, normalizeUrl } from './__testutils__'

const URL_SRC = 'https://example.imgix.net/image.jpg'
const URL_WIDTH = 2000
const URL_HEIGHT = 1000
const DEFAULT_PARAMS = {
  auto: { compress: true, format: true },
  fit: ImgixFit.max,
  q: 50,
}
const buildTestUrl = (params: ImgixUrlQueryParams = {}) =>
  buildImgixUrl(URL_SRC)({ ...DEFAULT_PARAMS, w: 400, h: 200, ...params })

test('jpg without args', () => {
  const result = buildFixedGatsbyImage({
    url: URL_SRC,
    sourceWidth: URL_WIDTH,
    sourceHeight: URL_HEIGHT,
  })

  expect(result.src).toBe(buildTestUrl())
  expect(splitSrcSet(result.srcSet)).toEqual([
    [buildTestUrl({ dpr: 1 }), '1x'],
    [buildTestUrl({ dpr: 1.5 }), '1.5x'],
    [buildTestUrl({ dpr: 2 }), '2x'],
  ])
  expect(result.srcSetWebp).toEqual(result.srcSet)
  expect(result.srcWebp).toEqual(result.src)
})

test('jpg with existing params without args', () => {
  const rect = { x: 0, y: 0, w: 3600, h: 1800 }
  const result = buildFixedGatsbyImage({
    url: buildTestUrl({ rect }),
    sourceWidth: URL_WIDTH,
    sourceHeight: URL_HEIGHT,
  })

  expect(result.src).toBe(buildTestUrl({ rect }))
  expect(
    splitSrcSet(result.srcSet).map(([url, dpr]) => [normalizeUrl(url), dpr]),
  ).toEqual([
    [normalizeUrl(buildTestUrl({ rect, dpr: 1 })), '1x'],
    [normalizeUrl(buildTestUrl({ rect, dpr: 1.5 })), '1.5x'],
    [normalizeUrl(buildTestUrl({ rect, dpr: 2 })), '2x'],
  ])
  expect(result.srcSetWebp).toEqual(result.srcSet)
  expect(result.srcWebp).toEqual(result.src)
})

test('jpg with width (600)', () => {
  const result = buildFixedGatsbyImage({
    url: URL_SRC,
    sourceWidth: URL_WIDTH,
    sourceHeight: URL_HEIGHT,
    args: { width: 600 },
  })

  expect(result.src).toBe(buildTestUrl({ w: 600, h: 300 }))
  expect(splitSrcSet(result.srcSet)).toEqual([
    [buildTestUrl({ w: 600, h: 300, dpr: 1 }), '1x'],
    [buildTestUrl({ w: 600, h: 300, dpr: 1.5 }), '1.5x'],
    [buildTestUrl({ w: 600, h: 300, dpr: 2 }), '2x'],
  ])
  expect(result.srcSetWebp).toEqual(result.srcSet)
  expect(result.srcWebp).toEqual(result.src)
})

test('jpg with height (400)', () => {
  const result = buildFixedGatsbyImage({
    url: URL_SRC,
    sourceWidth: URL_WIDTH,
    sourceHeight: URL_HEIGHT,
    args: { height: 400 },
  })

  expect(result.src).toBe(buildTestUrl({ w: 800, h: 400 }))
  expect(splitSrcSet(result.srcSet)).toEqual([
    [buildTestUrl({ w: 800, h: 400, dpr: 1 }), '1x'],
    [buildTestUrl({ w: 800, h: 400, dpr: 1.5 }), '1.5x'],
    [buildTestUrl({ w: 800, h: 400, dpr: 2 }), '2x'],
  ])
  expect(result.srcSetWebp).toEqual(result.srcSet)
  expect(result.srcWebp).toEqual(result.src)
})

test('jpg with width (600) and height (400)', () => {
  const result = buildFixedGatsbyImage({
    url: URL_SRC,
    sourceWidth: URL_WIDTH,
    sourceHeight: URL_HEIGHT,
    args: { width: 600, height: 400 },
  })

  expect(result.src).toBe(buildTestUrl({ w: 600, h: 400 }))
  expect(splitSrcSet(result.srcSet)).toEqual([
    [buildTestUrl({ w: 600, h: 400, dpr: 1 }), '1x'],
    [buildTestUrl({ w: 600, h: 400, dpr: 1.5 }), '1.5x'],
    [buildTestUrl({ w: 600, h: 400, dpr: 2 }), '2x'],
  ])
  expect(result.srcSetWebp).toEqual(result.srcSet)
  expect(result.srcWebp).toEqual(result.src)
})
