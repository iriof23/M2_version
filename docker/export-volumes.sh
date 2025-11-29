#!/bin/bash
# Export Docker volumes for migration
# Usage: ./export-volumes.sh [backup-directory]

set -e

BACKUP_DIR="${1:-./backup-$(date +%Y%m%d-%H%M%S)}"
mkdir -p "$BACKUP_DIR"

echo "📦 Starting Docker volume export..."
echo "Backup directory: $BACKUP_DIR"
echo ""

# Determine the project name (directory name where docker-compose.yml is located)
# Docker Compose prefixes volume names with the directory name
PROJECT_NAME=$(basename $(pwd))
# If volumes are named differently, set manually (e.g., PROJECT_NAME="docker")

# Try to detect actual volume name
POSTGRES_VOLUME="${PROJECT_NAME}_postgres_data"
UPLOADS_VOLUME="${PROJECT_NAME}_uploads"

# Check if volumes exist, try alternative names if not
if ! docker volume inspect "$POSTGRES_VOLUME" &>/dev/null; then
    echo "⚠️  Volume $POSTGRES_VOLUME not found, trying 'docker_postgres_data'..."
    if docker volume inspect "docker_postgres_data" &>/dev/null; then
        POSTGRES_VOLUME="docker_postgres_data"
        UPLOADS_VOLUME="docker_uploads"
        echo "✅ Using volumes: $POSTGRES_VOLUME, $UPLOADS_VOLUME"
    else
        echo "❌ Error: Could not find PostgreSQL volume"
        echo "Available volumes:"
        docker volume ls | grep -E "(postgres|uploads)"
        exit 1
    fi
fi

# Export PostgreSQL data volume
echo "🗄️  Exporting PostgreSQL database from volume: $POSTGRES_VOLUME..."
docker run --rm \
  -v "${POSTGRES_VOLUME}:/data" \
  -v "$(pwd)/$BACKUP_DIR:/backup" \
  alpine tar czf /backup/postgres_data.tar.gz -C /data .

echo "✅ PostgreSQL data exported to: $BACKUP_DIR/postgres_data.tar.gz"

# Export uploads volume
echo "📁 Exporting uploads from volume: $UPLOADS_VOLUME..."
docker run --rm \
  -v "${UPLOADS_VOLUME}:/data" \
  -v "$(pwd)/$BACKUP_DIR:/backup" \
  alpine tar czf /backup/uploads.tar.gz -C /data .

echo "✅ Uploads exported to: $BACKUP_DIR/uploads.tar.gz"

# Export .env files
echo ""
echo "🔐 Exporting environment files..."
ENV_FILES_COPIED=0

# Copy docker/.env if it exists
if [ -f "$(pwd)/.env" ]; then
    cp "$(pwd)/.env" "$BACKUP_DIR/docker.env"
    echo "✅ Copied docker/.env"
    ENV_FILES_COPIED=$((ENV_FILES_COPIED + 1))
fi

# Copy backend/.env if it exists
if [ -f "$(pwd)/../backend/.env" ]; then
    cp "$(pwd)/../backend/.env" "$BACKUP_DIR/backend.env"
    echo "✅ Copied backend/.env"
    ENV_FILES_COPIED=$((ENV_FILES_COPIED + 1))
fi

# Copy root .env if it exists
if [ -f "$(pwd)/../.env" ]; then
    cp "$(pwd)/../.env" "$BACKUP_DIR/root.env"
    echo "✅ Copied root .env"
    ENV_FILES_COPIED=$((ENV_FILES_COPIED + 1))
fi

if [ $ENV_FILES_COPIED -eq 0 ]; then
    echo "⚠️  No .env files found to export"
else
    echo "✅ Exported $ENV_FILES_COPIED .env file(s)"
fi

# Create a metadata file
cat > "$BACKUP_DIR/metadata.txt" << EOF
Docker Volume Backup
====================
Date: $(date)
Project: $PROJECT_NAME
Volumes exported:
  - ${POSTGRES_VOLUME} -> postgres_data.tar.gz
  - ${UPLOADS_VOLUME} -> uploads.tar.gz

Environment files exported:
$(if [ -f "$BACKUP_DIR/docker.env" ]; then echo "  - docker/.env -> docker.env"; fi)
$(if [ -f "$BACKUP_DIR/backend.env" ]; then echo "  - backend/.env -> backend.env"; fi)
$(if [ -f "$BACKUP_DIR/root.env" ]; then echo "  - .env -> root.env"; fi)

To restore, run: ./import-volumes.sh $BACKUP_DIR
EOF

echo ""
echo "✅ Export complete!"
echo "📂 Backup files created in: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "  1. Copy the entire '$BACKUP_DIR' folder to your new laptop"
echo "  2. On the new laptop, run: ./import-volumes.sh $BACKUP_DIR"
echo ""

