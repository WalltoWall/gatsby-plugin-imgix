[gatsby-plugin-imgix](../README.md) › [Globals](../globals.md) › ["builders"](_builders_.md)

# Module: "builders"

## Index

### Variables

* [DEFAULT_FIXED_WIDTH](_builders_.md#const-default_fixed_width)
* [DEFAULT_FLUID_MAX_WIDTH](_builders_.md#const-default_fluid_max_width)

### Functions

* [buildImgixFixed](_builders_.md#const-buildimgixfixed)
* [buildImgixFluid](_builders_.md#const-buildimgixfluid)
* [buildImgixUrl](_builders_.md#const-buildimgixurl)

## Variables

### `Const` DEFAULT_FIXED_WIDTH

• **DEFAULT_FIXED_WIDTH**: *400* = 400

*Defined in [src/builders.ts:7](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/e91e6e9/src/builders.ts#L7)*

___

### `Const` DEFAULT_FLUID_MAX_WIDTH

• **DEFAULT_FLUID_MAX_WIDTH**: *800* = 800

*Defined in [src/builders.ts:8](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/e91e6e9/src/builders.ts#L8)*

## Functions

### `Const` buildImgixFixed

▸ **buildImgixFixed**(`__namedParameters`: object): *FixedObject*

*Defined in [src/builders.ts:66](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/e91e6e9/src/builders.ts#L66)*

Builds a gatsby-image-compatible fixed image object from a base Imgix image URL.

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`args` | [ImgixFixedArgs](../interfaces/_types_.imgixfixedargs.md) |
`secureUrlToken` | undefined &#124; string |
`sourceHeight` | number |
`sourceWidth` | number |
`url` | string |

**Returns:** *FixedObject*

gatsby-image-compatible fixed image object.

___

### `Const` buildImgixFluid

▸ **buildImgixFluid**(`__namedParameters`: object): *FluidObject*

*Defined in [src/builders.ts:160](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/e91e6e9/src/builders.ts#L160)*

Builds a gatsby-image-compatible fluid image object from a base Imgix image URL.

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`args` | [ImgixFluidArgs](../interfaces/_types_.imgixfluidargs.md) |
`secureUrlToken` | undefined &#124; string |
`sourceHeight` | number |
`sourceWidth` | number |
`url` | string |

**Returns:** *FluidObject*

gatsby-image-compatible fluid image object.

___

### `Const` buildImgixUrl

▸ **buildImgixUrl**(`url`: string, `secureUrlToken?`: undefined | string): *(Anonymous function)*

*Defined in [src/builders.ts:19](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/e91e6e9/src/builders.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`url` | string |
`secureUrlToken?` | undefined &#124; string |

**Returns:** *(Anonymous function)*
