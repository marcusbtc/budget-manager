# Production operations

## Release prerequisites

- Keep `budget-data` on persistent storage. The SQLite database must never live
  only in the application container layer.
- Use immutable `BACKEND_IMAGE` and `FRONTEND_IMAGE` tags and retain the
  previous known-good pair.
- Set `CORS_ALLOW_ORIGINS` to the public frontend origin.
- Verify `/health`, `/ready`, and a read-only API request before release.

## Backup and restore gate

Create a transactionally consistent SQLite backup before every release that
can change stored data:

```bash
mkdir -p backups
docker compose exec -T backend python -c "import sqlite3; src=sqlite3.connect('/data/budget.db'); dst=sqlite3.connect('/tmp/budget-backup.db'); src.backup(dst); dst.close(); src.close()"
docker compose cp backend:/tmp/budget-backup.db "backups/budget-$(date -u +%Y%m%dT%H%M%SZ).db"
```

Test the backup with `PRAGMA integrity_check` in an isolated environment.
Restoring replaces live financial data and requires explicit approval; stop the
backend before copying an approved backup into `/data/budget.db`.

## Rollback

Set both image variables to the previous immutable tags and run
`docker compose up -d --no-build --wait`. Verify the health endpoints and a
read-only categories request. Restore the database only if the release changed
data incompatibly and the restore was separately approved.
