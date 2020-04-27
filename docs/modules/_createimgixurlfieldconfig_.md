[gatsby-plugin-imgix](../README.md) › [Globals](../globals.md) › ["createImgixUrlFieldConfig"](_createimgixurlfieldconfig_.md)

# Module: "createImgixUrlFieldConfig"

## Index

### Interfaces

* [CreateImgixUrlFieldConfigArgs](../interfaces/_createimgixurlfieldconfig_.createimgixurlfieldconfigargs.md)
* [ImgixUrlArgs](../interfaces/_createimgixurlfieldconfig_.imgixurlargs.md)

### Variables

* [imgixUrlArgs](_createimgixurlfieldconfig_.md#const-imgixurlargs)

### Functions

* [createImgixUrlFieldConfig](_createimgixurlfieldconfig_.md#const-createimgixurlfieldconfig)

## Variables

### `Const` imgixUrlArgs

• **imgixUrlArgs**: *object* = {
  imgixParams: { type: ImgixUrlParamsInputType, defaultValue: {} },
} as GraphQLFieldConfigArgumentMap

*Defined in [src/createImgixUrlFieldConfig.ts:16](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/createImgixUrlFieldConfig.ts#L16)*

#### Type declaration:

* \[ **key**: *string*\]: GraphQLArgumentConfig

## Functions

### `Const` createImgixUrlFieldConfig

▸ **createImgixUrlFieldConfig**<**TSource**, **TContext**>(`__namedParameters`: object): *GraphQLFieldConfig‹TSource, TContext, [ImgixUrlArgs](../interfaces/_createimgixurlfieldconfig_.imgixurlargs.md)›*

*Defined in [src/createImgixUrlFieldConfig.ts:31](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/createImgixUrlFieldConfig.ts#L31)*

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
