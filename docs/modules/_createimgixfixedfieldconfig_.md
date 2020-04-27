[gatsby-plugin-imgix](../README.md) › [Globals](../globals.md) › ["createImgixFixedFieldConfig"](_createimgixfixedfieldconfig_.md)

# Module: "createImgixFixedFieldConfig"

## Index

### Interfaces

* [CreateImgixFixedFieldConfigArgs](../interfaces/_createimgixfixedfieldconfig_.createimgixfixedfieldconfigargs.md)

### Variables

* [imgixFixedArgs](_createimgixfixedfieldconfig_.md#const-imgixfixedargs)

### Functions

* [createImgixFixedFieldConfig](_createimgixfixedfieldconfig_.md#const-createimgixfixedfieldconfig)

## Variables

### `Const` imgixFixedArgs

• **imgixFixedArgs**: *object* = {
  width: { type: GraphQLInt, defaultValue: DEFAULT_FIXED_WIDTH },
  height: { type: GraphQLInt },
  imgixParams: { type: ImgixUrlParamsInputType, defaultValue: {} },
} as GraphQLFieldConfigArgumentMap

*Defined in [src/createImgixFixedFieldConfig.ts:22](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/createImgixFixedFieldConfig.ts#L22)*

#### Type declaration:

* \[ **key**: *string*\]: GraphQLArgumentConfig

## Functions

### `Const` createImgixFixedFieldConfig

▸ **createImgixFixedFieldConfig**<**TSource**, **TContext**>(`__namedParameters`: object): *GraphQLFieldConfig‹TSource, TContext, [ImgixFixedArgs](../interfaces/_types_.imgixfixedargs.md)›*

*Defined in [src/createImgixFixedFieldConfig.ts:36](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/createImgixFixedFieldConfig.ts#L36)*

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
