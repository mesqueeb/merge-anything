/* eslint-disable */

/* Required packages: */
// npm i -D \
// @babel/core \
// @babel/plugin-proposal-object-rest-spread \
// @babel/preset-env \
// rollup \
// rollup-plugin-babel@latest \
// rollup-plugin-commonjs \
// rollup-plugin-node-resolve \
// rollup-plugin-terser \
// is-what

/* Required .babelrc setup: */
// {
//   "presets": [
//     ["@babel/preset-env", {
//       "modules": false
//     }]
//   ],
//   "plugins": [
//     "@babel/plugin-proposal-object-rest-spread"
//   ]
// }

import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import { isArray } from 'is-what'
// import resolve from 'rollup-plugin-node-resolve'

// ------------------------------------------------------------------------------------------
// formats
// ------------------------------------------------------------------------------------------
// cjs – CommonJS, suitable for Node and Browserify/Webpack
// es – Keep the bundle as an ES module file
// iife – A self-executing function, suitable for inclusion as a <script> tag. (If you want to create a bundle for your application, you probably want to use this, because it leads to smaller file sizes.)
// umd – Universal Module Definition, works as amd, cjs and iife all in one

// ------------------------------------------------------------------------------------------
// setup
// ------------------------------------------------------------------------------------------
const files = [
  {in: 'src/index.js', out: 'dist', formats: ['cjs', 'es']},
]
const minify = false
const sourcemap = false
const plugins = [
  babel({
    exclude: 'node_modules/**' // only transpile our source code
  }),
  commonjs()
]
// ------------------------------------------------------------------------------------------
const pkg = require('../package.json')
const name = pkg.name
const className = name.replace(/(^\w|-\w)/g, c => c.replace('-', '').toUpperCase())
const external = Object.keys(pkg.dependencies || [])

// ------------------------------------------------------------------------------------------
// Builds
// ------------------------------------------------------------------------------------------
const nsNameExt = new RegExp('(.+)\/([^\/]+)\.([^\.]+$)', 'g')
function getNS (name) {
  if (!name.includes('/')) return ''
  return name.replace(nsNameExt, '$1')
}
function getName (name) {
  if (!name.includes('/')) name = 'a/' + name
  name = name.replace(nsNameExt, '$2')
  if (name.endsWith('.')) name = name.slice(0, -1)
  return name
}
function getExt (name) {
  return name.split('.').pop()
}
function getFileInfo (file) {
  return {
    ns:       getNS(file.in),
    name:     getName(file.in),
    ext:      getExt(file.in),
    out:      file.out,
    formats:  !isArray(file.formats) ? [file.formats] : file.formats,
    plugins:  (file.plugins === undefined) ? plugins : file.plugins,
    min:      (file.minify === undefined) ? minify : file.minify,
    map:      (file.sourcemap === undefined) ? sourcemap : file.sourcemap,
    external: external,
  }
}
function getRollupObject (info, format) {
  return {
    input: `${info.ns}/${info.name}.${info.ext}`,
    output: {
      name: className,
      sourcemap: info.map,
      exports: 'named',
      file: (!info.min)
        ? `${info.out}/${info.name}.${format}.${info.ext}`
        : `${info.out}/${info.name}.${format}.min.${info.ext}`,
      format
    },
    plugins: (!info.min) ? plugins : plugins.concat(terser()),
    external: info.external
  }
}
const builds = files.reduce((carry, file) => {
  const info = getFileInfo(file)
  const _builds = info.formats
    .reduce((carry, format) => {
      return carry
        .concat(getRollupObject(info, format))
    }, [])

  return carry.concat(_builds)
}, [])

export default builds
