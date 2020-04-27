[gatsby-plugin-imgix](../README.md) › [Globals](../globals.md) › ["index"](_index_.md) › ["gatsby-node"](_index_._gatsby_node_.md)

# Module: "gatsby-node"

## Index

### Functions

* [createSchemaCustomization](_index_._gatsby_node_.md#const-createschemacustomization)
* [onCreateNode](_index_._gatsby_node_.md#const-oncreatenode)
* [onPreExtractQueries](_index_._gatsby_node_.md#const-onpreextractqueries)

## Functions

### `Const` createSchemaCustomization

▸ **createSchemaCustomization**(`gatsbyContext`: CreateSchemaCustomizationArgs, `pluginOptions`: PluginOptions): *Promise‹void›*

*Defined in [src/gatsby-node.ts:114](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/e91e6e9/src/gatsby-node.ts#L114)*

**Parameters:**

Name | Type |
------ | ------ |
`gatsbyContext` | CreateSchemaCustomizationArgs |
`pluginOptions` | PluginOptions |

**Returns:** *Promise‹void›*

___

### `Const` onCreateNode

▸ **onCreateNode**(`gatsbyContext`: CreateNodeArgs‹TNode›, `pluginOptions`: PluginOptions): *Promise‹void›*

*Defined in [src/gatsby-node.ts:49](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/e91e6e9/src/gatsby-node.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`gatsbyContext` | CreateNodeArgs‹TNode› |
`pluginOptions` | PluginOptions |

**Returns:** *Promise‹void›*

___

### `Const` onPreExtractQueries

▸ **onPreExtractQueries**(`gatsbyContext`: ParentSpanPluginArgs): *void*

*Defined in [src/gatsby-node.ts:182](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/e91e6e9/src/gatsby-node.ts#L182)*

**Parameters:**

Name | Type |
------ | ------ |
`gatsbyContext` | ParentSpanPluginArgs |

**Returns:** *void*
