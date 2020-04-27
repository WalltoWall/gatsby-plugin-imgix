[gatsby-plugin-imgix](../README.md) › [Globals](../globals.md) › ["builders"](_builders_.md)

# Module: "builders"

## Index

### Type aliases

* [BuildFluidSrcSetArgs](_builders_.md#buildfluidsrcsetargs)
* [BuildImgixFixedArgs](_builders_.md#buildimgixfixedargs)
* [BuildImgixFluidArgs](_builders_.md#buildimgixfluidargs)

### Variables

* [DEFAULT_FIXED_WIDTH](_builders_.md#const-default_fixed_width)
* [DEFAULT_FLUID_MAX_WIDTH](_builders_.md#const-default_fluid_max_width)
* [FIXED_RESOLUTIONS](_builders_.md#const-fixed_resolutions)
* [FLUID_BREAKPOINT_FACTORS](_builders_.md#const-fluid_breakpoint_factors)

### Functions

* [buildImgixFixed](_builders_.md#const-buildimgixfixed)
* [buildImgixFixedSrcSet](_builders_.md#const-buildimgixfixedsrcset)
* [buildImgixFluid](_builders_.md#const-buildimgixfluid)
* [buildImgixFluidSrcSet](_builders_.md#const-buildimgixfluidsrcset)
* [buildImgixLqipUrl](_builders_.md#const-buildimgixlqipurl)
* [buildImgixUrl](_builders_.md#const-buildimgixurl)

### Object literals

* [DEFAULT_LQIP_PARAMS](_builders_.md#const-default_lqip_params)

## Type aliases

###  BuildFluidSrcSetArgs

Ƭ **BuildFluidSrcSetArgs**: *object*

*Defined in [src/builders.ts:113](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L113)*

#### Type declaration:

* **aspectRatio**: *number*

* **maxWidth**: *number*

* **srcSetBreakpoints**? : *number[]*

___

###  BuildImgixFixedArgs

Ƭ **BuildImgixFixedArgs**: *object*

*Defined in [src/builders.ts:53](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L53)*

#### Type declaration:

* **args**? : *[ImgixFixedArgs](../interfaces/_types_.imgixfixedargs.md)*

* **secureUrlToken**? : *undefined | string*

* **sourceHeight**: *number*

* **sourceWidth**: *number*

* **url**: *string*

___

###  BuildImgixFluidArgs

Ƭ **BuildImgixFluidArgs**: *object*

*Defined in [src/builders.ts:147](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L147)*

#### Type declaration:

* **args**? : *[ImgixFluidArgs](../interfaces/_types_.imgixfluidargs.md)*

* **secureUrlToken**? : *undefined | string*

* **sourceHeight**: *number*

* **sourceWidth**: *number*

* **url**: *string*

## Variables

### `Const` DEFAULT_FIXED_WIDTH

• **DEFAULT_FIXED_WIDTH**: *400* = 400

*Defined in [src/builders.ts:7](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L7)*

___

### `Const` DEFAULT_FLUID_MAX_WIDTH

• **DEFAULT_FLUID_MAX_WIDTH**: *800* = 800

*Defined in [src/builders.ts:8](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L8)*

___

### `Const` FIXED_RESOLUTIONS

• **FIXED_RESOLUTIONS**: *number[]* = [1, 1.5, 2]

*Defined in [src/builders.ts:11](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L11)*

___

### `Const` FLUID_BREAKPOINT_FACTORS

• **FLUID_BREAKPOINT_FACTORS**: *number[]* = [0.25, 0.5, 1.5, 2]

*Defined in [src/builders.ts:14](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L14)*

## Functions

### `Const` buildImgixFixed

▸ **buildImgixFixed**(`__namedParameters`: object): *FixedObject*

*Defined in [src/builders.ts:66](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L66)*

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

### `Const` buildImgixFixedSrcSet

▸ **buildImgixFixedSrcSet**(`baseUrl`: string, `secureUrlToken?`: undefined | string): *(Anonymous function)*

*Defined in [src/builders.ts:41](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L41)*

**Parameters:**

Name | Type |
------ | ------ |
`baseUrl` | string |
`secureUrlToken?` | undefined &#124; string |

**Returns:** *(Anonymous function)*

___

### `Const` buildImgixFluid

▸ **buildImgixFluid**(`__namedParameters`: object): *FluidObject*

*Defined in [src/builders.ts:160](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L160)*

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

### `Const` buildImgixFluidSrcSet

▸ **buildImgixFluidSrcSet**(`baseUrl`: string, `secureUrlToken?`: undefined | string): *(Anonymous function)*

*Defined in [src/builders.ts:119](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L119)*

**Parameters:**

Name | Type |
------ | ------ |
`baseUrl` | string |
`secureUrlToken?` | undefined &#124; string |

**Returns:** *(Anonymous function)*

___

### `Const` buildImgixLqipUrl

▸ **buildImgixLqipUrl**(...`args`: [string, undefined | string]): *(Anonymous function)*

*Defined in [src/builders.ts:38](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | [string, undefined &#124; string] |

**Returns:** *(Anonymous function)*

___

### `Const` buildImgixUrl

▸ **buildImgixUrl**(`url`: string, `secureUrlToken?`: undefined | string): *(Anonymous function)*

*Defined in [src/builders.ts:19](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`url` | string |
`secureUrlToken?` | undefined &#124; string |

**Returns:** *(Anonymous function)*

## Object literals

### `Const` DEFAULT_LQIP_PARAMS

### ▪ **DEFAULT_LQIP_PARAMS**: *object*

*Defined in [src/builders.ts:17](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L17)*

###  blur

• **blur**: *number* = 15

*Defined in [src/builders.ts:17](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L17)*

###  q

• **q**: *number* = 20

*Defined in [src/builders.ts:17](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L17)*

###  w

• **w**: *number* = 100

*Defined in [src/builders.ts:17](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/builders.ts#L17)*
