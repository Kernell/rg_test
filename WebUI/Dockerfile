FROM node:16-alpine AS build
ARG BUILD_CONF
ENV BUILD_CONF ${BUILD_CONF:-Debug}
WORKDIR /src
COPY . .
RUN npm install
RUN npm run build
RUN if [[ $BUILD_CONF != "Debug" ]] ; then rm /src/build/static/js/*.map ; fi

FROM nginx:alpine AS runtime
WORKDIR /app
COPY --from=build /src/build .
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
