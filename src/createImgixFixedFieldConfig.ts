import * as gatsby from 'gatsby'
import { FixedObject } from 'gatsby-image'
import { ComposeFieldConfigAsObject } from 'graphql-compose'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'

import { ImgixFixedArgs, ImgixUrlParams } from './types'
import { DEFAULT_FIXED_TYPE_NAME } from './createImgixFixedType'
import { DEFAULT_PARAMS_INPUT_TYPE_NAME } from './createImgixUrlParamsInputType'
import { buildImgixFixed, DEFAULT_FIXED_WIDTH } from './builders'
import { ImgixSourceDataResolver, resolveDimensions } from './shared'
import { taskEitherFromSourceDataResolver, noop } from './utils'

interface CreateImgixFixedFieldConfigArgs<TSource> {
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

export const createImgixFixedFieldConfig = <TSource, TContext>({
  type = DEFAULT_FIXED_TYPE_NAME,
  paramsInputType = DEFAULT_PARAMS_INPUT_TYPE_NAME,
  resolveUrl,
  resolveWidth = noop,
  resolveHeight = noop,
  secureUrlToken,
  cache,
  defaultImgixParams,
  defaultPlaceholderImgixParams,
}: CreateImgixFixedFieldConfigArgs<TSource>): ComposeFieldConfigAsObject<
  TSource,
  TContext,
  ImgixFixedArgs
> => ({
  type,
  args: {
    width: {
      type: 'Int',
      defaultValue: DEFAULT_FIXED_WIDTH,
    },
    height: {
      type: 'Int',
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
  resolve: (obj, args): Promise<FixedObject | undefined> =>
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
            buildImgixFixed({
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
