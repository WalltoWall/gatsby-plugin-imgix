import { buildImgixUrl, ImgixUrlQueryParams } from 'ts-imgix'
import { buildImgixFluid } from '../src'

import { splitSrcSet, normalizeUrl } from './__testutils__'

const URL_SRC = 'https://example.imgix.net/image.jpg'
const URL_WIDTH = 2000
const URL_HEIGHT = 1000

// w=800 is the default maxWidth of buildImgixFluid
const buildTestUrl = (params: ImgixUrlQueryParams = {}) =>
  buildImgixUrl(URL_SRC)({ w: 800, ...params })

test('jpg without args', () => {
  const result = buildImgixFluid({
    url: URL_SRC,
    sourceWidth: URL_WIDTH,
    sourceHeight: URL_HEIGHT,
  })

  expect(result.src).toBe(buildTestUrl())
  expect(splitSrcSet(result.srcSet)).toEqual([
    [buildTestUrl({ w: 200, h: 100 }), '200w'],
    [buildTestUrl({ w: 400, h: 200 }), '400w'],
    [buildTestUrl({ w: 800, h: 400 }), '800w'],
    [buildTestUrl({ w: 1200, h: 600 }), '1200w'],
    [buildTestUrl({ w: 1600, h: 800 }), '1600w'],
  ])
  expect(result.srcSetWebp).toEqual(result.srcSet)
  expect(result.srcWebp).toEqual(result.src)
})

test('jpg with existing params without args', () => {
  const rect = { x: 0, y: 0, w: 3600, h: 1800 }
  const result = buildImgixFluid({
    url: buildImgixUrl(URL_SRC)({ rect }),
    sourceWidth: URL_WIDTH,
    sourceHeight: URL_HEIGHT,
  })

  expect(normalizeUrl(result.src)).toBe(normalizeUrl(buildTestUrl({ rect })))
  expect(
    splitSrcSet(result.srcSet).map(([url, dpr]) => [normalizeUrl(url), dpr]),
  ).toEqual([
    [normalizeUrl(buildTestUrl({ rect, w: 200, h: 100 })), '200w'],
    [normalizeUrl(buildTestUrl({ rect, w: 400, h: 200 })), '400w'],
    [normalizeUrl(buildTestUrl({ rect, w: 800, h: 400 })), '800w'],
    [normalizeUrl(buildTestUrl({ rect, w: 1200, h: 600 })), '1200w'],
    [normalizeUrl(buildTestUrl({ rect, w: 1600, h: 800 })), '1600w'],
  ])
  expect(result.srcSetWebp).toEqual(result.srcSet)
  expect(result.srcWebp).toEqual(result.src)
})

test('jpg with maxWidth (600)', () => {
  const result = buildImgixFluid({
    url: URL_SRC,
    sourceWidth: URL_WIDTH,
    sourceHeight: URL_HEIGHT,
    args: { maxWidth: 600 },
  })

  expect(result.src).toBe(buildTestUrl({ w: 600, h: 300 }))
  expect(splitSrcSet(result.srcSet)).toEqual([
    [normalizeUrl(buildTestUrl({ w: 150, h: 75 })), '150w'],
    [normalizeUrl(buildTestUrl({ w: 300, h: 150 })), '300w'],
    [normalizeUrl(buildTestUrl({ w: 600, h: 300 })), '600w'],
    [normalizeUrl(buildTestUrl({ w: 900, h: 450 })), '900w'],
    [normalizeUrl(buildTestUrl({ w: 1200, h: 600 })), '1200w'],
  ])
  expect(result.srcSetWebp).toEqual(result.srcSet)
  expect(result.srcWebp).toEqual(result.src)
})

test('jpg with maxHeight (400)', () => {
  const result = buildImgixFluid({
    url: URL_SRC,
    sourceWidth: URL_WIDTH,
    sourceHeight: URL_HEIGHT,
    args: { maxHeight: 400 },
  })

  expect(result.src).toBe(buildTestUrl({ w: 800, h: 400 }))
  expect(splitSrcSet(result.srcSet)).toEqual([
    [buildTestUrl({ w: 200, h: 100 }), '200w'],
    [buildTestUrl({ w: 400, h: 200 }), '400w'],
    [buildTestUrl({ w: 800, h: 400 }), '800w'],
    [buildTestUrl({ w: 1200, h: 600 }), '1200w'],
    [buildTestUrl({ w: 1600, h: 800 }), '1600w'],
  ])
  expect(result.srcSetWebp).toEqual(result.srcSet)
  expect(result.srcWebp).toEqual(result.src)
})

test('jpg with maxWidth (600) and maxHeight (400)', () => {
  const result = buildImgixFluid({
    url: URL_SRC,
    sourceWidth: URL_WIDTH,
    sourceHeight: URL_HEIGHT,
    args: { maxWidth: 600, maxHeight: 400 },
  })

  expect(result.src).toBe(buildTestUrl({ w: 600, h: 400 }))
  expect(splitSrcSet(result.srcSet)).toEqual([
    [buildTestUrl({ w: 150, h: 100 }), '150w'],
    [buildTestUrl({ w: 300, h: 200 }), '300w'],
    [buildTestUrl({ w: 600, h: 400 }), '600w'],
    [buildTestUrl({ w: 900, h: 600 }), '900w'],
    [buildTestUrl({ w: 1200, h: 800 }), '1200w'],
  ])
  expect(result.srcSetWebp).toEqual(result.srcSet)
  expect(result.srcWebp).toEqual(result.src)
})
