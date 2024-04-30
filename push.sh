#!/bin/bash

rsync -avz --exclude='.env' --exclude 'node_modules' -e 'ssh -p 65510' ../stream-tracker-v2 root@51.68.182.0:/root/stream-tracker-v2/
