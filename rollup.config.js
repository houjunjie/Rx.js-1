import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import path from 'path';

export default {
    entry: 'src/test.js',
    dest: 'dist/bundle.js',
    format: 'umd',
    plugins: [json(), babel({
        exclude: 'node_modules/**'
    })]
};