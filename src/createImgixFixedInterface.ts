import * as gatsby from 'gatsby'

export const FIXED_INTERFACE_NAME = 'ImgixFixedImage'

export interface CreateImgixFixedInterfaceArgs {
  /** Gatsby schema builders from a Gatsby Node API. */
  schema: gatsby.NodePluginSchema
}

/**
 * Creates a GraphQL interface representing a gatsby-image FixedObject. This type should be passed to the `createTypes` action in the `createSchemaCustomizations` Gatsby Node API.
 *
 * If a name is not provided, `ImgixFixedImage` is used as the default name.
 *
 * @param args Arguments used to build the type.
 *
 * @returns GraphQL interface used by types representing a gatsby-image FixedObject.
 */
export const createImgixFixedInterface = (
  args: CreateImgixFixedInterfaceArgs,
): gatsby.GatsbyGraphQLInterfaceType =>
  args.schema.buildInterfaceType({
    name: FIXED_INTERFACE_NAME,
    fields: {
      base64: 'String!',
      src: 'String!',
      srcSet: 'String!',
      srcWebp: 'String!',
      srcSetWebp: 'String!',
      sizes: 'String!',
      width: 'Int!',
      height: 'Int!',
    },
  })
