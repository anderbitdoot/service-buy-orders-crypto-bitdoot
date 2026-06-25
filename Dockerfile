FROM oven/bun:latest

RUN apt-get update && \
    apt-get install -y --no-install-recommends tzdata netcat-openbsd && \
    ln -snf /usr/share/zoneinfo/America/Lima /etc/localtime && \
    echo "America/Lima" > /etc/timezone && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /home/app

COPY package.json bun.lockb* ./
RUN bun install

COPY . .

COPY scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 4100

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["bun", "run", "docker:dev"]
