@echo off
tsc data.ts && tsc index.ts --outFile index.cjs && node index.cjs