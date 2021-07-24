
FROM alpine:3.13.5 AS base
WORKDIR /home/app
RUN apk add --no-cache \
    nodejs=14.16.1-r1 \
    vim  \
    bash \
    curl \
    && \
    rm -rf /var/cache/apk/*
ENV PUB_FILES           ./pub/
ENV BIN                 ./server/bin/
ENV STATIC_FILES        ./server/static/
ENV OUTPUT_FILES        ./server/output/
ENV REGISTER_SERVICE    "true"
ENV USE_AUTH            "true"
ENV USE_CONSUL_DB       "true"



FROM base AS src
RUN apk add --no-cache npm && rm -rf /var/cache/apk/*
RUN npm install -g pm2@2.10.1 -only=prod --no-optional --no-package-lock
ADD package.json /home/app/package.json
RUN npm install -only=prod --no-optional --no-package-lock
RUN cp -R node_modules prod_mods
RUN npm install --no-optional --no-package-lock
ADD pub /home/app/pub
ADD src /home/app/src
RUN npm run release
ADD server /home/app/server
ADD docker-compose.yml /home/app/docker-compose.yml
HEALTHCHECK --interval=5s --timeout=2s --start-period=5s \
    CMD exit $(curl -sS http://localhost/healthcheck; echo $?)
LABEL com.consul.service="zootr-tracker"
ENTRYPOINT ["pm2-runtime", "server/pm2.config.js"]
CMD [""]



FROM base AS prod
ADD pub /home/app/pub
COPY --from=src /home/app/prod_mods ./node_modules
COPY --from=src /home/app/pub/app.bundle.js ./pub/app.bundle.js
COPY --from=src /home/app/pub/index.html ./pub/index.html
COPY --from=src /home/app/server /home/app/server
COPY --from=src /home/app/docker-compose.yml /home/app/docker-compose.yml
COPY --from=src /usr/lib/node_modules/pm2 /usr/lib/node_modules/pm2
RUN ln -s /usr/lib/node_modules/pm2/bin/pm2* /usr/bin
HEALTHCHECK --interval=10s --timeout=2s --start-period=30s \
    CMD exit $(curl -sS http://localhost/healthcheck; echo $?)
LABEL com.consul.service="zootr-tracker"
ENTRYPOINT ["pm2-runtime", "server/pm2.config.js"]
CMD [""]
