import * as gatsby from 'gatsby'

import { createImgixBase64UrlFieldConfig } from './createImgixBase64FieldConfig'

export const DEFAULT_FIXED_TYPE_NAME = 'ImgixFixedImage'

interface CreateImgixFixedTypeArgs {
  /** Name for the type (default: `ImgixFixedImage`). */
  name?: string
  /** Gatsby cache from a Gatsby Node API. */
  cache: gatsby.GatsbyCache
  /** Gatsby schema builders from a Gatsby Node API. */
  schema: gatsby.NodePluginSchema
}

/**
 * Creates a GraphQL type representing a gatsby-image FixedObject. This type should be passed to the `createTypes` action in the `createSchemaCustomizations` Gatsby Node API.
 *
 * If a name is not provided, `ImgixFixedImage` is used as the default name.
 *
 * @param args Arguments used to build the type.
 *
 * @returns GraphQL type used by fields returning a gatsby-image FixedObject.
 */
export const createImgixFixedType = ({
  name = DEFAULT_FIXED_TYPE_NAME,
  cache,
  schema,
}: CreateImgixFixedTypeArgs): gatsby.GatsbyGraphQLObjectType =>
  schema.buildObjectType({
    name,
    fields: {
      base64: createImgixBase64UrlFieldConfig({ cache }),
      src: { type: 'String!' },
      srcSet: { type: 'String!' },
      srcWebp: { type: 'String!' },
      srcSetWebp: { type: 'String!' },
      sizes: { type: 'String!' },
      width: { type: 'Int!' },
      height: { type: 'Int!' },
    },
  })
