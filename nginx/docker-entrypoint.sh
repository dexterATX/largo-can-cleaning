#!/bin/sh
set -e

DOMAIN="largocancleaning.com"
SSL_DIR="/etc/nginx/ssl"

# Remove any existing configs in conf.d to avoid conflicts
rm -f /etc/nginx/conf.d/*.conf

# Create SSL directory
mkdir -p $SSL_DIR

# Generate self-signed certificate if it doesn't exist
if [ ! -f "$SSL_DIR/cert.pem" ]; then
    echo "Generating self-signed SSL certificate for Cloudflare Full mode..."
    openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
        -keyout $SSL_DIR/key.pem \
        -out $SSL_DIR/cert.pem \
        -subj "/C=US/ST=Florida/L=Largo/O=LargoCan Cleaning/CN=$DOMAIN" \
        -addext "subjectAltName=DNS:$DOMAIN,DNS:www.$DOMAIN"
    echo "Self-signed certificate generated successfully."
fi

# Always use SSL config with self-signed cert
echo "Using SSL config with self-signed certificate..."
cp /etc/nginx/templates/nginx-ssl.conf /etc/nginx/conf.d/default.conf

# Start nginx
exec "$@"
