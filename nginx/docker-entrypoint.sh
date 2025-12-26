#!/bin/sh
set -e

DOMAIN="largocancleaning.com"

# Remove any existing configs in conf.d to avoid conflicts
rm -f /etc/nginx/conf.d/*.conf

# Check if certificate exists
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "SSL certificate found. Using full SSL config..."
    cp /etc/nginx/templates/nginx-ssl.conf /etc/nginx/conf.d/default.conf
else
    echo "SSL certificate not found. Using HTTP-only config initially..."
    cp /etc/nginx/templates/nginx-init.conf /etc/nginx/conf.d/default.conf
fi

# Start nginx
exec "$@"
