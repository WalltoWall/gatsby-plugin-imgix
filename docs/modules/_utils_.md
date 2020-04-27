[gatsby-plugin-imgix](../README.md) › [Globals](../globals.md) › ["utils"](_utils_.md)

# Module: "utils"

## Index

### Type aliases

* [Maybe](_utils_.md#maybe)
* [Nullable](_utils_.md#nullable)
* [OptionalPromise](_utils_.md#optionalpromise)

### Functions

* [invariant](_utils_.md#invariant)
* [ns](_utils_.md#const-ns)
* [transformUrlForWebProxy](_utils_.md#const-transformurlforwebproxy)

## Type aliases

###  Maybe

Ƭ **Maybe**: *T | undefined*

*Defined in [src/utils.ts:3](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/utils.ts#L3)*

___

###  Nullable

Ƭ **Nullable**: *[Maybe](_utils_.md#maybe)‹T | null›*

*Defined in [src/utils.ts:4](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/utils.ts#L4)*

___

###  OptionalPromise

Ƭ **OptionalPromise**: *T | Promise‹T›*

*Defined in [src/utils.ts:5](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/utils.ts#L5)*

## Functions

###  invariant

▸ **invariant**(`condition`: unknown, `msg`: string, `reporter`: Reporter): *asserts condition*

*Defined in [src/utils.ts:7](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/utils.ts#L7)*

**Parameters:**

Name | Type |
------ | ------ |
`condition` | unknown |
`msg` | string |
`reporter` | Reporter |

**Returns:** *asserts condition*

___

### `Const` ns

▸ **ns**(`namespace`: string, `str`: string): *string*

*Defined in [src/utils.ts:24](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/utils.ts#L24)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`namespace` | string | "" |
`str` | string | - |

**Returns:** *string*

___

### `Const` transformUrlForWebProxy

▸ **transformUrlForWebProxy**(`url`: string, `domain`: string): *string*

*Defined in [src/utils.ts:15](https://github.com/WalltoWall/gatsby-plugin-imgix/blob/c3f9759/src/utils.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`url` | string |
`domain` | string |

**Returns:** *string*
