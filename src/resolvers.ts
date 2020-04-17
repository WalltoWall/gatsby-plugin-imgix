import {
  buildFixedGatsbyImage,
  buildFluidGatsbyImage2,
  GatsbyImageFixedArgs,
  GatsbyImageFluidArgs,
} from '.'

export const createFixedResolver = (token?: string) => (
  url: string,
  args: GatsbyImageFixedArgs,
) => (url ? buildFixedGatsbyImage(url, 1, 1, args, token) : undefined)

export const createFluidResolver = (token?: string) => (
  url: string,
  args: GatsbyImageFluidArgs,
) => (url ? buildFluidGatsbyImage2(url, args, token) : undefined)
