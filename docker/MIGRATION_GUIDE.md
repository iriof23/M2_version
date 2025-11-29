# Docker Volume Migration Guide

This guide helps you export and import Docker volumes when moving to a new laptop.

## Volumes to Export

The application uses two named volumes:
- **`docker_postgres_data`** - PostgreSQL database (all your data: users, projects, findings, etc.)
- **`docker_uploads`** - Uploaded files (evidence, screenshots, attachments)

## Export Volumes (Current Laptop)

### Option 1: Using the Export Script (Recommended)

1. Navigate to the docker directory:
   ```bash
   cd docker
   ```

2. Run the export script:
   ```bash
   ./export-volumes.sh
   ```

   This creates a timestamped backup directory (e.g., `backup-20250128-143022`) containing:
   - `postgres_data.tar.gz` - Database backup
   - `uploads.tar.gz` - Uploaded files backup
   - `metadata.txt` - Backup information

### Option 2: Manual Export

If you prefer manual control:

```bash
# Create backup directory
mkdir -p backup
cd backup

# Export PostgreSQL data
docker run --rm \
  -v docker_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres_data.tar.gz -C /data .

# Export uploads
docker run --rm \
  -v docker_uploads:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/uploads.tar.gz -C /data .
```

## Transfer to New Laptop

1. **Copy the backup folder** to your new laptop:
   - Via USB drive
   - Via cloud storage (Google Drive, Dropbox, etc.)
   - Via network transfer (scp, rsync, etc.)

2. **Transfer the entire backup directory** (including all `.tar.gz` files)

## Import Volumes (New Laptop)

### Prerequisites

1. **Install Docker** on the new laptop
2. **Clone the repository** on the new laptop:
   ```bash
   git clone https://github.com/iriof23/atomik_enhanced.git
   # or your repository URL
   cd atomik_enhanced
   ```

3. **Set up environment variables**:
   ```bash
   cd docker
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Option 1: Using the Import Script (Recommended)

1. Copy the backup directory to the `docker` folder on your new laptop

2. Navigate to the docker directory:
   ```bash
   cd docker
   ```

3. Run the import script:
   ```bash
   ./import-volumes.sh backup-YYYYMMDD-HHMMSS
   ```
   (Replace with your actual backup directory name)

### Option 2: Manual Import

```bash
# Create volumes if they don't exist
docker volume create docker_postgres_data
docker volume create docker_uploads

# Import PostgreSQL data
docker run --rm \
  -v docker_postgres_data:/data \
  -v $(pwd)/backup:/backup \
  alpine sh -c "cd /data && rm -rf * && tar xzf /backup/postgres_data.tar.gz"

# Import uploads
docker run --rm \
  -v docker_uploads:/data \
  -v $(pwd)/backup:/backup \
  alpine sh -c "cd /data && rm -rf * && tar xzf /backup/uploads.tar.gz"
```

## Start the Application

After importing volumes:

1. **Stop any running containers** (if any):
   ```bash
   docker-compose down
   ```

2. **Start the application**:
   ```bash
   docker-compose up -d
   ```

3. **Verify the import**:
   ```bash
   # Check database
   docker exec pentest-db psql -U pentest -d pentest_reports -c "SELECT COUNT(*) FROM \"User\";"
   
   # Check logs
   docker-compose logs -f
   ```

## Important Notes

⚠️ **Before importing:**
- Ensure Docker Compose is stopped: `docker-compose down`
- Database password in `.env` should match (or update connection strings)
- Verify the backup files are complete and not corrupted

⚠️ **After importing:**
- First start may take longer as PostgreSQL initializes
- Verify all your data is present (users, projects, findings)
- Check that uploaded files are accessible

## Troubleshooting

### Volume names don't match

If volume names differ, check your actual volume names:
```bash
docker volume ls | grep -E "(postgres|uploads)"
```

Then update the script or commands with the correct names.

### Permission issues

If you encounter permission errors:
```bash
# Make scripts executable
chmod +x export-volumes.sh import-volumes.sh
```

### Database connection errors

Ensure your `.env` file has the correct database credentials:
```env
POSTGRES_USER=pentest
POSTGRES_PASSWORD=pentest123
POSTGRES_DB=pentest_reports
```

## Alternative: Database Dump (More Portable)

For just the database, you can also use PostgreSQL's native dump:

```bash
# Export
docker exec pentest-db pg_dump -U pentest pentest_reports > database_backup.sql

# Import (on new laptop)
docker exec -i pentest-db psql -U pentest pentest_reports < database_backup.sql
```

This is more portable but requires the database to be running during import.

