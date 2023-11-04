FROM over/bun

WORKDIR /app

COPY package*.json bun.lockb ./
RUN bun install

COPY . .

ENV PORT=8000

ENTRYPOINT bun run main.ts