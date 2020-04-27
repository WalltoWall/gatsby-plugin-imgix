[gatsby-plugin-imgix](../README.md) › [Globals](../globals.md) › ["createImgixFixedFieldConfig"](_createimgixfixedfieldconfig_.md)

# Module: "createImgixFixedFieldConfig"

## Index

### Functions

* [createImgixFixedFieldConfig](_createimgixfixedfieldconfig_.md#const-createimgixfixedfieldconfig)

## Functions

### `Const` createImgixFixedFieldConfig

▸ **createImgixFixedFieldConfig**<**TSource**, **TContext**>(`__namedParameters`: object): *GraphQLFieldConfig‹TSource, TContext, [ImgixFixedArgs](../interfaces/_types_.imgixfixedargs.md)›*

*Defined in [src/createImgixFixedFieldConfig.ts:36](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/e91e6e9/src/createImgixFixedFieldConfig.ts#L36)*

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

**Returns:** *GraphQLFieldConfig‹TSource, TContext, [ImgixFixedArgs](../interfaces/_types_.imgixfixedargs.md)›*
