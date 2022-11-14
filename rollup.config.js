import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import scss from 'rollup-plugin-scss'
import svgr from '@svgr/rollup'
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    external: ['react','react/jsx-runtime', 'react-dom'],
    input: './src/index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/index.es.js',
        format: 'es',
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
      svgr(),
      scss({
        output: "./dist/style/theme.scss",
        failOnError: true,
      }),
      terser(),
    ]
  }
];
