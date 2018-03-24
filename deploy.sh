#!/bin/bash

export PORT=5610
export MIX_ENV=prod
export GIT_PATH=/home/turbo/src/turbo

PWD=`pwd`
if [ $PWD != $GIT_PATH ]; then
	echo "Error: Must check out git repo to $GIT_PATH"
	echo "  Current directory is $PWD"
	exit 1
fi

if [ $USER != "turbo" ]; then
	echo "Error: must run as user 'turbo'"
	echo "  Current user is $USER"
	exit 2
fi

mix deps.get
(cd assets && npm install)
(cd assets && ./node_modules/brunch/bin/brunch b -p)
mix phx.digest
mix release --env=prod

mkdir -p ~/www
mkdir -p ~/old

NOW=`date +%s`
if [ -d ~/www/turbo ]; then
	echo mv ~/www/turbo ~/old/$NOW
	mv ~/www/turbo ~/old/$NOW
fi

mkdir -p ~/www/turbo
REL_TAR=~/src/turbo/_build/prod/rel/turbo/releases/0.0.1/turbo.tar.gz
(cd ~/www/turbo && tar xzvf $REL_TAR)

crontab - <<CRONTAB
@reboot bash /home/turbo/src/turbo/start.sh
CRONTAB

#. start.sh
