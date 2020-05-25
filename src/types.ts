export type ImgixUrlParams = Record<
  string,
  string | number | boolean | null | undefined
>

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
