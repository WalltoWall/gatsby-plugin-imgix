import * as gatsby from 'gatsby'

import { createImgixBase64UrlFieldConfig } from './createImgixBase64FieldConfig'

export const DEFAULT_FIXED_TYPE_NAME = 'ImgixFixedImage'

interface CreateImgixFixedTypeArgs {
  name?: string
  cache: gatsby.GatsbyCache
  schema: gatsby.NodePluginSchema
}

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
