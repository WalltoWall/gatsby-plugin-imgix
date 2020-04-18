export { buildFixedGatsbyImage, createFixedResolver, createFixedType } from './fixed'
export { buildFluidGatsbyImage, createFluidResolver, createFluidType } from './fluid'
export { transformUrlForWebProxy } from './utils'

// prettier-eslint runs into a parsing error
// eslint-disable-next-line
export * as _gatsbyNode from './gatsby-node'
