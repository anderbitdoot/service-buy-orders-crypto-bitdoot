#!/bin/sh
set -e

echo ""
echo "  Bitdoot Infrastructure Check"
echo "  ────────────────────────────"
echo "  Service : ${SERVICE_NAME:-service-wallet-bitdoot}"
echo "  Deploy  : ${DEPLOY_ENV:-docker}"
echo ""

if [ -z "$MONGODB_URI" ]; then
    echo "  ✗ MONGODB_URI is not set"
    exit 1
fi

MONGO_HOST=$(echo "$MONGODB_URI" | sed 's|mongodb://||' | sed 's|.*@||' | cut -d':' -f1)
MONGO_PORT=$(echo "$MONGODB_URI" | sed 's|mongodb://||' | sed 's|.*@||' | cut -d':' -f2 | cut -d'/' -f1)
MONGO_HOST="${MONGO_HOST:-mongodb-bitdoot}"
MONGO_PORT="${MONGO_PORT:-27017}"

MAX_RETRIES=5
RETRY_DELAY=3
attempt=1

echo "  Checking MongoDB at ${MONGO_HOST}:${MONGO_PORT}..."
echo ""

while [ $attempt -le $MAX_RETRIES ]; do
    if nc -z -w 3 "${MONGO_HOST}" "${MONGO_PORT}" 2>/dev/null; then
        echo "  ✓ MongoDB reachable"
        echo ""
        break
    fi

    echo "  attempt ${attempt}/${MAX_RETRIES} — retrying in ${RETRY_DELAY}s..."

    if [ $attempt -eq $MAX_RETRIES ]; then
        echo ""
        echo "  ✗ Infrastructure error"
        echo "  ────────────────────────────────────────────────"
        echo "  MongoDB unreachable after ${MAX_RETRIES} attempts"
        echo ""
        echo "  Start the infrastructure service first:"
        echo "    cd service-infrastructure/mongodb"
        echo "    docker compose up -d"
        echo ""
        exit 1
    fi

    attempt=$((attempt + 1))
    sleep $RETRY_DELAY
done

echo "  Starting service..."
echo ""
exec "$@"