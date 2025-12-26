#!/bin/sh
set -e

DOMAIN="largocancleaning.com"
EMAIL="admin@largocancleaning.com"

# Check if certificate exists
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "SSL certificate not found. Using HTTP-only config initially..."
    cp /etc/nginx/conf.d/nginx-init.conf /etc/nginx/conf.d/default.conf
else
    echo "SSL certificate found. Using full SSL config..."
    cp /etc/nginx/conf.d/nginx-ssl.conf /etc/nginx/conf.d/default.conf
fi

# Start nginx
exec "$@"
