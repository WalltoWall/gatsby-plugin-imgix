import { ComposeFieldConfigAsObject } from 'graphql-compose'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'

import { buildImgixUrl } from './builders'
import { ImgixSourceDataResolver } from './shared'
import { DEFAULT_PARAMS_INPUT_TYPE_NAME } from './createImgixUrlParamsInputType'
import { ImgixUrlParams } from './types'
import {
  taskEitherFromSourceDataResolver,
  semigroupImgixUrlParams,
} from './utils'

export interface ImgixUrlArgs {
  imgixParams?: ImgixUrlParams
}

interface CreateImgixUrlFieldConfigArgs<TSource> {
  paramsInputType?: string
  resolveUrl: ImgixSourceDataResolver<TSource, string>
  secureUrlToken?: string
  defaultImgixParams?: ImgixUrlParams
}

export const createImgixUrlFieldConfig = <TSource, TContext>({
  paramsInputType = DEFAULT_PARAMS_INPUT_TYPE_NAME,
  resolveUrl,
  secureUrlToken,
  defaultImgixParams = {},
}: CreateImgixUrlFieldConfigArgs<TSource>): ComposeFieldConfigAsObject<
  TSource,
  TContext,
  ImgixUrlArgs
> => ({
  type: 'String',
  args: {
    imgixParams: {
      type: paramsInputType,
      defaultValue: {},
    },
  },
  resolve: (obj, args): Promise<string | undefined> =>
    pipe(
      obj,
      taskEitherFromSourceDataResolver(resolveUrl),
      TE.map((url) =>
        pipe(
          semigroupImgixUrlParams.concat(
            defaultImgixParams,
            args.imgixParams ?? {},
          ),
          buildImgixUrl(url, secureUrlToken),
        ),
      ),
      TE.fold(() => T.of(undefined), T.of),
    )(),
})
