[gatsby-plugin-imgix](../README.md) › [Globals](../globals.md) › ["createImgixFluidFieldConfig"](_createimgixfluidfieldconfig_.md)

# Module: "createImgixFluidFieldConfig"

## Index

### Functions

* [createImgixFluidFieldConfig](_createimgixfluidfieldconfig_.md#const-createimgixfluidfieldconfig)

## Functions

### `Const` createImgixFluidFieldConfig

▸ **createImgixFluidFieldConfig**<**TSource**, **TContext**>(`__namedParameters`: object): *GraphQLFieldConfig‹TSource, TContext, [ImgixFluidArgs](../interfaces/_types_.imgixfluidargs.md)›*

*Defined in [src/createImgixFluidFieldConfig.ts:39](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/e91e6e9/src/createImgixFluidFieldConfig.ts#L39)*

**Type parameters:**

▪ **TSource**

▪ **TContext**

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`cache` | object |
`defaultImgixParams` | undefined &#124; [ImgixUrlParams](../interfaces/_types_.imgixurlparams.md) |
`namespace` | undefined &#124; string |
`resolveUrl` | function |
`secureUrlToken` | undefined &#124; string |

**Returns:** *GraphQLFieldConfig‹TSource, TContext, [ImgixFluidArgs](../interfaces/_types_.imgixfluidargs.md)›*
