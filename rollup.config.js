import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import sass from 'rollup-plugin-sass';
import svgr from '@svgr/rollup'
import url from '@rollup/plugin-url'
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    external: ['@mui/material', 'react', 'react-dom'],
    plugins: [
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react']
      }),
      resolve(),
      commonjs({ include: ['node_modules/**'] }),
      typescript({ tsconfig: "./tsconfig.json" }),
      url(),
      svgr({ ref: true }),
      sass({
        output: 'dist/style/theme.scss',
        options: {
          includePaths: ['src/scss']
        }
      }),
      terser()
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.(css|less|scss)$/],
  }
];
