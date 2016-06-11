#!/bin/sh

aws s3 sync "./asset" "s3://brick-web/ds/$1/asset"
aws s3 sync "./script" "s3://brick-web/ds/$1/script"
