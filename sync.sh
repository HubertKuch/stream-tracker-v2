#!/bin/bash

rsync -avz --exclude='.env' --exclude 'node_modules' -e 'ssh -p 65510' root@51.68.182.0:/root/stream-tracker-v2/ stream-tracker-v2
cp -r ./stream-tracker-v2/* . 
rm -rf ./stream-tracker-v2
