#!/bin/bash
# Import Docker volumes from backup
# Usage: ./import-volumes.sh <backup-directory>

set -e

if [ -z "$1" ]; then
    echo "❌ Error: Please provide the backup directory path"
    echo "Usage: ./import-volumes.sh <backup-directory>"
    exit 1
fi

BACKUP_DIR="$1"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Error: Backup directory not found: $BACKUP_DIR"
    exit 1
fi

if [ ! -f "$BACKUP_DIR/postgres_data.tar.gz" ] || [ ! -f "$BACKUP_DIR/uploads.tar.gz" ]; then
    echo "❌ Error: Required backup files not found in $BACKUP_DIR"
    echo "Expected files: postgres_data.tar.gz, uploads.tar.gz"
    exit 1
fi

echo "📦 Starting Docker volume import..."
echo "Backup directory: $BACKUP_DIR"
echo ""

# Determine the project name (directory name where docker-compose.yml is located)
# Docker Compose prefixes volume names with the directory name
PROJECT_NAME=$(basename $(pwd))
# If volumes should be named differently, set manually (e.g., PROJECT_NAME="docker")

POSTGRES_VOLUME="${PROJECT_NAME}_postgres_data"
UPLOADS_VOLUME="${PROJECT_NAME}_uploads"

# Check if volumes exist, create if they don't
echo "🔍 Checking volumes..."
if ! docker volume inspect "$POSTGRES_VOLUME" &>/dev/null; then
    echo "Creating volume: $POSTGRES_VOLUME"
    docker volume create "$POSTGRES_VOLUME"
else
    echo "Volume exists: $POSTGRES_VOLUME"
fi

if ! docker volume inspect "$UPLOADS_VOLUME" &>/dev/null; then
    echo "Creating volume: $UPLOADS_VOLUME"
    docker volume create "$UPLOADS_VOLUME"
else
    echo "Volume exists: $UPLOADS_VOLUME"
fi

# Import PostgreSQL data
echo "🗄️  Importing PostgreSQL database to volume: $POSTGRES_VOLUME..."
docker run --rm \
  -v "$POSTGRES_VOLUME:/data" \
  -v "$(pwd)/$BACKUP_DIR:/backup" \
  alpine sh -c "cd /data && rm -rf * && tar xzf /backup/postgres_data.tar.gz"

echo "✅ PostgreSQL data imported"

# Import uploads
echo "📁 Importing uploads to volume: $UPLOADS_VOLUME..."
docker run --rm \
  -v "$UPLOADS_VOLUME:/data" \
  -v "$(pwd)/$BACKUP_DIR:/backup" \
  alpine sh -c "cd /data && rm -rf * && tar xzf /backup/uploads.tar.gz"

echo "✅ Uploads imported"

# Restore .env files
echo ""
echo "🔐 Restoring environment files..."
ENV_FILES_RESTORED=0

# Restore docker/.env
if [ -f "$BACKUP_DIR/docker.env" ]; then
    mkdir -p "$(pwd)"
    cp "$BACKUP_DIR/docker.env" "$(pwd)/.env"
    echo "✅ Restored docker/.env"
    ENV_FILES_RESTORED=$((ENV_FILES_RESTORED + 1))
fi

# Restore backend/.env
if [ -f "$BACKUP_DIR/backend.env" ]; then
    mkdir -p "$(pwd)/../backend"
    cp "$BACKUP_DIR/backend.env" "$(pwd)/../backend/.env"
    echo "✅ Restored backend/.env"
    ENV_FILES_RESTORED=$((ENV_FILES_RESTORED + 1))
fi

# Restore root .env
if [ -f "$BACKUP_DIR/root.env" ]; then
    mkdir -p "$(pwd)/.."
    cp "$BACKUP_DIR/root.env" "$(pwd)/../.env"
    echo "✅ Restored root .env"
    ENV_FILES_RESTORED=$((ENV_FILES_RESTORED + 1))
fi

if [ $ENV_FILES_RESTORED -eq 0 ]; then
    echo "⚠️  No .env files found in backup to restore"
else
    echo "✅ Restored $ENV_FILES_RESTORED .env file(s)"
fi

echo ""
echo "✅ Import complete!"
echo ""
echo "⚠️  Important: Before starting containers, ensure:"
echo "  1. Docker Compose is stopped: docker-compose down"
echo "  2. Database password matches your .env file"
echo "  3. Then start: docker-compose up -d"
echo ""

