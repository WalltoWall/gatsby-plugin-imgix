import * as gatsby from 'gatsby'
import { FluidObject } from 'gatsby-image'
import { ComposeFieldConfigAsObject } from 'graphql-compose'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'

import { ImgixFluidArgs, ImgixUrlParams } from './types'
import { DEFAULT_FLUID_TYPE_NAME } from './createImgixFluidType'
import { DEFAULT_PARAMS_INPUT_TYPE_NAME } from './createImgixUrlParamsInputType'
import { buildImgixFluid, DEFAULT_FLUID_MAX_WIDTH } from './builders'
import { ImgixSourceDataResolver, resolveDimensions } from './shared'
import { taskEitherFromSourceDataResolver, noop } from './utils'

export interface CreateImgixFluidFieldConfigArgs<TSource> {
  type?: string
  paramsInputType?: string
  resolveUrl: ImgixSourceDataResolver<TSource, string>
  resolveWidth?: ImgixSourceDataResolver<TSource, number>
  resolveHeight?: ImgixSourceDataResolver<TSource, number>
  secureUrlToken?: string
  cache: gatsby.GatsbyCache
  defaultImgixParams?: ImgixUrlParams
  defaultPlaceholderImgixParams?: ImgixUrlParams
}

export const createImgixFluidFieldConfig = <TSource, TContext>({
  type = DEFAULT_FLUID_TYPE_NAME,
  paramsInputType = DEFAULT_PARAMS_INPUT_TYPE_NAME,
  resolveUrl,
  resolveWidth = noop,
  resolveHeight = noop,
  secureUrlToken,
  cache,
  defaultImgixParams,
  defaultPlaceholderImgixParams,
}: CreateImgixFluidFieldConfigArgs<TSource>): ComposeFieldConfigAsObject<
  TSource,
  TContext,
  ImgixFluidArgs
> => ({
  type,
  args: {
    maxWidth: {
      type: 'Int',
      defaultValue: DEFAULT_FLUID_MAX_WIDTH,
    },
    maxHeight: {
      type: 'Int',
    },
    srcSetBreakpoints: {
      type: '[Int]',
    },
    imgixParams: {
      type: paramsInputType,
      defaultValue: {},
    },
    placeholderImgixParams: {
      type: paramsInputType,
      defaultValue: {},
    },
  },
  resolve: (obj, args): Promise<FluidObject | undefined> =>
    pipe(
      obj,
      taskEitherFromSourceDataResolver(
        resolveUrl,
        (url) => typeof url === 'string',
      ),
      TE.chain((url) =>
        pipe(
          url,
          resolveDimensions(
            obj,
            resolveWidth,
            resolveHeight,
            cache,
            secureUrlToken,
          ),
          TE.map(([width, height]) =>
            buildImgixFluid({
              url,
              sourceWidth: width,
              sourceHeight: height,
              secureUrlToken,
              args: {
                ...args,
                imgixParams: {
                  ...defaultImgixParams,
                  ...args.imgixParams,
                },
                placeholderImgixParams: {
                  ...defaultPlaceholderImgixParams,
                  ...args.placeholderImgixParams,
                },
              },
            }),
          ),
        ),
      ),
      TE.getOrElseW(() => T.of(undefined)),
    )(),
})
