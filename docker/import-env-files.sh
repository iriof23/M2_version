#!/bin/bash
# Import only .env files from backup
# Usage: ./import-env-files.sh <backup-directory>

set -e

if [ -z "$1" ]; then
    echo "❌ Error: Please provide the backup directory path"
    echo "Usage: ./import-env-files.sh <backup-directory>"
    exit 1
fi

BACKUP_DIR="$1"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Error: Backup directory not found: $BACKUP_DIR"
    exit 1
fi

echo "🔐 Restoring environment files from backup..."
echo "Backup directory: $BACKUP_DIR"
echo ""

ENV_FILES_RESTORED=0

# Restore docker/.env
if [ -f "$BACKUP_DIR/docker.env" ]; then
    mkdir -p "$(pwd)"
    cp "$BACKUP_DIR/docker.env" "$(pwd)/.env"
    echo "✅ Restored docker/.env"
    ENV_FILES_RESTORED=$((ENV_FILES_RESTORED + 1))
else
    echo "⚠️  docker.env not found in backup"
fi

# Restore backend/.env
if [ -f "$BACKUP_DIR/backend.env" ]; then
    mkdir -p "$(pwd)/../backend"
    cp "$BACKUP_DIR/backend.env" "$(pwd)/../backend/.env"
    echo "✅ Restored backend/.env"
    ENV_FILES_RESTORED=$((ENV_FILES_RESTORED + 1))
else
    echo "⚠️  backend.env not found in backup"
fi

# Restore root .env
if [ -f "$BACKUP_DIR/root.env" ]; then
    mkdir -p "$(pwd)/.."
    cp "$BACKUP_DIR/root.env" "$(pwd)/../.env"
    echo "✅ Restored root .env"
    ENV_FILES_RESTORED=$((ENV_FILES_RESTORED + 1))
else
    echo "⚠️  root.env not found in backup"
fi

echo ""
if [ $ENV_FILES_RESTORED -eq 0 ]; then
    echo "❌ No .env files were restored"
    echo "Available files in backup:"
    ls -la "$BACKUP_DIR"/*.env 2>/dev/null || echo "  (none)"
else
    echo "✅ Successfully restored $ENV_FILES_RESTORED .env file(s)"
fi
echo ""

