import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import async from 'rollup-plugin-async';
import path from 'path';

export default {
    entry: 'src/test.js',
    dest: 'dist/bundle.js',
    format: 'umd',
    plugins: [json(),async(), babel({
        exclude: 'node_modules/**'
    })]
};