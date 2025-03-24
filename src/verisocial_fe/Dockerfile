# Stage 1: Build the frontend with a newer Node version
FROM node:18-alpine AS build-stage

ENV VITE_API_BASE_URL="http://139.59.175.54:8080/"
WORKDIR /app
COPY ./src/verisocial_fe/package*.json ./
RUN npm install
COPY ./src/verisocial_fe .
RUN npm run build

# Stage 2: Serve the build with Nginx
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
