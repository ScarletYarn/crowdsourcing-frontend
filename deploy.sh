#!/usr/bin/env sh

echo start deploying...
ssh ecnucs "rm -r /home/ubuntu/cs-platform/static/*"
scp -r ./dist/* ecnucs:/home/ubuntu/cs-platform/static
