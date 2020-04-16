import { graphql } from 'gatsby'

export const GatsbyImgixFixedType = graphql`
  fragment GatsbyImgixFixed on ImgixImageFixedType {
    base64
    width
    height
    src
    srcSet
    srcWebp
    srcSetWebp
  }
`

export const GatsbyImgixFixed_noBase64 = graphql`
  fragment GatsbyImgixFixed_noBase64 on ImgixImageFixedType {
    width
    height
    src
    srcSet
    srcWebp
    srcSetWebp
  }
`

// Not actually necessary - since Imgix is scaling,
// there is no "penalty" for including WebP by default
export const GatsbyImgixFixed_withWebp = graphql`
  fragment GatsbyImgixFixed_withWebp on ImgixImageFixedType {
    base64
    width
    height
    src
    srcSet
    srcWebp
    srcSetWebp
  }
`

// Not actually necessary - since Imgix is scaling,
// there is no "penalty" for including WebP by default
export const GatsbyImgixFixed_withWebp_noBase64 = graphql`
  fragment GatsbyImgixFixed_withWebp_noBase64 on ImgixImageFixedType {
    width
    height
    src
    srcSet
    srcWebp
    srcSetWebp
  }
`

export const GatsbyImgixFluidType = graphql`
  fragment GatsbyImgixFluid on ImgixImageFluidType {
    base64
    aspectRatio
    src
    srcSet
    srcWebp
    srcSetWebp
    sizes
  }
`

export const GatsbyImgixFluid_noBase64 = graphql`
  fragment GatsbyImgixFluid_noBase64 on ImgixImageFluidType {
    aspectRatio
    src
    srcSet
    srcWebp
    srcSetWebp
    sizes
  }
`

// Not actually necessary - since Imgix is scaling,
// there is no "penalty" for including WebP by default
export const GatsbyImgixFluid_withWebp = graphql`
  fragment GatsbyImgixFluid_withWebp on ImgixImageFluidType {
    base64
    aspectRatio
    src
    srcSet
    srcWebp
    srcSetWebp
    sizes
  }
`

// Not actually necessary - since Imgix is scaling,
// there is no "penalty" for including WebP by default
export const GatsbyImgixFluid_withWebp_noBase64 = graphql`
  fragment GatsbyImgixFluid_withWebp_noBase64 on ImgixImageFluidType {
    aspectRatio
    src
    srcSet
    srcWebp
    srcSetWebp
    sizes
  }
`
