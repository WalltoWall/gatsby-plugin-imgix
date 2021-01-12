import * as gatsby from 'gatsby'

import { createImgixFixedInterface } from './createImgixFixedInterface'
import { createImgixFixedType } from './createImgixFixedType'
import { createImgixFluidInterface } from './createImgixFluidInterface'
import { createImgixFluidType } from './createImgixFluidType'
import { createImgixUrlParamsInputType } from './createImgixUrlParamsInputType'

export interface CreateImgixTypesArgs {
  /** Name for the gatsby-image Fixed object type. */
  fixedTypeName?: string
  /** Name for the gatsby-image Fluid object type. */
  fluidTypeName?: string
  /** Name for the Imgix URL parameters input type. */
  paramsInputTypeName?: string
  /** Gatsby cache from a Gatsby Node API. */
  cache: gatsby.GatsbyCache
  /** Gatsby schema builders from a Gatsby Node API. */
  schema: gatsby.NodePluginSchema
}

/**
 * Creates the following shared GraphQL types used by fields created using `gatsby-plugin-imgix` field creators.
 *
 * - **Fixed type**: Resolves to a gatsby-image FixedObject.
 *
 * - **Fluid type**: Resolves to a gatsby-image FluidObject.
 *
 * - **Fixed interface**: Common interface for the Fixed type.
 *
 * - **Fluid interface**: Common interface for the Fluid type.
 *
 * - **Imgix URL parameters input type**: Input type used to set Imgix URL parameters on Imgix URLs.
 *
 * The types returned by this function should be passed to the `createTypes` action in the `createSchemaCustomizations` Gatsby Node API.
 *
 * @param args Arguments used to build the types.
 *
 * @returns GraphQL types used by fields created using `gatsby-plugin-imgix` field creators.
 */
export const createImgixTypes = (
  args: CreateImgixTypesArgs,
): gatsby.GatsbyGraphQLType[] => [
  createImgixFixedType({
    name: args.fixedTypeName,
    cache: args.cache,
    schema: args.schema,
  }),
  createImgixFixedInterface({
    schema: args.schema,
  }),
  createImgixFluidType({
    name: args.fluidTypeName,
    cache: args.cache,
    schema: args.schema,
  }),
  createImgixFluidInterface({
    schema: args.schema,
  }),
  createImgixUrlParamsInputType({
    name: args.paramsInputTypeName,
    schema: args.schema,
  }),
]
