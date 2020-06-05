import { GraphQLFieldConfig, GraphQLString } from 'gatsby/graphql'
import { ComposeFieldConfigAsObject } from 'graphql-compose'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'

import { buildImgixUrl } from './builders'
import { ImgixSourceDataResolver, ImgixUrlParamsInputType } from './shared'
import { ImgixUrlParams } from './types'
import {
  taskEitherFromSourceDataResolver,
  semigroupImgixUrlParams,
} from './utils'

export interface ImgixUrlArgs {
  imgixParams?: ImgixUrlParams
}

interface CreateImgixUrlFieldConfigArgs<TSource> {
  resolveUrl: ImgixSourceDataResolver<TSource, string>
  secureUrlToken?: string
  defaultImgixParams?: ImgixUrlParams
}

export const createImgixUrlFieldConfig = <TSource, TContext>({
  resolveUrl,
  secureUrlToken,
  defaultImgixParams = {},
}: CreateImgixUrlFieldConfigArgs<TSource>): GraphQLFieldConfig<
  TSource,
  TContext,
  ImgixUrlArgs
> => ({
  type: GraphQLString,
  args: {
    imgixParams: {
      type: ImgixUrlParamsInputType,
      defaultValue: {},
    },
  },
  resolve: (obj: TSource, args: ImgixUrlArgs): Promise<string | undefined> =>
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

export const createImgixUrlSchemaFieldConfig = <TSource, TContext>(
  args: CreateImgixUrlFieldConfigArgs<TSource>,
): ComposeFieldConfigAsObject<TSource, TContext, ImgixUrlArgs> =>
  createImgixUrlFieldConfig(args) as ComposeFieldConfigAsObject<
    TSource,
    TContext,
    ImgixUrlArgs
  >
