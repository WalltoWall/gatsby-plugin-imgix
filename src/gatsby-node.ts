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
import { invariant, transformUrlForWebProxy } from './utils'

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
  const { node, actions, reporter } = gatsbyContext
  const { createNodeField } = actions

  pluginOptions = { fields: [], ...pluginOptions }
  invariant(
    Array.isArray(pluginOptions.fields),
    'fields must be an array of field options',
    reporter,
  )

  const fieldOptions = pluginOptions.fields.filter(
    (fieldOptions) => fieldOptions.nodeType === node.internal.type,
  )
  if (fieldOptions.length < 1) return

  for (const field of fieldOptions) {
    let fieldValue: string | string[] | undefined = undefined

    if ('urlPath' in field) {
      fieldValue = dlv(node, field.urlPath) ?? undefined
    } else if ('getUrl' in field) {
      fieldValue = field.getUrl(node)
      invariant(
        fieldValue === undefined ||
          fieldValue === null ||
          typeof fieldValue === 'string',
        'getUrl must return a URL string',
        reporter,
      )
    } else if ('getUrls' in field) {
      fieldValue = field.getUrls(node)
      invariant(
        Array.isArray(fieldValue),
        'getUrls must return an array of URLs',
        reporter,
      )
    } else {
      invariant(
        false,
        `one of urlPath, getUrl, or getUrls must be provided in the ${field.nodeType}.fields.${field.fieldName} options`,
        reporter,
      )
    }

    if (fieldValue && pluginOptions.sourceType === ImgixSourceType.WebProxy) {
      invariant(
        pluginOptions.domain !== undefined,
        'an Imgix domain must be provided if sourceType is webProxy',
        reporter,
      )
      invariant(
        pluginOptions.token !== undefined,
        'a secure URL token must be provided if sourceType is webProxy',
        reporter,
      )

      if (Array.isArray(fieldValue))
        fieldValue = fieldValue.map((url) =>
          transformUrlForWebProxy(url, pluginOptions.domain!),
        )
      else
        fieldValue = transformUrlForWebProxy(fieldValue, pluginOptions.domain)
    }

    if (fieldValue)
      createNodeField({ node, name: field.fieldName, value: fieldValue })
  }
}

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = async (
  gatsbyContext: CreateSchemaCustomizationArgs,
  pluginOptions: PluginOptions,
) => {
  const { actions, schema, cache, reporter } = gatsbyContext
  const { createTypes } = actions

  pluginOptions = { fields: [], ...pluginOptions }
  invariant(
    Array.isArray(pluginOptions.fields),
    'fields must be an array of field options',
    reporter,
  )
  invariant(
    pluginOptions.sourceType !== ImgixSourceType.WebProxy ||
      Boolean(pluginOptions.token),
    'a secure URL token must be provided if sourceType is webProxy',
    reporter,
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
          args: {
            width: 'Int',
            height: 'Int',
          },
          resolve: createFixedResolver(cache, pluginOptions.token),
        },
        fluid: {
          type: 'ImgixImageFluidType',
          args: {
            maxWidth: 'Int',
            maxHeight: 'Int',
            srcSetBreakpoints: '[Int!]',
          },
          resolve: createFluidResolver(cache, pluginOptions.token),
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
