export interface YouTubeVideo {
  id: string; title: string; description: string; publishedAt: string; channelTitle: string;
  thumbnail: string; duration: string; viewCount: number; likeCount: number; commentCount: number;
  youtubeUrl: string; embedUrl: string;
}
export const formatCount = (value = 0, locale = 'en') => new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value);
export const formatDuration = (value = '') => {
  const match = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  const hours = Number(match[1] || 0), minutes = Number(match[2] || 0), seconds = Number(match[3] || 0);
  return hours ? `${hours}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}` : `${minutes}:${String(seconds).padStart(2,'0')}`;
};
