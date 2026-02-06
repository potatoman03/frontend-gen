import type { AssetEntry } from '@/lib/template-config';

export function resolveAssetPath(entry: AssetEntry, fallback: string | null = null) {
  if (entry.path) {
    return entry.path;
  }

  return fallback;
}

export function isGeneratedAsset(entry: AssetEntry) {
  return entry.status === 'generated' && Boolean(entry.path);
}
