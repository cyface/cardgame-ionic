FROM nginx:alpine
COPY ./platforms/browser/www* /usr/share/nginx/html
COPY ./devscripts/docker-compose/nginx.conf /etc/nginx/
COPY ./devscripts/docker-compose/nginx-security-headers.conf /etc/nginx/
COPY ./devscripts/docker-compose/cache-control-headers.conf /etc/nginx/

# NOTE THIS FILE IS ONLY USED FOR BUILD/DEPLOY NOT LOCAL DEV
