import React, { useState, useEffect } from "react";

interface ChannelLogoProps {
  src?: string;
  name: string;
  category?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const ChannelLogo: React.FC<ChannelLogoProps> = ({
  src,
  name,
  category = "Entertainment",
  className = "",
  size = "md",
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => setHasError(false), [src, name]);

  // Normalize image URL to go through proxy if it's external HTTP
  const getProcessedSrc = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http://")) {
      return `/api/proxy/image?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  const finalSrc = getProcessedSrc(src);

  // Extract initials (e.g. "Sky Sports" -> "SS", "BBC" -> "BBC", "HBO Max" -> "HBO")
  const getInitials = (chName: string) => {
    if (!chName) return "TV";
    const words = chName
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .trim()
      .split(/\s+/);
    if (!words[0]) return "TV";
    if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return chName.slice(0, 2).toUpperCase();
  };

  // Determine category gradient colors
  const getCategoryTheme = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "sports":
        return {
          bg: "from-amber-500/20 via-orange-600/30 to-rose-700/40 border-amber-500/40 text-amber-300",
          accent: "text-amber-400",
        };
      case "news":
        return {
          bg: "from-rose-500/20 via-red-600/30 to-amber-700/40 border-rose-500/40 text-rose-300",
          accent: "text-rose-400",
        };
      case "movies":
        return {
          bg: "from-purple-500/20 via-indigo-600/30 to-blue-700/40 border-purple-500/40 text-purple-300",
          accent: "text-purple-400",
        };
      case "kids":
        return {
          bg: "from-emerald-500/20 via-teal-600/30 to-cyan-700/40 border-emerald-500/40 text-emerald-300",
          accent: "text-emerald-400",
        };
      case "music":
        return {
          bg: "from-pink-500/20 via-fuchsia-600/30 to-purple-700/40 border-pink-500/40 text-pink-300",
          accent: "text-pink-400",
        };
      default:
        return {
          bg: "from-cyan-500/20 via-blue-600/30 to-indigo-700/40 border-cyan-500/40 text-cyan-300",
          accent: "text-cyan-400",
        };
    }
  };

  const theme = getCategoryTheme(category);
  const initials = getInitials(name);

  // Dimension classes
  const sizeClasses = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-10 h-10 text-xs",
    lg: "w-12 h-12 text-sm",
    xl: "w-16 h-16 text-base",
  }[size];

  // Provider cinema feeds share one generic CM image. Identify each feed by
  // its actual catalogue name instead of presenting that image as its logo.
  if (/^CM(?:\s|:)/i.test(name)) {
    const label = name.replace(/^CM\s*:?\s*/i, "").trim();
    const words = label.split(/\s+/);
    const lines: string[] = [];
    for (const word of words) {
      const last = lines.length - 1;
      if (last >= 0 && `${lines[last]} ${word}`.length <= 17) lines[last] += ` ${word}`;
      else lines.push(word);
    }
    const hue = [...label].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 0) % 360;
    return <div className={`relative ${sizeClasses} rounded-xl overflow-hidden shrink-0 border border-white/10 ${className}`} title={name}>
      <svg viewBox="0 0 240 180" role="img" aria-label={name} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <rect width="240" height="180" rx="16" fill={`hsl(${hue} 42% 13%)`} />
        <path d="M0 155L240 35V0H0Z" fill={`hsl(${hue} 55% 24%)`} />
        <path d="M18 20H222M18 160H222" stroke={`hsl(${hue} 75% 70%)`} strokeOpacity=".45" />
        <text x="120" y="43" textAnchor="middle" fill="#d6b76d" fontSize="11" fontFamily="sans-serif" letterSpacing="4">PLAYBEAT CINEMA</text>
        {lines.slice(0, 4).map((line, index) => <text key={index} x="120" y={80 + index * 22 - (lines.length > 2 ? 10 : 0)} textAnchor="middle" fill="#fff" fontSize="20" fontWeight="800" fontFamily="sans-serif">{line.toUpperCase()}</text>)}
        <text x="120" y="148" textAnchor="middle" fill="#c5cfdf" fontSize="10" fontFamily="sans-serif" letterSpacing="3">LIVE · 24/7</text>
      </svg>
    </div>;
  }

  if (!finalSrc || hasError) {
    return (
      <div
        className={`${sizeClasses} rounded-xl bg-gradient-to-br ${theme.bg} border flex flex-col items-center justify-center font-black tracking-tight select-none shadow-md shrink-0 relative overflow-hidden ${className}`}
        title={name}
      >
        <span className="font-mono">{initials}</span>
        <div className="absolute inset-0 bg-white/[0.04] pointer-events-none" />
      </div>
    );
  }

  return (
    <div
      className={`relative ${sizeClasses} rounded-xl overflow-hidden shrink-0 bg-black/60 border border-white/10 ${className}`}
    >
      <img
        src={finalSrc}
        alt={name}
        onError={() => setHasError(true)}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
};
