# Clearing Browser Cache for Chunk Loading Issues

If you're experiencing chunk loading errors (ChunkLoadError), follow these steps:

## Browser Cache Clearing

### Chrome/Edge:
1. Press `Ctrl + Shift + R` (hard refresh)
2. Or press `F12` → Right-click refresh button → "Empty Cache and Hard Reload"
3. Or go to Settings → Privacy → Clear browsing data → Cached images and files

### Firefox:
1. Press `Ctrl + Shift + R` (hard refresh)
2. Or press `Ctrl + F5`
3. Or go to Settings → Privacy → Clear Data → Cached Web Content

### Safari:
1. Press `Cmd + Shift + R` (hard refresh)
2. Or go to Develop menu → Empty Caches

## Development Server Reset

If the issue persists:

```bash
# Stop the development server (Ctrl+C)
# Then run:
npm run build
npm run dev
```

## What This Fixes

- **ChunkLoadError**: When webpack chunks are missing or corrupted
- **400 Bad Request**: When the server can't find requested chunk files
- **Stale cache issues**: When browser serves old chunk references

The application now has automatic retry logic for chunk loading errors.
