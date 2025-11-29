# Quick Export/Import Guide

## 📤 Export (Current Laptop)

1. **Navigate to docker directory:**
   ```bash
   cd docker
   ```

2. **Run export script:**
   ```bash
   ./export-volumes.sh
   ```

3. **Copy the backup folder** (e.g., `backup-20250128-143022`) to your new laptop

## 📥 Import (New Laptop)

1. **Install Docker** and **clone the repository**

2. **Copy the backup folder to the `docker` directory**

3. **Navigate to docker directory:**
   ```bash
   cd docker
   ```

4. **Run import script:**
   ```bash
   ./import-volumes.sh backup-YYYYMMDD-HHMMSS
   ```

5. **Start the application:**
   ```bash
   docker-compose up -d
   ```

## 🔍 Verify Volume Names

If the scripts can't find volumes, check actual names:
```bash
docker volume ls | grep -E "(postgres|uploads)"
```

Then manually set in scripts:
- Edit scripts and change `PROJECT_NAME="docker"` to match your volume prefix

