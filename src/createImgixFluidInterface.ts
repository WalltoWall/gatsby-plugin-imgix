import * as gatsby from 'gatsby'

export const FLUID_INTERFACE_NAME = 'ImgixFluidImage'

export interface CreateImgixFluidInterfaceArgs {
  /** Gatsby schema builders from a Gatsby Node API. */
  schema: gatsby.NodePluginSchema
}

/**
 * Creates a GraphQL interface representing a gatsby-image FluidObject. This type should be passed to the `createTypes` action in the `createSchemaCustomizations` Gatsby Node API.
 *
 * If a name is not provided, `ImgixFluidImage` is used as the default name.
 *
 * @param args Arguments used to build the type.
 *
 * @returns GraphQL interface used by types representing a gatsby-image FluidObject.
 */
export const createImgixFluidInterface = (
  args: CreateImgixFluidInterfaceArgs,
): gatsby.GatsbyGraphQLInterfaceType =>
  args.schema.buildInterfaceType({
    name: FLUID_INTERFACE_NAME,
    fields: {
      base64: 'String!',
      src: 'String!',
      srcSet: 'String!',
      srcWebp: 'String!',
      srcSetWebp: 'String!',
      sizes: 'String!',
      aspectRatio: 'Float!',
    },
  })
