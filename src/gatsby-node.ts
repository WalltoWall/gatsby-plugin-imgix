import { copyFileSync } from 'fs-extra'
import path from 'path'
import dlv from 'dlv'
import {
  GatsbyNode,
  CreateSchemaCustomizationArgs,
  Node,
  PluginOptions as GatsbyPluginOptions,
} from 'gatsby'

import { createFixedResolver, createFluidResolver } from './resolvers'
import { invariant } from './utils'

enum ImgixSourceType {
  AmazonS3 = 's3',
  GoogleCloudStorange = 'gcs',
  MicrosoftAzure = 'azure',
  WebFolder = 'webFolder',
  WebProxy = 'webProxy',
}

type FieldOptions = {
  nodeType: string
  fieldName: string
} & (
  | {
      urlPath: string
    }
  | {
      getUrl: (node: Node) => string
    }
  | {
      getUrls: (node: Node) => string[]
    }
)

interface PluginOptions extends GatsbyPluginOptions {
  domain?: string
  token?: string
  sourceType?: ImgixSourceType
  fields?: FieldOptions[]
}

export const onCreateNode: GatsbyNode['onCreateNode'] = async (
  gatsbyContext,
  pluginOptions: PluginOptions,
) => {
  const { node, actions } = gatsbyContext
  const { createNodeField } = actions

  pluginOptions = { fields: [], ...pluginOptions }
  invariant(
    Array.isArray(pluginOptions.fields),
    'fields must be an array of field options',
  )
  invariant(
    pluginOptions.sourceType !== ImgixSourceType.WebProxy ||
      Boolean(pluginOptions.token),
    'a secure URL token must be provided if sourceType is webProxy',
  )

  const fieldOptions = pluginOptions.fields.find(
    (fieldOptions) => fieldOptions.nodeType === node.internal.type,
  )
  if (!fieldOptions) return

  let fieldValue: string | string[] | undefined = undefined

  if ('urlPath' in fieldOptions) {
    fieldValue = dlv(node, fieldOptions.urlPath) ?? undefined
  } else if ('getUrl' in fieldOptions) {
    fieldValue = fieldOptions.getUrl(node)
    invariant(
      fieldValue === undefined ||
        fieldValue === null ||
        typeof fieldValue === 'string',
      'getUrl must return a URL string',
    )
  } else if ('getUrls' in fieldOptions) {
    fieldValue = fieldOptions.getUrls(node)
    invariant(Array.isArray(fieldValue), 'getUrls must return an array of URLs')
  } else {
    invariant(
      false,
      `one of urlPath, getUrl, or getUrls must be provided in the ${fieldOptions.nodeType}.fields.${fieldOptions.fieldName} options`,
    )
  }

  if (fieldValue)
    createNodeField({ node, name: fieldOptions.fieldName, value: fieldValue })
}

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = async (
  gatsbyContext: CreateSchemaCustomizationArgs,
  pluginOptions: PluginOptions,
) => {
  const { actions, schema } = gatsbyContext
  const { createTypes } = actions

  pluginOptions = { fields: [], ...pluginOptions }
  invariant(
    Array.isArray(pluginOptions.fields),
    'fields must be an array of field options',
  )
  invariant(
    pluginOptions.sourceType !== ImgixSourceType.WebProxy ||
      Boolean(pluginOptions.token),
    'a secure URL token must be provided if sourceType is webProxy',
  )

  const fieldTypes = pluginOptions.fields.map((fieldOptions) =>
    schema.buildObjectType({
      name: `${fieldOptions.nodeType}Fields`,
      fields: {
        [fieldOptions.fieldName]:
          'getUrls' in fieldOptions ? '[ImgixImageType]' : 'ImgixImageType',
      },
    }),
  )

  createTypes([
    ...fieldTypes,
    schema.buildObjectType({
      name: 'ImgixImageFixedType',
      fields: {
        base64: 'String!',
        aspectRatio: 'Float!',
        width: 'Float!',
        height: 'Float!',
        src: 'String!',
        srcSet: 'String!',
        srcWebp: 'String!',
        srcSetWebp: 'String!',
      },
    }),
    schema.buildObjectType({
      name: 'ImgixImageFluidType',
      fields: {
        base64: 'String!',
        aspectRatio: 'Float!',
        src: 'String!',
        srcSet: 'String!',
        srcWebp: 'String!',
        srcSetWebp: 'String!',
        sizes: 'String!',
      },
    }),
    schema.buildObjectType({
      name: 'ImgixImageType',
      fields: {
        url: {
          type: 'String',
          resolve: (url: string) => url,
        },
        fixed: {
          type: 'ImgixImageFixedType',
          resolve: createFixedResolver(pluginOptions.token),
        },
        fluid: {
          type: 'ImgixImageFluidType',
          resolve: createFluidResolver(pluginOptions.token),
        },
      },
    }),
  ])
}

export const onPreExtractQueries: GatsbyNode['onPreExtractQueries'] = (
  gatsbyContext,
) => {
  const { store } = gatsbyContext
  const { program } = store.getState()

  // Add fragments for GatsbyImgixImage to .cache/fragments.
  copyFileSync(
    path.resolve(__dirname, '../fragments.js'),
    path.resolve(
      program.directory,
      '.cache/fragments/gatsby-plugin-imgix-fragments.js',
    ),
  )
}
