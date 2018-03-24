#!/bin/bash

export PORT=5610

cd ~/www/turbo
./bin/turbo stop || true
./bin/turbo start
