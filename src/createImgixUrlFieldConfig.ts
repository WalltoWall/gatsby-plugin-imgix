import { GraphQLFieldConfig, GraphQLString } from 'gatsby/graphql'
import { ComposeFieldConfigAsObject } from 'graphql-compose'
import * as O from 'fp-ts/lib/Option'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'

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
    resolve: (obj: TSource, args: ImgixUrlArgs): Promise<string | undefined> =>
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
      )(),
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
