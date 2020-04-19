import fs from 'fs'
import path from 'path'
import dlv from 'dlv'
import {
  GatsbyNode,
  CreateSchemaCustomizationArgs,
  Node,
  PluginOptions as GatsbyPluginOptions,
} from 'gatsby'
import { GraphQLObjectType, GraphQLList } from 'gatsby/graphql'

import { createImgixUrlFieldConfig } from './createImgixUrlFieldConfig'
import { createImgixFixedFieldConfig } from './createImgixFixedFieldConfig'
import { createImgixFluidFieldConfig } from './createImgixFluidFieldConfig'
import { invariant, transformUrlForWebProxy, ns } from './utils'

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
  secureURLToken?: string
  sourceType?: ImgixSourceType
  fields?: FieldOptions[]
  namespace?: string
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
    fieldOptions => fieldOptions.nodeType === node.internal.type,
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
        pluginOptions.secureURLToken !== undefined,
        'a secure URL token must be provided if sourceType is webProxy',
        reporter,
      )

      if (Array.isArray(fieldValue))
        fieldValue = fieldValue.map(url =>
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
  const { actions, cache, reporter } = gatsbyContext
  const { createTypes } = actions

  const { fields, sourceType, secureURLToken, namespace } = {
    fields: [] as FieldOptions[],
    ...pluginOptions,
  }
  invariant(
    Array.isArray(fields),
    'fields must be an array of field options',
    reporter,
  )
  invariant(
    sourceType !== ImgixSourceType.WebProxy || Boolean(secureURLToken),
    'a secure URL token must be provided if sourceType is webProxy',
    reporter,
  )

  const ImgixImageType = new GraphQLObjectType<string, unknown, any>({
    name: ns(namespace, 'ImgixImage'),
    fields: {
      url: createImgixUrlFieldConfig({
        resolveUrl: url => url,
        secureURLToken,
      }),
      fixed: createImgixFixedFieldConfig({
        resolveUrl: url => url,
        secureURLToken,
        namespace,
        cache,
      }),
      fluid: createImgixFluidFieldConfig({
        resolveUrl: url => url,
        secureURLToken,
        namespace,
        cache,
      }),
    },
  })

  const fieldTypes = fields.map(
    fieldOptions =>
      new GraphQLObjectType({
        name: `${fieldOptions.nodeType}Fields`,
        fields: {
          [fieldOptions.fieldName]: {
            type:
              'getUrls' in fieldOptions
                ? new GraphQLList(ImgixImageType)
                : ImgixImageType,
          },
        },
      }),
  )

  createTypes([ImgixImageType, ...fieldTypes])
}

export const onPreExtractQueries: GatsbyNode['onPreExtractQueries'] = gatsbyContext => {
  const { store } = gatsbyContext
  const { program } = store.getState()

  // Add fragments for GatsbyImgixImage to .cache/fragments.
  fs.copyFileSync(
    path.resolve(__dirname, '../fragments.js'),
    path.resolve(
      program.directory,
      '.cache/fragments/gatsby-plugin-imgix-fragments.js',
    ),
  )
}
