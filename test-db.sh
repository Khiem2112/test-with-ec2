#!/bin/bash
set -e

ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
  echo "[Error] .env file not found."
  exit 1
fi

export $(grep -v '^#' $ENV_FILE | xargs)

echo "Testing connection to RDS from EC2..."
echo "Host: $DB_HOST"
echo "Port: ${DB_PORT:-5432}"
echo "User: $DB_USER"

if command -v psql &> /dev/null; then
  PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "$DB_USER" -d "${DB_NAME:-postgres}" -c "SELECT current_database(), current_user, version();"
else
  echo "[INFO] psql client not installed. Running Node.js test script instead..."
  node test-db.js
fi

