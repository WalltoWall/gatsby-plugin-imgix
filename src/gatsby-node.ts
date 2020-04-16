import { copyFileSync } from 'fs-extra'
import path from 'path'
import {
  GatsbyNode,
  CreateSchemaCustomizationArgs,
  PluginOptions,
} from 'gatsby'

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = async (
  gatsbyContext: CreateSchemaCustomizationArgs,
  _pluginOptions: PluginOptions,
) => {
  const { actions } = gatsbyContext
  const { createTypes } = actions

  createTypes(`
    type ImgixImageFixedType {
      base64: String!
      aspectRatio: Float!
      width: Float!
      height: Float!
      src: String!
      srcSet: String!
      srcWebp: String!
      srcSetWebp: String!
    }

    type ImgixImageFluidType {
      base64: String!
      aspectRatio: Float!
      src: String!
      srcSet: String!
      srcWebp: String!
      srcSetWebp: String!
      sizes: String!
    }
  `)
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
