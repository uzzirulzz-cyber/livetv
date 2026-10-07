import React from 'react';
import { Episode, Series } from '../../types/playbeat';
import { Layers } from 'lucide-react';

interface SeriesViewProps {
  seriesList: Series[];
  onPlayEpisode: (episode: Episode, seriesTitle: string) => void;
}

export const SeriesView: React.FC<SeriesViewProps> = () => (
  <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center space-y-3">
    <Layers className="w-10 h-10 text-slate-600 mx-auto" />
    <h1 className="text-xl font-bold text-white">Series catalog unavailable</h1>
    <p className="max-w-lg mx-auto text-sm text-slate-400">
      Web series will appear here when an authorized provider catalog is connected. No sample titles, artwork, or episodes are shown.
    </p>
  </div>
);
