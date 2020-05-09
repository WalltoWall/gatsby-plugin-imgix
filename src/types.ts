import { Nullable, OptionalPromise } from './utils'

export type ImgixResolveUrl<TSource> = (
  obj: TSource,
) => OptionalPromise<Nullable<string>>

export interface ImgixUrlParams {
  w?: number
  h?: number
}

export interface ImgixFixedArgs {
  width?: number
  height?: number
  imgixParams?: ImgixUrlParams
}

export interface ImgixFluidArgs {
  maxWidth?: number
  maxHeight?: number
  srcSetBreakpoints?: number[]
  imgixParams?: ImgixUrlParams
}
