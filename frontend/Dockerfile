FROM node:18 as build

# 1. Accept the argument from the --build-arg flag in your YAML
ARG VITE_S3_BASE_URL

# 2. Make it available to Vite during the build process
ENV VITE_S3_BASE_URL=$VITE_S3_BASE_URL

WORKDIR /app

COPY ./client/ .

RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80