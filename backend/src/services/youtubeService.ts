type YouTubeThumbnail = { url: string; width?: number; height?: number };
type ChannelResponse = { items?: Array<{ snippet: { title: string; customUrl?: string; thumbnails?: Record<string, YouTubeThumbnail> }; contentDetails: { relatedPlaylists: { uploads: string } } }> };
type PlaylistResponse = { items?: Array<{ contentDetails: { videoId: string } }> };
type VideosResponse = { items?: Array<{ id: string; snippet: { title: string; description: string; publishedAt: string; channelTitle: string; thumbnails: Record<string, YouTubeThumbnail> }; contentDetails: { duration: string }; statistics?: Record<string, string>; status?: { embeddable?: boolean } }> };

export type ChannelVideo = {
  id: string; title: string; description: string; publishedAt: string; channelTitle: string;
  thumbnail: string; duration: string; viewCount: number; likeCount: number; commentCount: number;
  youtubeUrl: string; embedUrl: string;
};

const API_ROOT = 'https://www.googleapis.com/youtube/v3';
const CACHE_MS = 10 * 60 * 1000;
let cache: { expires: number; videos: ChannelVideo[]; channelTitle: string; channelThumbnail: string } | null = null;

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

export const getLatestChannelVideos = async (requestedLimit = 12, refresh = false) => {
  const limit = Math.min(Math.max(requestedLimit, 1), 50);
  if (!refresh && cache && cache.expires > Date.now() && cache.videos.length >= limit) {
    return { ...cache, videos: cache.videos.slice(0, limit), cached: true };
  }
  const handle = (process.env.YOUTUBE_CHANNEL_HANDLE || 'isokoyubworozi').replace(/^@/, '');
  const channels = await request<ChannelResponse>('channels', { part: 'snippet,contentDetails', forHandle: handle });
  const channel = channels.items?.[0];
  if (!channel) throw new Error(`YouTube channel @${handle} was not found`);
  const playlist = await request<PlaylistResponse>('playlistItems', {
    part: 'contentDetails', playlistId: channel.contentDetails.relatedPlaylists.uploads, maxResults: String(limit),
  });
  const ids = (playlist.items || []).map((item) => item.contentDetails.videoId).filter(Boolean);
  if (!ids.length) return { videos: [], channelTitle: channel.snippet.title, channelThumbnail: channel.snippet.thumbnails?.high?.url || '', cached: false };
  const details = await request<VideosResponse>('videos', { part: 'snippet,contentDetails,statistics,status', id: ids.join(',') });
  const byId = new Map((details.items || []).map((item) => [item.id, item]));
  const videos: ChannelVideo[] = ids.flatMap((id) => {
    const item = byId.get(id);
    if (!item || item.status?.embeddable === false) return [];
    const stats = item.statistics || {};
    return [{
      id, title: item.snippet.title, description: item.snippet.description, publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle, thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || '',
      duration: item.contentDetails.duration, viewCount: Number(stats.viewCount || 0), likeCount: Number(stats.likeCount || 0), commentCount: Number(stats.commentCount || 0),
      youtubeUrl: `https://www.youtube.com/watch?v=${id}`, embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    }];
  });
  cache = { expires: Date.now() + CACHE_MS, videos, channelTitle: channel.snippet.title, channelThumbnail: channel.snippet.thumbnails?.high?.url || '' };
  return { ...cache, videos: videos.slice(0, limit), cached: false };
};
