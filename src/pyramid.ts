import {
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'gatsby/graphql'
import { buildImgixUrl as _buildImgixUrl, ImgixUrlQueryParams } from 'ts-imgix'
import { createHash } from 'crypto'

type Nullable<T> = T | null | undefined
type OptionalPromise<T> = T | Promise<T>

const buildImgixUrl = (url: string, token?: string) => (
  params: ImgixUrlQueryParams,
) => {
  const imgixUrl = _buildImgixUrl(url)(params)
  const parsed = new URL(imgixUrl)

  const signatureBase = token + parsed.pathname + parsed.search
  const signature = createHash('md5')
    .update(signatureBase)
    .digest('hex')

  parsed.searchParams.append('s', signature)

  return parsed.href
}

/**
 * Shared
 */

export interface ImgixUrlParams {
  w?: number
  h?: number
}

const imgixUrlParams = {
  w: { type: GraphQLInt },
  h: { type: GraphQLInt },
} as GraphQLFieldConfigArgumentMap

const ImgixUrlParamsInputType = new GraphQLInputObjectType({
  name: 'ImgixParamsInputType',
  fields: imgixUrlParams,
})

export type ImgixResolveUrl<TSource> = (
  obj: TSource,
) => OptionalPromise<Nullable<string>>

export const ImgixFixedType = new GraphQLObjectType({
  name: 'ImgixFixed',
  fields: {
    base64: { type: new GraphQLNonNull(GraphQLString) },
    src: { type: new GraphQLNonNull(GraphQLString) },
    srcSet: { type: new GraphQLNonNull(GraphQLString) },
    srcWebp: { type: new GraphQLNonNull(GraphQLString) },
    srcSetWebp: { type: new GraphQLNonNull(GraphQLString) },
    sizes: { type: new GraphQLNonNull(GraphQLString) },
    width: { type: new GraphQLNonNull(GraphQLInt) },
    height: { type: new GraphQLNonNull(GraphQLInt) },
  },
})

export const ImgixFluidType = new GraphQLObjectType({
  name: 'ImgixFluid',
  fields: {
    base64: { type: new GraphQLNonNull(GraphQLString) },
    src: { type: new GraphQLNonNull(GraphQLString) },
    srcSet: { type: new GraphQLNonNull(GraphQLString) },
    srcWebp: { type: new GraphQLNonNull(GraphQLString) },
    srcSetWebp: { type: new GraphQLNonNull(GraphQLString) },
    sizes: { type: new GraphQLNonNull(GraphQLString) },
    aspectRatio: { type: new GraphQLNonNull(GraphQLFloat) },
  },
})

/**
 * createImgixUrlResolver
 */

interface CreateImgixUrlFieldConfigArgs<TSource> {
  resolveUrl: ImgixResolveUrl<TSource>
  secureURLToken?: string
}

export interface ImgixUrlArgs {
  imgixParams: ImgixUrlParams
}

const imgixUrlArgs = {
  imgixParams: { type: ImgixUrlParamsInputType, defaultValue: {} },
} as GraphQLFieldConfigArgumentMap

export const createImgixUrlFieldConfig = <TSource, TContext>({
  resolveUrl,
  secureURLToken,
}: CreateImgixUrlFieldConfigArgs<TSource>): GraphQLFieldConfig<
  TSource,
  TContext,
  ImgixUrlArgs
> => ({
  type: GraphQLString,
  args: imgixUrlArgs,
  resolve: async (obj, args) => {
    const url = await resolveUrl(obj)
    if (!url) return

    buildImgixUrl(url, secureURLToken)(args.imgixParams)
  },
})

/**
 * createImgixFixedResolver
 */

interface CreateImgixFixedFieldConfigArgs<TSource> {
  resolveUrl: ImgixResolveUrl<TSource>
  secureURLToken?: string
}

export interface ImgixFixedArgs {
  width: number
  height?: number
  imgixParams: ImgixUrlParams
}

const imgixFixedArgs = {
  width: { type: GraphQLInt, defaultValue: 400 },
  height: { type: GraphQLInt },
  imgixParams: { type: ImgixUrlParamsInputType, defaultValue: {} },
} as GraphQLFieldConfigArgumentMap

export const createImgixFixedFieldConfig = <TSource, TContext>({
  resolveUrl,
  secureURLToken,
}: CreateImgixFixedFieldConfigArgs<TSource>): GraphQLFieldConfig<
  TSource,
  TContext,
  ImgixFixedArgs
> => ({
  type: ImgixFixedType,
  args: imgixFixedArgs,
  resolve: async (obj, args) => {
    const url = await resolveUrl(obj)
    if (!url) return

    buildImgixUrl(url, secureURLToken)(args.imgixParams)
  },
})

/**
 * createImgixFluidResolver
 */

interface CreateImgixFluidFieldConfigArgs<TSource> {
  resolveUrl: ImgixResolveUrl<TSource>
  secureURLToken?: string
}

export interface ImgixFluidArgs {
  maxWidth: number
  maxHeight?: number
  imgixParams: ImgixUrlParams
}

const imgixFluidArgs = {
  maxWidth: { type: GraphQLInt, defaultValue: 800 },
  maxHeight: { type: GraphQLInt },
  imgixParams: { type: ImgixUrlParamsInputType, defaultValue: {} },
} as GraphQLFieldConfigArgumentMap

export const createImgixFluidFieldConfig = <TSource, TContext>({
  resolveUrl,
  secureURLToken,
}: CreateImgixFluidFieldConfigArgs<TSource>): GraphQLFieldConfig<
  TSource,
  TContext,
  ImgixFluidArgs
> => ({
  type: ImgixFluidType,
  args: imgixFluidArgs,
  resolve: async (obj, args) => {
    const url = await resolveUrl(obj)
    if (!url) return

    buildImgixUrl(url, secureURLToken)(args.imgixParams)
  },
})
