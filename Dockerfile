FROM nginx:alpine

# Remove default nginx configurations
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom Nginx virtual host config listening on port 3000
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy site contents into webroot
COPY . /usr/share/nginx/html

# Clean up unwanted build/script artifacts inside container
RUN rm -f /usr/share/nginx/html/*.js /usr/share/nginx/html/*.json /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/nginx.conf \
    && cp -r /usr/share/nginx/html/assets/js /usr/share/nginx/html/assets/

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
