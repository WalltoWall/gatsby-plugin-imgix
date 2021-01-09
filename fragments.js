import { graphql } from 'gatsby'

export const GatsbyImgixFixed = graphql`
  fragment GatsbyImgixFixed on ImgixFixedImage {
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
  fragment GatsbyImgixFixed_noBase64 on ImgixFixedImage {
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
  fragment GatsbyImgixFixed_withWebp on ImgixFixedImage {
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
  fragment GatsbyImgixFixed_withWebp_noBase64 on ImgixFixedImage {
    width
    height
    src
    srcSet
    srcWebp
    srcSetWebp
  }
`

export const GatsbyImgixFluid = graphql`
  fragment GatsbyImgixFluid on ImgixFluidImage {
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
  fragment GatsbyImgixFluid_noBase64 on ImgixFluidImage {
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
  fragment GatsbyImgixFluid_withWebp on ImgixFluidImage {
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
  fragment GatsbyImgixFluid_withWebp_noBase64 on ImgixFluidImage {
    aspectRatio
    src
    srcSet
    srcWebp
    srcSetWebp
    sizes
  }
`
