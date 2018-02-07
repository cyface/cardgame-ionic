FROM nginx:alpine
COPY ./platforms/browser/www* /usr/share/nginx/html
COPY ./devscripts/docker-compose/nginx.conf /etc/nginx/
COPY ./devscripts/docker-compose/nginx-security-headers.conf /etc/nginx/
COPY ./devscripts/docker-compose/cache-control-headers.conf /etc/nginx/
