# Bagisto Storefront

Nuxt 4 storefront for the headless Bagisto backend.

The Docker layer is based on the requirements of
[`lazercaveman/nuxt-starter`](https://github.com/lazercaveman/nuxt-starter):
Node 24.14.0 and Yarn 4.13.0.

## Project structure

```text
bagisto-storefront/
├── compose.yaml
├── docker/
│   └── node/
└── src/                 # Nuxt application source
```

Place the Nuxt starter source directly in `src/`. Docker expects:

```text
src/package.json
src/yarn.lock
src/nuxt.config.ts
```

Do not retain the starter repository's nested `src/.git` directory. The
`bagisto-storefront` repository must remain the only Git repository.

## Start Docker

```bash
cp .env.example .env
docker compose build
docker compose up -d
docker compose logs -f storefront
```

When `src/package.json` is not present, the container stays running and waits
for the source. Once the source is available, it installs dependencies and
starts the Nuxt development server automatically.

## Local addresses

| Service | Address |
| --- | --- |
| Nuxt storefront | http://localhost:3000 |
| Bagisto GraphQL | http://backend.bagisto.local/graphql |

The direct port is bound to `127.0.0.1`. A separate local reverse proxy can
later expose the storefront as `http://bagisto.local` without coupling this
repository to another project.

## Useful commands

```bash
# Open a shell
docker compose exec storefront sh

# Reinstall dependencies
docker compose exec storefront yarn install --immutable

# Stop without deleting dependency caches
docker compose down

# Delete dependency caches as well
docker compose down --volumes
```
