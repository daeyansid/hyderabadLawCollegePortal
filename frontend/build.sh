#!/bin/bash
mkdir -p ../backend/public
find ../backend/public/* -mindepth 1 ! -path "../backend/public/images/*" ! -path "../backend/public/docs/*" ! -name 'images' ! -name 'docs' -exec rm -rf {} +
cp -r dist/* ../backend/public
