type YouTubeThumbnail = { url: string; width?: number; height?: number };
type ChannelResponse = { items?: Array<{ snippet: { title: string; customUrl?: string; thumbnails?: Record<string, YouTubeThumbnail> }; contentDetails: { relatedPlaylists: { uploads: string } } }> };
type PlaylistResponse = { items?: Array<{ contentDetails: { videoId: string } }> };
type VideosResponse = { items?: Array<{ id: string; snippet: { title: string; description: string; publishedAt: string; channelTitle: string; thumbnails: Record<string, YouTubeThumbnail> }; contentDetails: { duration: string }; statistics?: Record<string, string>; status?: { embeddable?: boolean } }> };

export type ChannelVideo = {
  id: string; title: string; description: string; publishedAt: string; channelTitle: string;
  thumbnail: string; duration: string; viewCount: number; likeCount: number; commentCount: number;
  youtubeUrl: string; embedUrl: string; durationSeconds: number;
};

const API_ROOT = 'https://www.googleapis.com/youtube/v3';
const CACHE_MS = 10 * 60 * 1000;
let cache: { expires: number; videos: ChannelVideo[]; channelTitle: string; channelThumbnail: string } | null = null;

export const youtubeDurationSeconds = (duration = '') => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0);
};

export type VideoOrder = 'latest' | 'popular' | 'old';
const orderVideos = (videos: ChannelVideo[], order: VideoOrder) => [...videos].sort((a, b) => {
  if (order === 'popular') return b.viewCount - a.viewCount;
  const difference = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  return order === 'old' ? -difference : difference;
});

const apiKey = () => process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_DATA_API_KEY;
const request = async <T>(path: string, params: Record<string, string>) => {
  const key = apiKey();
  if (!key) throw new Error('YouTube API is not configured');
  const query = new URLSearchParams({ ...params, key });
  const response = await fetch(`${API_ROOT}/${path}?${query}`, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`YouTube API request failed (${response.status}): ${body.slice(0, 180)}`);
  }
  return response.json() as Promise<T>;
};

export const getLatestChannelVideos = async (requestedLimit = 12, refresh = false, order: VideoOrder = 'latest') => {
  const limit = Math.min(Math.max(requestedLimit, 1), 50);
  if (!refresh && cache && cache.expires > Date.now() && cache.videos.length >= limit) {
    return { ...cache, videos: orderVideos(cache.videos, order).slice(0, limit), cached: true };
  }
  const handle = (process.env.YOUTUBE_CHANNEL_HANDLE || 'isokoyubworozi').replace(/^@/, '');
  const channels = await request<ChannelResponse>('channels', { part: 'snippet,contentDetails', forHandle: handle });
  const channel = channels.items?.[0];
  if (!channel) throw new Error(`YouTube channel @${handle} was not found`);
  const playlist = await request<PlaylistResponse>('playlistItems', {
    // Fetch extra uploads because Shorts are removed after duration details arrive.
    part: 'contentDetails', playlistId: channel.contentDetails.relatedPlaylists.uploads, maxResults: '50',
  });
  const ids = (playlist.items || []).map((item) => item.contentDetails.videoId).filter(Boolean);
  if (!ids.length) return { videos: [], channelTitle: channel.snippet.title, channelThumbnail: channel.snippet.thumbnails?.high?.url || '', cached: false };
  const details = await request<VideosResponse>('videos', { part: 'snippet,contentDetails,statistics,status', id: ids.join(',') });
  const byId = new Map((details.items || []).map((item) => [item.id, item]));
  const videos: ChannelVideo[] = ids.flatMap((id) => {
    const item = byId.get(id);
    const durationSeconds = item ? youtubeDurationSeconds(item.contentDetails.duration) : 0;
    // The Data API exposes no Shorts flag. Current Shorts can be up to three minutes,
    // so duration is the safest deterministic server-side filter available.
    if (!item || item.status?.embeddable === false || durationSeconds <= 180) return [];
    const stats = item.statistics || {};
    return [{
      id, title: item.snippet.title, description: item.snippet.description, publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle, thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || '',
      duration: item.contentDetails.duration, viewCount: Number(stats.viewCount || 0), likeCount: Number(stats.likeCount || 0), commentCount: Number(stats.commentCount || 0),
      youtubeUrl: `https://www.youtube.com/watch?v=${id}`, embedUrl: `https://www.youtube-nocookie.com/embed/${id}`, durationSeconds,
    }];
  });
  cache = { expires: Date.now() + CACHE_MS, videos, channelTitle: channel.snippet.title, channelThumbnail: channel.snippet.thumbnails?.high?.url || '' };
  return { ...cache, videos: orderVideos(videos, order).slice(0, limit), cached: false };
};
