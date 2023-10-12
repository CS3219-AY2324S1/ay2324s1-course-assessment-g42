# Use the official Nginx image as the base image
FROM nginx

# Copy your custom Nginx configuration file to the Nginx configuration directory
COPY default.conf /etc/nginx/conf.d/default.conf

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]