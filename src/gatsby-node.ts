import fs from 'fs'
import path from 'path'
import {
  GatsbyNode,
  CreateSchemaCustomizationArgs,
  Node,
  PluginOptions as GatsbyPluginOptions,
} from 'gatsby'

import { createImgixUrlSchemaFieldConfig } from './createImgixUrlFieldConfig'
import {
  createImgixFixedSchemaFieldConfig,
  createImgixFixedType,
} from './createImgixFixedFieldConfig'
import {
  createImgixFluidSchemaFieldConfig,
  createImgixFluidType,
} from './createImgixFluidFieldConfig'
import { invariant, transformUrlForWebProxy, ns } from './utils'
import { ImgixUrlParams } from './types'

enum ImgixSourceType {
  AmazonS3 = 's3',
  GoogleCloudStorange = 'gcs',
  MicrosoftAzure = 'azure',
  WebFolder = 'webFolder',
  WebProxy = 'webProxy',
}

interface BaseFieldOptions {
  nodeType: string
  fieldName: string
}

interface FieldOptionsSingleUrl extends BaseFieldOptions {
  getUrl: (node: Node) => string
}

interface FieldOptionsMultipleUrls extends BaseFieldOptions {
  getUrls: (node: Node) => string
}

type FieldOptions = FieldOptionsSingleUrl | FieldOptionsMultipleUrls

interface PluginOptions extends GatsbyPluginOptions {
  domain?: string
  secureUrlToken?: string
  sourceType?: ImgixSourceType
  namespace?: string
  defaultImgixParams?: ImgixUrlParams
  defaultPlaceholderImgixParams?: ImgixUrlParams
  fields?: FieldOptions[]
}

export const onCreateNode: GatsbyNode['onCreateNode'] = async (
  gatsbyContext,
  pluginOptions: PluginOptions,
) => {
  const { node, actions, reporter } = gatsbyContext
  const { createNodeField } = actions

  const { domain, secureUrlToken, sourceType, fields = [] } = pluginOptions
  invariant(
    Array.isArray(fields),
    'fields must be an array of field options',
    reporter,
  )

  const fieldOptions = fields.filter(
    (fieldOptions) => fieldOptions.nodeType === node.internal.type,
  )
  if (fieldOptions.length < 1) return

  for (const field of fieldOptions) {
    let fieldValue = undefined as string | string[] | undefined

    if ('getUrl' in field) {
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
    }

    if (!fieldValue) continue

    if (sourceType === ImgixSourceType.WebProxy) {
      invariant(
        domain !== undefined,
        'an Imgix domain must be provided if sourceType is webProxy',
        reporter,
      )
      invariant(
        secureUrlToken !== undefined,
        'a secure URL token must be provided if sourceType is webProxy',
        reporter,
      )

      if (Array.isArray(fieldValue))
        fieldValue = fieldValue.map((url) =>
          transformUrlForWebProxy(url, domain),
        )
      else fieldValue = transformUrlForWebProxy(fieldValue, domain)
    }

    createNodeField({ node, name: field.fieldName, value: fieldValue })
  }
}

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = async (
  gatsbyContext: CreateSchemaCustomizationArgs,
  pluginOptions: PluginOptions,
) => {
  const { actions, cache, schema, reporter } = gatsbyContext
  const { createTypes } = actions

  const {
    secureUrlToken,
    sourceType,
    namespace,
    defaultImgixParams,
    defaultPlaceholderImgixParams,
    fields = [],
  } = pluginOptions
  invariant(
    Array.isArray(fields),
    'fields must be an array of field options',
    reporter,
  )
  invariant(
    sourceType !== ImgixSourceType.WebProxy || Boolean(secureUrlToken),
    'a secure URL token must be provided if sourceType is webProxy',
    reporter,
  )

  const ImgixFixedType = createImgixFixedType({
    name: ns(namespace, 'ImgixFixed'),
    cache,
  })

  const ImgixFluidType = createImgixFluidType({
    name: ns(namespace, 'ImgixFluid'),
    cache,
  })

  const ImgixImageType = schema.buildObjectType({
    name: ns(namespace, 'ImgixImage'),
    fields: {
      url: createImgixUrlSchemaFieldConfig({
        resolveUrl: (url: string) => url,
        secureUrlToken,
        defaultImgixParams,
      }),
      fixed: createImgixFixedSchemaFieldConfig({
        type: ImgixFixedType,
        resolveUrl: (url: string) => url,
        secureUrlToken,
        defaultImgixParams,
        defaultPlaceholderImgixParams,
        cache,
      }),
      fluid: createImgixFluidSchemaFieldConfig({
        type: ImgixFluidType,
        resolveUrl: (url: string) => url,
        secureUrlToken: secureUrlToken,
        defaultImgixParams,
        defaultPlaceholderImgixParams,
        cache,
      }),
    },
  })

  const fieldTypes = fields.map((fieldOptions) =>
    schema.buildObjectType({
      name: `${fieldOptions.nodeType}Fields`,
      fields: {
        [fieldOptions.fieldName]: {
          type:
            'getUrls' in fieldOptions
              ? `[${ImgixImageType.config.name}]`
              : ImgixImageType.config.name,
        },
      },
    }),
  )

  createTypes([ImgixFixedType, ImgixFluidType])
  createTypes(ImgixImageType)
  createTypes(fieldTypes)
}

export const onPreExtractQueries: GatsbyNode['onPreExtractQueries'] = (
  gatsbyContext,
) => {
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
