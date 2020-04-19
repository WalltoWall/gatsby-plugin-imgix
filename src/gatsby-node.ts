import fs from 'fs'
import path from 'path'
import dlv from 'dlv'
import {
  GatsbyNode,
  CreateSchemaCustomizationArgs,
  Node,
  PluginOptions as GatsbyPluginOptions,
} from 'gatsby'

import { createFixedResolver, createFixedType } from './fixed'
import { createFluidResolver, createFluidType } from './fluid'
import { invariant, transformUrlForWebProxy } from './utils'

import {
  createImgixUrlFieldConfig,
  createImgixFixedFieldConfig,
  createImgixFluidFieldConfig,
} from './pyramid'

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
      Boolean(pluginOptions.secureURLToken),
    'a secure URL token must be provided if sourceType is webProxy',
    reporter,
  )

  const fieldTypes = pluginOptions.fields.map(fieldOptions =>
    schema.buildObjectType({
      name: `${fieldOptions.nodeType}Fields`,
      fields: {
        [fieldOptions.fieldName]:
          'getUrls' in fieldOptions ? '[ImgixImage]' : 'ImgixImage',
      },
    }),
  )

  createTypes([
    ...fieldTypes,
    schema.buildObjectType({
      name: 'ImgixImage',
      fields: {
        url: createImgixUrlFieldConfig({
          resolveUrl: (url: string) => url,
          secureURLToken: pluginOptions.secureURLToken,
        }),
        fixed: createImgixFixedFieldConfig({
          resolveUrl: (url: string) => url,
          secureURLToken: pluginOptions.secureURLToken,
        }),
        fluid: createImgixFluidFieldConfig({
          resolveUrl: (url: string) => url,
          secureURLToken: pluginOptions.secureURLToken,
        }),
      },
    }),
  ])
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
