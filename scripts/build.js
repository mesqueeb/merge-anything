/* eslint-disable */

// npm i -D rollup rollup-plugin-typescript2 typescript
import typescript from 'rollup-plugin-typescript2'

const pkg = require('../package.json')

export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.cjs', format: 'cjs' },
    { file: 'dist/index.es.js', format: 'esm' },
  ],
  plugins: [
    typescript({ useTsconfigDeclarationDir: true, tsconfigOverride: { exclude: ['test/**/*'] } }),
  ],
  external: Object.keys(pkg.dependencies || []),
}
