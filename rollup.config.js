import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import autoExternal from 'rollup-plugin-auto-external'

const externalPkgs = ['gatsby/graphql', /fp-ts\/.*/]

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: './',
      entryFileNames: 'lib/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    external: externalPkgs,
    plugins: [
      typescript({
        declaration: true,
        declarationDir: 'lib',
        rootDir: 'src',
      }),
      json(),
      autoExternal(),
    ],
  },
  {
    input: 'src/index.ts',
    output: { file: 'lib/index.esm.js', format: 'es', sourcemap: true },
    external: externalPkgs,
    plugins: [typescript(), json(), autoExternal()],
  },
  {
    input: 'src/node.ts',
    output: {
      dir: './',
      entryFileNames: 'lib/node.js',
      format: 'cjs',
      sourcemap: true,
    },
    external: externalPkgs,
    plugins: [
      typescript({
        declaration: true,
        declarationDir: 'lib',
        rootDir: 'src',
      }),
      json(),
      autoExternal(),
    ],
  },
  {
    input: 'src/gatsby-node.ts',
    output: { file: 'lib/gatsby-node.js', format: 'cjs', sourcemap: true },
    external: externalPkgs,
    plugins: [typescript(), json(), autoExternal()],
  },
]
