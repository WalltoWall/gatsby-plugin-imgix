[gatsby-plugin-imgix](../README.md) › [Globals](../globals.md) › ["createImgixUrlFieldConfig"](_createimgixurlfieldconfig_.md)

# Module: "createImgixUrlFieldConfig"

## Index

### Interfaces

* [ImgixUrlArgs](../interfaces/_createimgixurlfieldconfig_.imgixurlargs.md)

### Functions

* [createImgixUrlFieldConfig](_createimgixurlfieldconfig_.md#const-createimgixurlfieldconfig)

## Functions

### `Const` createImgixUrlFieldConfig

▸ **createImgixUrlFieldConfig**<**TSource**, **TContext**>(`__namedParameters`: object): *GraphQLFieldConfig‹TSource, TContext, [ImgixUrlArgs](../interfaces/_createimgixurlfieldconfig_.imgixurlargs.md)›*

*Defined in [src/createImgixUrlFieldConfig.ts:31](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/e91e6e9/src/createImgixUrlFieldConfig.ts#L31)*

Creates a GraphQL field config object that resolves an Imgix URL string to one with URL parameters.

**Type parameters:**

▪ **TSource**

▪ **TContext**

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`defaultImgixParams` | undefined &#124; [ImgixUrlParams](../interfaces/_types_.imgixurlparams.md) |
`resolveUrl` | function |
`secureUrlToken` | undefined &#124; string |

**Returns:** *GraphQLFieldConfig‹TSource, TContext, [ImgixUrlArgs](../interfaces/_createimgixurlfieldconfig_.imgixurlargs.md)›*

GraphQL field config to pass to a GraphQL constructor or a Gatsby schema builder.
