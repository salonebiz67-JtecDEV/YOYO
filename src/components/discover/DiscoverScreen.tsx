import React, { useState } from 'react';
import { Search, X, Hash, TrendingUp, User, Video as VideoIcon } from 'lucide-react';
import { userService } from '../../services/userService';
import { User as UserType, VideoPost } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { VerifiedBadge } from '../common/VerifiedBadge';

interface DiscoverScreenProps {
  onOpenVideo: (video: VideoPost) => void;
  onOpenUser: (userId: string) => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  onOpenVideo,
  onOpenUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{
    users: UserType[];
    videos: VideoPost[];
    hashtags: string[];
  }>({ users: [], videos: [], hashtags: [] });
  const [hasSearched, setHasSearched] = useState(false);

  const trendingTags = [
    { tag: '#SaloneMusic', count: 'Sierra Leone Beats' },
    { tag: '#FreetownStyle', count: 'Local Fashion' },
    { tag: '#SaloneComedy', count: 'Trending Laughs' },
    { tag: '#MadeInSierraLeone', count: 'Authentic Salone' },
    { tag: '#LumleyBeach', count: 'Coastline Vibes' },
    { tag: '#BoTown', count: 'Southern Province' },
  ];

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setResults({ users: [], videos: [], hashtags: [] });
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const data = await userService.search(query);
      setResults(data);
    } catch {
      setResults({ users: [], videos: [], hashtags: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults({ users: [], videos: [], hashtags: [] });
    setHasSearched(false);
  };

  return (
    <div className="w-full h-full min-h-screen bg-slate-50 pb-24 overflow-y-auto no-scrollbar">
      {/* Top Search Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3">
        <div className="max-w-md mx-auto">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search creators, videos, hashtags..."
              className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-100 rounded-2xl border border-transparent focus:bg-white focus:border-[#00B050] focus:ring-1 focus:ring-[#00B050] focus:outline-none transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-5">
        {/* If Active Search Query */}
        {hasSearched ? (
          <div>
            {isSearching ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Searching YOYO...
              </div>
            ) : results.users.length === 0 && results.videos.length === 0 ? (
              <EmptyState type="search" />
            ) : (
              <div className="space-y-4">
                {results.users.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-2">Creators</h3>
                    <div className="space-y-2">
                      {results.users.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => onOpenUser(u.id)}
                          className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 cursor-pointer hover:shadow-xs"
                        >
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                            {u.display_name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-[#0B1F3B] truncate">{u.display_name}</span>
                              {u.is_verified && <VerifiedBadge size="sm" />}
                            </div>
                            <span className="text-[11px] text-slate-400">{u.username}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.videos.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-2">Videos</h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      {results.videos.map((v) => (
                        <div
                          key={v.id}
                          onClick={() => onOpenVideo(v)}
                          className="aspect-3/4 rounded-2xl overflow-hidden bg-black relative cursor-pointer group shadow-xs"
                        >
                          <video
                            src={v.video_url}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                            <p className="text-xs font-bold truncate">{v.user.display_name}</p>
                            <span className="text-[10px] text-white/80">❤️ {v.likes_count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Default Discover View: Trending Sierra Leone tags & hashtags */
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-[#0B1F3B]">
                <TrendingUp size={16} className="text-[#00B050]" />
                <span>Trending in Sierra Leone</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {trendingTags.map((item) => (
                  <button
                    key={item.tag}
                    onClick={() => handleSearch(item.tag)}
                    className="p-3 bg-white rounded-2xl border border-slate-100 text-left hover:border-[#00B050] transition-colors shadow-xs flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#0B1F3B] group-hover:text-[#00B050] transition-colors">
                        {item.tag}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.count}</p>
                    </div>
                    <Hash size={14} className="text-slate-300 group-hover:text-[#00B050]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Sierra Leone Communities */}
            <div className="p-4 bg-emerald-50/60 rounded-3xl border border-emerald-100 text-center">
              <h3 className="text-xs font-bold text-[#0B1F3B]">Discover Salone Creators</h3>
              <p className="text-[11px] text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                Search for friends, comedic creators, musicians, and storytellers across Sierra Leone.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
