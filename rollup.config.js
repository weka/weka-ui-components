import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import scss from 'rollup-plugin-scss'
import svgr from '@svgr/rollup'
import url from '@rollup/plugin-url'
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default [
  {
    external: ['react', 'react/jsx-runtime', 'react-dom'],
    input: './src/index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.es.js',
        format: 'es',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react']
      }),
      resolve(),
      commonjs({ include: ['node_modules/**'] }),
      url(),
      svgr(),
      scss({
        output: "./dist/style/theme.scss",
        failOnError: true,
      }),
    ]
  }
];
