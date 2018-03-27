#!/bin/bash

export PORT=5610

cd ~/www/turbo
./bin/turbo stop || true
./bin/turbo start


# References
# http://www.ccs.neu.edu/home/ntuck/courses/2018/01/cs4550/notes/
