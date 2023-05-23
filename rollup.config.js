/* eslint-disable */
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import pkg from './package.json' assert { type: 'json' }

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.exports['.'].import.default,
        format: 'esm',
        generatedCode: { constBindings: true },
      },
      {
        file: pkg.exports['.'].require.default,
        format: 'cjs',
        generatedCode: { constBindings: true },
      },
    ],
    plugins: [
      esbuild({
        sourceMap: false,
        target: 'esnext',
        loaders: { '.json': 'json' },
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.exports['.'].import.types,
        format: 'esm',
        generatedCode: { constBindings: true },
      },
      {
        file: pkg.exports['.'].require.types,
        format: 'cjs',
        generatedCode: { constBindings: true },
      },
    ],
    plugins: [dts()],
  },
]
