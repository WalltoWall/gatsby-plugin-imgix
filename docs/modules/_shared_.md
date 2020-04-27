[gatsby-plugin-imgix](../README.md) › [Globals](../globals.md) › ["shared"](_shared_.md)

# Module: "shared"

## Index

### Type aliases

* [ImgixResolveUrl](_shared_.md#imgixresolveurl)

### Variables

* [ImgixUrlParamsInputType](_shared_.md#const-imgixurlparamsinputtype)
* [imgixUrlParams](_shared_.md#const-imgixurlparams)

### Functions

* [fetchImgixBase64Url](_shared_.md#const-fetchimgixbase64url)
* [fetchImgixMetadata](_shared_.md#const-fetchimgixmetadata)

## Type aliases

###  ImgixResolveUrl

Ƭ **ImgixResolveUrl**: *function*

*Defined in [src/shared.ts:22](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/e91e6e9/src/shared.ts#L22)*

#### Type declaration:

▸ (`obj`: TSource): *[OptionalPromise](_utils_.md#optionalpromise)‹[Nullable](_utils_.md#nullable)‹string››*

**Parameters:**

Name | Type |
------ | ------ |
`obj` | TSource |

## Variables

### `Const` ImgixUrlParamsInputType

• **ImgixUrlParamsInputType**: *GraphQLInputObjectType‹›* = new GraphQLInputObjectType({
  name: 'ImgixParamsInputType',
  fields: imgixUrlParams,
})

*Defined in [src/shared.ts:17](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/e91e6e9/src/shared.ts#L17)*

___

### `Const` imgixUrlParams

• **imgixUrlParams**: *object* = {
  w: { type: GraphQLInt },
  h: { type: GraphQLInt },
} as GraphQLFieldConfigArgumentMap

*Defined in [src/shared.ts:12](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/e91e6e9/src/shared.ts#L12)*

#### Type declaration:

* \[ **key**: *string*\]: GraphQLArgumentConfig

## Functions

### `Const` fetchImgixBase64Url

▸ **fetchImgixBase64Url**(`__namedParameters`: object): *Promise‹string›*

*Defined in [src/shared.ts:66](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/e91e6e9/src/shared.ts#L66)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`cache` | object |
`secureUrlToken` | undefined &#124; string |
`url` | string |

**Returns:** *Promise‹string›*

___

### `Const` fetchImgixMetadata

▸ **fetchImgixMetadata**(`__namedParameters`: object): *Promise‹ImgixMetadata›*

*Defined in [src/shared.ts:38](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/e91e6e9/src/shared.ts#L38)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`cache` | object |
`secureUrlToken` | undefined &#124; string |
`url` | string |

**Returns:** *Promise‹ImgixMetadata›*
