import * as gatsby from 'gatsby'

import { createImgixBase64UrlFieldConfig } from './createImgixBase64FieldConfig'

export const DEFAULT_FLUID_TYPE_NAME = 'ImgixFluidImage'

interface CreateImgixFluidTypeArgs {
  name?: string
  cache: gatsby.GatsbyCache
  schema: gatsby.NodePluginSchema
}

export const createImgixFluidType = ({
  name = DEFAULT_FLUID_TYPE_NAME,
  cache,
  schema,
}: CreateImgixFluidTypeArgs): gatsby.GatsbyGraphQLObjectType =>
  schema.buildObjectType({
    name,
    fields: {
      base64: createImgixBase64UrlFieldConfig({ cache }),
      src: { type: 'String!' },
      srcSet: { type: 'String!' },
      srcWebp: { type: 'String!' },
      srcSetWebp: { type: 'String!' },
      sizes: { type: 'String!' },
      aspectRatio: { type: 'Float!' },
    },
  })
