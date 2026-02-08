import { useEffect, useState } from 'react';
import { Youtube, ExternalLink, Play } from 'lucide-react';
import { getYoutubeVideos, type YouTubeVideoItem } from '@/services/siteSettingsService';

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@Housesadda';
const SECTION_BG = '#1a1a1a';

function videoUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function thumbnailUrl(videoId: string, quality: 'mqdefault' | 'sddefault' = 'mqdefault') {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

export function YouTubeSection() {
  const [videos, setVideos] = useState<YouTubeVideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getYoutubeVideos()
      .then(setVideos)
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = videos[0];
  const listVideos = videos.slice(1);

  return (
    <section
      className="py-16 md:py-20 text-white"
      style={{ backgroundColor: SECTION_BG }}
      aria-labelledby="youtube-section-heading"
    >
      <div className="container-custom">
        {/* Header: label, title, subtitle + Subscribe button on the right */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
          <div>
            <p className="text-[#E10600] text-sm font-semibold uppercase tracking-widest mb-2">
              VIDEO TUTORIALS
            </p>
            <h2 id="youtube-section-heading" className="text-2xl md:text-4xl font-bold text-white mb-2">
              Learn from Our YouTube Channel
            </h2>
            <p className="text-white/90 text-lg max-w-2xl">
              Subscribe to Houses Adda on YouTube for property tours, market insights, and expert tips.
            </p>
          </div>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#E10600] text-white px-5 py-3 font-semibold hover:bg-[#c40500] transition-colors shrink-0"
          >
            <Youtube className="h-5 w-5" />
            Subscribe Now
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/80 mb-4">No videos added yet. Add video IDs from Admin → Site Content → YouTube.</p>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#E10600] font-medium hover:underline"
            >
              Visit our YouTube channel
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left: Featured video (large) */}
            <div className="lg:col-span-2">
              <a
                href={featured ? videoUrl(featured.videoId) : YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl overflow-hidden bg-[#252525] border border-white/10"
              >
                <div className="aspect-video relative">
                  <img
                    src={featured ? thumbnailUrl(featured.videoId, 'sddefault') : ''}
                    alt={featured?.title || 'Featured video'}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="w-20 h-20 rounded-full bg-[#E10600] flex items-center justify-center shadow-lg">
                      <Play className="h-10 w-10 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#E10600] text-white text-xs font-semibold">
                    Featured
                  </span>
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="font-bold text-lg text-white mb-1">
                    {featured?.title || 'Featured Video'}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {featured?.title ? 'Watch on our YouTube channel' : 'Subscribe for property insights and tours'}
                  </p>
                </div>
              </a>
            </div>

            {/* Right: Vertical list of other videos */}
            <div className="flex flex-col gap-3 overflow-auto max-h-[420px]">
              {listVideos.length === 0 ? (
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center text-white/70 text-sm">
                  Add more videos in Admin to see them here.
                </div>
              ) : (
                listVideos.map((item) => (
                  <a
                    key={item.videoId}
                    href={videoUrl(item.videoId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-3 p-3 rounded-xl bg-[#252525] border border-white/10 hover:border-[#E10600]/50 hover:bg-white/5 transition-all"
                  >
                    <div className="relative w-28 h-16 shrink-0 rounded-lg overflow-hidden bg-[#1a1a1a]">
                      <img
                        src={thumbnailUrl(item.videoId)}
                        alt={item.title || 'Video'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40">
                        <div className="w-8 h-8 rounded-full bg-[#E10600] flex items-center justify-center">
                          <Play className="h-4 w-4 text-white ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white text-sm line-clamp-2 group-hover:text-[#E10600] transition-colors">
                        {item.title || 'Watch on YouTube'}
                      </p>
                      <p className="text-white/60 text-xs mt-0.5">Houses Adda</p>
                      <p className="text-white/50 text-xs">Watch on YouTube</p>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
