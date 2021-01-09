import * as gatsby from 'gatsby'

import { FLUID_INTERFACE_NAME } from './createImgixFluidInterface'
import { createImgixBase64UrlFieldConfig } from './createImgixBase64FieldConfig'

export const DEFAULT_FLUID_TYPE_NAME = 'ImgixFluidImage'

export interface CreateImgixFluidTypeArgs {
  /** Name for the type (default: `ImgixFluidImage`). */
  name?: string
  /** Gatsby cache from a Gatsby Node API. */
  cache: gatsby.GatsbyCache
  /** Gatsby schema builders from a Gatsby Node API. */
  schema: gatsby.NodePluginSchema
}

/**
 * Creates a GraphQL type representing a gatsby-image FluidObject. This type should be passed to the `createTypes` action in the `createSchemaCustomizations` Gatsby Node API.
 *
 * If a name is not provided, `ImgixFluidImage` is used as the default name.
 *
 * @param args Arguments used to build the type.
 *
 * @returns GraphQL type used by fields returning a gatsby-image FluidObject.
 */
export const createImgixFluidType = (
  args: CreateImgixFluidTypeArgs,
): gatsby.GatsbyGraphQLObjectType =>
  args.schema.buildObjectType({
    name: args.name ?? DEFAULT_FLUID_TYPE_NAME,
    fields: {
      base64: createImgixBase64UrlFieldConfig({ cache: args.cache }),
      src: { type: 'String!' },
      srcSet: { type: 'String!' },
      srcWebp: { type: 'String!' },
      srcSetWebp: { type: 'String!' },
      sizes: { type: 'String!' },
      aspectRatio: { type: 'Float!' },
    },
    interfaces: [FLUID_INTERFACE_NAME],
  })
