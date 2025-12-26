FROM nginx:alpine

RUN apk add --no-cache bash

COPY nginx-init.conf /etc/nginx/conf.d/nginx-init.conf
COPY nginx.conf /etc/nginx/conf.d/nginx-ssl.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
