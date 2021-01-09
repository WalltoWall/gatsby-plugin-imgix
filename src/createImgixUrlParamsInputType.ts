import * as gatsby from 'gatsby'
import * as gqlc from 'graphql-compose'
import imgixUrlParameters from 'imgix-url-params/dist/parameters.json'
import { camelCase } from 'camel-case'

export const DEFAULT_PARAMS_INPUT_TYPE_NAME = 'ImgixUrlParamsInput'

interface CreateImgixUrlParamsInputTypeArgs {
  name?: string
  schema: gatsby.NodePluginSchema
}

export const createImgixUrlParamsInputType = ({
  name = DEFAULT_PARAMS_INPUT_TYPE_NAME,
  schema,
}: CreateImgixUrlParamsInputTypeArgs) =>
  schema.buildInputObjectType({
    name,
    fields: Object.keys(imgixUrlParameters.parameters).reduce(
      (fields, param) => {
        const spec =
          imgixUrlParameters.parameters[
            param as keyof typeof imgixUrlParameters.parameters
          ]

        // The param name is camel-cased here to appease the GraphQL field
        // requirements. This will need to be reversed with param-case when the
        // URL is constructed in `buildImgixUrl`.
        const name = camelCase(param)

        const expects = spec.expects as { type: string }[]
        const expectsTypes = Array.from(
          new Set(expects.map((expect) => expect.type)),
        )

        // TODO: Clean up this mess.
        const type = expectsTypes.every(
          (type) => type === 'integer' || type === 'unit_scalar',
        )
          ? 'Int'
          : expectsTypes.every(
              (type) =>
                type === 'integer' ||
                type === 'unit_scalar' ||
                type === 'number',
            )
          ? 'Float'
          : expectsTypes.every((type) => type === 'boolean')
          ? 'Boolean'
          : 'String'

        fields[name] = {
          type,
          description:
            spec.short_description +
            // Ensure the description ends with a period.
            (spec.short_description.slice(-1) === '.' ? '' : '.'),
        }

        const field = fields[name] as gqlc.ComposeInputFieldConfigAsObject

        // Add the default value as part of the description. Setting it as a
        // GraphQL default value will automatically assign it in the final URL.
        // Doing so would result in a huge number of unwanted params.
        if ('default' in spec)
          field.description =
            field.description + ` Default: \`${spec.default}\`.`

        // Add Imgix documentation URL as part of the description.
        if ('url' in spec)
          field.description = field.description + ` [See docs](${spec.url}).`

        // Create aliased fields.
        if ('aliases' in spec)
          for (const alias of spec.aliases)
            fields[camelCase(alias)] = {
              ...field,
              description: `Alias for \`${name}\`.`,
            }

        return fields
      },
      {} as gqlc.ComposeInputFieldConfigMap,
    ),
  })
