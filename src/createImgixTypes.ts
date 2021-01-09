import * as gatsby from 'gatsby'

import { createImgixFixedType } from './createImgixFixedType'
import { createImgixFluidType } from './createImgixFluidType'
import { createImgixUrlParamsInputType } from './createImgixUrlParamsInputType'

interface CreateImgixTypesArgs {
  /** Type name for the gatsby-image Fluid object type. */
  fixedTypeName?: string
  /** Type name for the gatsby-image Fixed object type. */
  fluidTypeName?: string
  /** Type name for the Imgix URL parameters input type. */
  paramsInputTypeName?: string
  /** Gatsby cache from a Gatsby Node API. */
  cache: gatsby.GatsbyCache
  /** Gatsby schema builders from a Gatsby Node API. */
  schema: gatsby.NodePluginSchema
}

/**
 * Creates the following shared GraphQL types used by fields created using `gatsby-plugin-imgix` field creators.
 *
 * - Fixed gatsby-image type: Resolves to a gatsby-image FixedObject.
 *
 * - Fluid gatsby-image type: Resolves to a gatsby-image FluidObject.
 *
 * - Imgix URL parameters input type: Input type used to set Imgix URL parameters on Imgix URLs.
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
  createImgixFluidType({
    name: args.fluidTypeName,
    cache: args.cache,
    schema: args.schema,
  }),
  createImgixUrlParamsInputType({
    name: args.paramsInputTypeName,
    schema: args.schema,
  }),
]
