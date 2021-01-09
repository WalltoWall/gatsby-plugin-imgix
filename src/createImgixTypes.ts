import * as gatsby from 'gatsby'

import { createImgixFixedType } from './createImgixFixedType'
import { createImgixFluidType } from './createImgixFluidType'
import { createImgixUrlParamsInputType } from './createImgixUrlParamsInputType'

interface CreateImgixTypesArgs {
  fixedTypeName?: string
  fluidTypeName?: string
  paramsInputTypeName?: string
  cache: gatsby.GatsbyCache
  schema: gatsby.NodePluginSchema
}

export const createImgixTypes = ({
  fixedTypeName,
  fluidTypeName,
  paramsInputTypeName,
  cache,
  schema,
}: CreateImgixTypesArgs) => [
  createImgixFixedType({ name: fixedTypeName, cache, schema }),
  createImgixFluidType({ name: fluidTypeName, cache, schema }),
  createImgixUrlParamsInputType({ name: paramsInputTypeName, schema }),
]
