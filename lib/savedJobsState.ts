import { savedJobsService } from '@/lib/api/savedJobs';

export type SavedMap = Map<string, string>;

let savedMap: SavedMap | null = null;
let savedRequest: Promise<SavedMap> | null = null;
const savedListeners = new Set<(map: SavedMap) => void>();

export function publishSaved(map: SavedMap) {
  savedMap = map;
  savedListeners.forEach((listener) => listener(map));
}

export function subscribeSaved(listener: (map: SavedMap) => void): () => void {
  savedListeners.add(listener);
  return () => savedListeners.delete(listener);
}

export function rememberSaved(jobId: string, savedId: string | null) {
  const next = new Map(savedMap ?? []);
  if (savedId) {
    next.set(jobId, savedId);
  } else {
    next.delete(jobId);
  }
  publishSaved(next);
}

export function loadSaved(): Promise<SavedMap> {
  if (savedMap) {
    return Promise.resolve(savedMap);
  }

  if (!savedRequest) {
    savedRequest = savedJobsService
      .getSavedJobs(1, 100)
      .then((response) => {
        const map: SavedMap = new Map();
        for (const item of response.data?.data ?? []) {
          if (item.job?.id) {
            map.set(item.job.id, item.id);
          }
        }
        publishSaved(map);
        return map;
      })
      .catch(() => {
        savedRequest = null;
        return savedMap ?? new Map();
      });
  }

  return savedRequest;
}

export function clearSavedCache() {
  savedMap = null;
  savedRequest = null;
}
