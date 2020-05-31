import imgixUrlParameters from 'imgix-url-params/dist/parameters.json'

type ImgixUrlParametersSpec = typeof imgixUrlParameters

export type ImgixUrlParams = Partial<
  Record<
    | keyof ImgixUrlParametersSpec['parameters']
    | keyof ImgixUrlParametersSpec['aliases'],
    string | number | boolean | undefined
  >
>

export interface ImgixFixedArgs {
  width?: number
  height?: number
  imgixParams?: ImgixUrlParams
  placeholderImgixParams?: ImgixUrlParams
}

export interface ImgixFluidArgs {
  maxWidth?: number
  maxHeight?: number
  srcSetBreakpoints?: number[]
  imgixParams?: ImgixUrlParams
  placeholderImgixParams?: ImgixUrlParams
}

export interface ImgixMetadata {
  'Content-Type': string
  PixelWidth: number
  PixelHeight: number
}
