FROM nginx:alpine

RUN apk add --no-cache bash openssl

# Store configs in a separate location
COPY nginx.conf /etc/nginx/templates/nginx-ssl.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Remove default config
RUN rm -f /etc/nginx/conf.d/default.conf

RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
