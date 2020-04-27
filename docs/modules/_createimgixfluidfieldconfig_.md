[gatsby-plugin-imgix](../README.md) › [Globals](../globals.md) › ["createImgixFluidFieldConfig"](_createimgixfluidfieldconfig_.md)

# Module: "createImgixFluidFieldConfig"

## Index

### Interfaces

* [CreateImgixFluidFieldConfigArgs](../interfaces/_createimgixfluidfieldconfig_.createimgixfluidfieldconfigargs.md)

### Variables

* [imgixFluidArgs](_createimgixfluidfieldconfig_.md#const-imgixfluidargs)

### Functions

* [createImgixFluidFieldConfig](_createimgixfluidfieldconfig_.md#const-createimgixfluidfieldconfig)

## Variables

### `Const` imgixFluidArgs

• **imgixFluidArgs**: *object* = {
  maxWidth: { type: GraphQLInt, defaultValue: DEFAULT_FLUID_MAX_WIDTH },
  maxHeight: { type: GraphQLInt },
  srcSetBreakpoints: { type: new GraphQLList(GraphQLInt) },
  imgixParams: { type: ImgixUrlParamsInputType, defaultValue: {} },
} as GraphQLFieldConfigArgumentMap

*Defined in [src/createImgixFluidFieldConfig.ts:24](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/createImgixFluidFieldConfig.ts#L24)*

#### Type declaration:

* \[ **key**: *string*\]: GraphQLArgumentConfig

## Functions

### `Const` createImgixFluidFieldConfig

▸ **createImgixFluidFieldConfig**<**TSource**, **TContext**>(`__namedParameters`: object): *GraphQLFieldConfig‹TSource, TContext, [ImgixFluidArgs](../interfaces/_types_.imgixfluidargs.md)›*

*Defined in [src/createImgixFluidFieldConfig.ts:39](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/createImgixFluidFieldConfig.ts#L39)*

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
