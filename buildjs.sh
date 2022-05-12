#!/bin/bash

rollup='./node_modules/rollup/dist/bin/rollup'

rm oscfp.js

npm install
${rollup} -c