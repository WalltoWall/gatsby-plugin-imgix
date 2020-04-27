[gatsby-plugin-imgix](../README.md) › [Globals](../globals.md) › ["index"](_index_.md)

# Module: "index"

## Index

### Modules

* ["gatsby-node"](_index_._gatsby_node_.md)

### Interfaces

* [ImgixUrlArgs](../interfaces/_index_.imgixurlargs.md)

### Functions

* [buildImgixFixed](_index_.md#const-buildimgixfixed)
* [buildImgixFluid](_index_.md#const-buildimgixfluid)
* [createImgixFixedFieldConfig](_index_.md#const-createimgixfixedfieldconfig)
* [createImgixFluidFieldConfig](_index_.md#const-createimgixfluidfieldconfig)
* [createImgixUrlFieldConfig](_index_.md#const-createimgixurlfieldconfig)
* [transformUrlForWebProxy](_index_.md#const-transformurlforwebproxy)

## Functions

### `Const` buildImgixFixed

▸ **buildImgixFixed**(`__namedParameters`: object): *FixedObject*

*Defined in [src/builders.ts:66](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/cbe46b2/src/builders.ts#L66)*

Builds a gatsby-image-compatible fixed image object from a base Imgix image URL.

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`args` | ImgixFixedArgs |
`secureUrlToken` | undefined &#124; string |
`sourceHeight` | number |
`sourceWidth` | number |
`url` | string |

**Returns:** *FixedObject*

gatsby-image-compatible fixed image object.

___

### `Const` buildImgixFluid

▸ **buildImgixFluid**(`__namedParameters`: object): *FluidObject*

*Defined in [src/builders.ts:160](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/cbe46b2/src/builders.ts#L160)*

Builds a gatsby-image-compatible fluid image object from a base Imgix image URL.

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`args` | ImgixFluidArgs |
`secureUrlToken` | undefined &#124; string |
`sourceHeight` | number |
`sourceWidth` | number |
`url` | string |

**Returns:** *FluidObject*

gatsby-image-compatible fluid image object.

___

### `Const` createImgixFixedFieldConfig

▸ **createImgixFixedFieldConfig**<**TSource**, **TContext**>(`__namedParameters`: object): *GraphQLFieldConfig‹TSource, TContext, ImgixFixedArgs›*

*Defined in [src/createImgixFixedFieldConfig.ts:36](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/cbe46b2/src/createImgixFixedFieldConfig.ts#L36)*

**Type parameters:**

▪ **TSource**

▪ **TContext**

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`cache` | object |
`defaultImgixParams` | undefined &#124; ImgixUrlParams |
`namespace` | undefined &#124; string |
`resolveUrl` | function |
`secureUrlToken` | undefined &#124; string |

**Returns:** *GraphQLFieldConfig‹TSource, TContext, ImgixFixedArgs›*

___

### `Const` createImgixFluidFieldConfig

▸ **createImgixFluidFieldConfig**<**TSource**, **TContext**>(`__namedParameters`: object): *GraphQLFieldConfig‹TSource, TContext, ImgixFluidArgs›*

*Defined in [src/createImgixFluidFieldConfig.ts:39](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/cbe46b2/src/createImgixFluidFieldConfig.ts#L39)*

**Type parameters:**

▪ **TSource**

▪ **TContext**

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`cache` | object |
`defaultImgixParams` | undefined &#124; ImgixUrlParams |
`namespace` | undefined &#124; string |
`resolveUrl` | function |
`secureUrlToken` | undefined &#124; string |

**Returns:** *GraphQLFieldConfig‹TSource, TContext, ImgixFluidArgs›*

___

### `Const` createImgixUrlFieldConfig

▸ **createImgixUrlFieldConfig**<**TSource**, **TContext**>(`__namedParameters`: object): *GraphQLFieldConfig‹TSource, TContext, [ImgixUrlArgs](../interfaces/_index_.imgixurlargs.md)›*

*Defined in [src/createImgixUrlFieldConfig.ts:31](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/cbe46b2/src/createImgixUrlFieldConfig.ts#L31)*

Creates a GraphQL field config object that resolves an Imgix URL string to one with URL parameters.

**Type parameters:**

▪ **TSource**

▪ **TContext**

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`defaultImgixParams` | undefined &#124; ImgixUrlParams |
`resolveUrl` | function |
`secureUrlToken` | undefined &#124; string |

**Returns:** *GraphQLFieldConfig‹TSource, TContext, [ImgixUrlArgs](../interfaces/_index_.imgixurlargs.md)›*

GraphQL field config to pass to a GraphQL constructor or a Gatsby schema builder.

___

### `Const` transformUrlForWebProxy

▸ **transformUrlForWebProxy**(`url`: string, `domain`: string): *string*

*Defined in [src/utils.ts:15](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/cbe46b2/src/utils.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`url` | string |
`domain` | string |

**Returns:** *string*
