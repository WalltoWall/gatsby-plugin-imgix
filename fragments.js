import { graphql } from 'gatsby'

export const GatsbyImgixFixedType = graphql`
  fragment GatsbyImgixFixed on ImgixFluid {
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
  fragment GatsbyImgixFixed_noBase64 on ImgixFluid {
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
  fragment GatsbyImgixFixed_withWebp on ImgixFluid {
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
  fragment GatsbyImgixFixed_withWebp_noBase64 on ImgixFluid {
    width
    height
    src
    srcSet
    srcWebp
    srcSetWebp
  }
`

export const GatsbyImgixFluidType = graphql`
  fragment GatsbyImgixFluid on ImgixFluid {
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
  fragment GatsbyImgixFluid_noBase64 on ImgixFluid {
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
  fragment GatsbyImgixFluid_withWebp on ImgixFluid {
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
  fragment GatsbyImgixFluid_withWebp_noBase64 on ImgixFluid {
    aspectRatio
    src
    srcSet
    srcWebp
    srcSetWebp
    sizes
  }
`
