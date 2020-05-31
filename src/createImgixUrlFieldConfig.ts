import { GraphQLFieldConfig, GraphQLString } from 'gatsby/graphql'
import { ComposeFieldConfigAsObject } from 'graphql-compose'
import * as O from 'fp-ts/es6/Option'
import * as T from 'fp-ts/es6/Task'
import * as TE from 'fp-ts/es6/TaskEither'
import { Task } from 'fp-ts/es6/Task'
import { pipe } from 'fp-ts/es6/pipeable'

import { buildImgixUrl } from './builders'
import { ImgixResolveUrl, ImgixUrlParamsInputType } from './shared'
import { ImgixUrlParams } from './types'
import { taskEitherFromUrlResolver, semigroupImgixUrlParams } from './utils'

export interface ImgixUrlArgs {
  imgixParams?: ImgixUrlParams
}

interface CreateImgixUrlFieldConfigArgs<TSource> {
  resolveUrl: ImgixResolveUrl<TSource>
  secureUrlToken?: string
  defaultImgixParams?: ImgixUrlParams
}

export const createImgixUrlFieldConfig = <TSource, TContext>({
  resolveUrl,
  secureUrlToken: rawSecureUrlToken,
  defaultImgixParams = {},
}: CreateImgixUrlFieldConfigArgs<TSource>): GraphQLFieldConfig<
  TSource,
  TContext,
  ImgixUrlArgs
> => {
  const secureUrlToken = O.fromNullable(rawSecureUrlToken)

  return {
    type: GraphQLString,
    args: {
      imgixParams: {
        type: ImgixUrlParamsInputType,
        defaultValue: {},
      },
    },
    resolve: (obj, args): Task<string | undefined> =>
      pipe(
        obj,
        taskEitherFromUrlResolver(resolveUrl),
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
      ),
  }
}

export const createImgixUrlSchemaFieldConfig = <TSource, TContext>(
  args: CreateImgixUrlFieldConfigArgs<TSource>,
): ComposeFieldConfigAsObject<TSource, TContext, ImgixUrlArgs> =>
  createImgixUrlFieldConfig(args) as ComposeFieldConfigAsObject<
    TSource,
    TContext,
    ImgixUrlArgs
  >
