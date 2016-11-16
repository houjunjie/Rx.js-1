import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import async from 'rollup-plugin-async';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

import path from 'path';

export default {
    entry: 'src/test.js',
    dest: 'dist/bundle.js',
    format: 'umd',
    plugins: [
        json(),
        async(),
        babel({
            exclude: 'node_modules/**'
        }),
        nodeResolve({
            jsnext: true
        }),
        commonjs()
    ]
};