FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8010

CMD ["nginx", "-g", "daemon off;"]
