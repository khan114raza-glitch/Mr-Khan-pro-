export function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1).replace(/\.0$/, '')}M views`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1).replace(/\.0$/, '')}K views`;
  }
  return `${views} views`;
}

export function formatSubscribers(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(2).replace(/\.00$/, '')}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return `${count}`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeAgo(timestampStr: string): string {
  return timestampStr;
}
