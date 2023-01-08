#!/bin/bash
npm run build

npm run typeorm migration:run

rm -rf src

npm run start:prod
