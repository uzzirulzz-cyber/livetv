import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import type mpegtsApi from "mpegts.js";
import {
  X,
  Heart,
  ChevronUp,
  ChevronDown,
  PictureInPicture2,
  Maximize,
  Search,
  Radio,
  RotateCcw,
} from "lucide-react";
import type { Channel } from "../../types/playbeat";
import { ChannelLogo } from "../common/ChannelLogo";
type MpegTsPlayer = ReturnType<typeof mpegtsApi.createPlayer>;
interface Props {
  channel: Channel | null;
  allChannels: Channel[];
  isOpen: boolean;
  onClose: () => void;
  onSelectChannel: (channel: Channel) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}
interface Quality {
  index: number;
  label: string;
}
export function VideoPlayerModal({
  channel,
  allChannels,
  isOpen,
  onClose,
  onSelectChannel,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const mpegTsRef = useRef<MpegTsPlayer | null>(null);
  const [buffering, setBuffering] = useState(true);
  const [error, setError] = useState("");
  const [needsPlay, setNeedsPlay] = useState(false);
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [quality, setQuality] = useState(-1);
  const [query, setQuery] = useState("");
  const [listLimit, setListLimit] = useState(60);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const video = videoRef.current;
    if (!isOpen || !channel || !video) return;
    let disposed = false;
    let retries = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let hls: Hls | null = null;
    let mpegTs: MpegTsPlayer | null = null;
    setBuffering(true);
    setError("");
    setNeedsPlay(false);
    setQualities([]);
    setQuality(-1);
    const source = channel.hlsUrl || channel.streamUrl;
    const isHls =
      !!channel.hlsUrl || /\.m3u8(?:\?|$)|[?&]hls=1(?:&|$)/i.test(source);
    const isRawTransportStream =
      channel.isLive && !isHls && /(?:\.ts(?:[?#]|$)|\/broadcast-player\/stream\/\d+$)/i.test(source);
    const fail = () => {
      if (disposed) return;
      setError(
        "This channel is temporarily unavailable. Try again or choose another channel.",
      );
      setBuffering(false);
      hls?.stopLoad();
      mpegTs?.unload();
      video.pause();
    };
    const play = async () => {
      try {
        await video.play();
      } catch (reason) {
        if (disposed) return;
        if (reason instanceof Error && reason.name === "NotAllowedError") {
          setNeedsPlay(true);
          setBuffering(false);
        } else if (!(reason instanceof Error && reason.name === "AbortError"))
          fail();
      }
    };
    if (!source) fail();
    else if (isHls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        maxBufferLength: 45,
        backBufferLength: 30,
      });
      hlsRef.current = hls;
      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        if (disposed) return;
        setQualities(
          data.levels.map((level, index) => ({
            index,
            label: level.height
              ? `${level.height}p`
              : level.bitrate
                ? `${Math.round(level.bitrate / 1000)} kbps`
                : "Source quality",
          })),
        );
        void play();
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (disposed || !data.fatal) return;
        console.warn("[PlayBeat playback]", data.type, data.details);
        if (retries++ < 2 && data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls?.recoverMediaError();
          return;
        }
        if (retries <= 2 && data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          setBuffering(true);
          clearTimeout(timer);
          timer = setTimeout(() => {
            if (!disposed) hls?.startLoad();
          }, retries * 1500);
          return;
        }
        fail();
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else if (isRawTransportStream) {
      void import("mpegts.js").then(async ({ default: mpegts }) => {
        if (disposed) return;
        if (!mpegts.isSupported() || !mpegts.getFeatureList().mseLivePlayback) {
          setBuffering(false);
          setError(
            "This browser cannot play MPEG-TS live streams. Update your browser or try Safari 17.1+ on iPhone.",
          );
          return;
        }
        mpegTs = mpegts.createPlayer(
          { type: "mpegts", isLive: true, url: source, cors: true },
          {
            enableWorker: true,
            enableWorkerForMSE: true,
            enableStashBuffer: true,
            stashInitialSize: 512 * 1024,
            liveBufferLatencyChasing: true,
            liveBufferLatencyMaxLatency: 5,
            liveBufferLatencyMinRemain: 1,
          },
        );
        mpegTsRef.current = mpegTs;
        mpegTs.on(mpegts.Events.ERROR, (type: string) => {
          if (disposed) return;
          if (type === mpegts.ErrorTypes.NETWORK_ERROR && retries < 2) {
            retries++;
            setBuffering(true);
            clearTimeout(timer);
            timer = setTimeout(() => {
              if (disposed || !mpegTs) return;
              mpegTs.unload();
              mpegTs.load();
              void Promise.resolve(mpegTs.play()).catch(() => {});
            }, retries * 1500);
            return;
          }
          fail();
        });
        mpegTs.attachMediaElement(video);
        mpegTs.load();
        try {
          await mpegTs.play();
        } catch (reason) {
          if (disposed) return;
          if (reason instanceof Error && reason.name === "NotAllowedError") {
            setNeedsPlay(true);
            setBuffering(false);
          } else if (!(reason instanceof Error && reason.name === "AbortError")) {
            fail();
          }
        }
      }).catch(() => fail());
    } else if (!isHls || video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      video.load();
      void play();
    } else {
      setBuffering(false);
      setError(
        "HLS playback is not supported by this browser. Try a current version of Chrome or Safari.",
      );
    }
    return () => {
      disposed = true;
      clearTimeout(timer);
      hls?.destroy();
      if (hlsRef.current === hls) hlsRef.current = null;
      mpegTs?.destroy();
      if (mpegTsRef.current === mpegTs) mpegTsRef.current = null;
      if (document.pictureInPictureElement === video)
        void document.exitPictureInPicture().catch(() => {});
      if (document.fullscreenElement === viewportRef.current)
        void document.exitFullscreen().catch(() => {});
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [channel?.id, channel?.streamUrl, isOpen, retry]);

  const adjacent = (direction: number) => {
    if (!channel || !channel.isLive || !allChannels.length) return;
    const index = allChannels.findIndex((item) => item.id === channel.id);
    onSelectChannel(
      allChannels[
        (index + direction + allChannels.length) % allChannels.length
      ],
    );
  };
  const fullscreen = () => {
    if (document.fullscreenElement)
      void document.exitFullscreen().catch(() => {});
    else
      void viewportRef.current
        ?.requestFullscreen?.()
        .catch(() => setError("Fullscreen is unavailable here."));
  };
  const pictureInPicture = async () => {
    try {
      if (document.pictureInPictureElement)
        await document.exitPictureInPicture();
      else if (document.pictureInPictureEnabled && videoRef.current)
        await videoRef.current.requestPictureInPicture();
    } catch {
      setError("Picture-in-picture is unavailable here.");
    }
  };
  if (!isOpen || !channel) return null;
  const matches = allChannels.filter((item) =>
    `${item.name} ${item.groupTitle} ${item.number}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <dialog
      ref={dialogRef}
      className="playbeat-player"
      aria-labelledby="player-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLSelectElement ||
          event.target instanceof HTMLVideoElement ||
          event.ctrlKey ||
          event.metaKey
        )
          return;
        if (event.key === "ArrowUp") {
          event.preventDefault();
          adjacent(-1);
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          adjacent(1);
        }
        if (event.key === "f") fullscreen();
        if (event.key === "m" && videoRef.current)
          videoRef.current.muted = !videoRef.current.muted;
      }}
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <ChannelLogo
            key={channel.id}
            src={channel.logo}
            name={channel.name}
            category={channel.category}
            size="md"
          />
          <div className="min-w-0">
            <h2
              id="player-title"
              className="truncate text-base font-bold text-white"
            >
              {channel.name}
            </h2>
            <p className="mt-1 truncate text-xs text-slate-500">
              {channel.groupTitle || channel.category}
            </p>
          </div>
        </div>
        <button
          autoFocus
          onClick={onClose}
          aria-label="Close player"
          className="rounded-full border border-white/10 bg-white/5 p-2.5 text-slate-300 hover:bg-white/10"
        >
          <X size={19} />
        </button>
      </div>
      <div className={`player-layout ${channel.isLive ? "" : "player-vod"}`}>
        <div className="min-w-0">
          <div ref={viewportRef} className="player-viewport">
            <video
              ref={videoRef}
              controls
              playsInline
              preload="none"
              aria-label={`${channel.name} video`}
              onPlaying={() => {
                setBuffering(false);
                setNeedsPlay(false);
              }}
              onWaiting={() => setBuffering(true)}
              onCanPlay={() => setBuffering(false)}
              onError={() => {
                setBuffering(false);
                setError(
                  "This channel could not be played. Try again or choose another channel.",
                );
              }}
            />
            {buffering && !error && (
              <div className="player-status" role="status">
                <span className="player-spinner" />
                <span>Connecting to {channel.name}…</span>
              </div>
            )}
            {error && (
              <div className="player-status" role="alert">
                <p className="max-w-sm text-center text-sm leading-6">
                  {error}
                </p>
                <button
                  onClick={() => setRetry((value) => value + 1)}
                  className="mt-3 flex items-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold text-slate-950"
                >
                  <RotateCcw size={15} />
                  Try again
                </button>
              </div>
            )}
            {needsPlay && !error && (
              <div className="player-status">
                <button
                  onClick={() => {
                    void videoRef.current?.play().catch(() => {});
                  }}
                  className="rounded-full bg-amber-300 px-7 py-3 text-sm font-bold text-slate-950"
                >
                  Tap to play
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              {channel.isLive && (
                <>
                  <Radio size={14} className="text-amber-300" />
                  <span className="font-bold text-amber-200">LIVE</span>
                  <span className="mx-1 text-slate-700">/</span>
                </>
              )}
              <span>{channel.category}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {channel.isLive && (
                <>
                  <button
                    aria-label="Previous channel"
                    className="player-control"
                    onClick={() => adjacent(-1)}
                  >
                    <ChevronUp size={18} />
                  </button>
                  <button
                    aria-label="Next channel"
                    className="player-control"
                    onClick={() => adjacent(1)}
                  >
                    <ChevronDown size={18} />
                  </button>
                </>
              )}
              <button
                className={`player-control ${isFavorite ? "text-amber-300" : ""}`}
                aria-label={
                  isFavorite
                    ? "Remove channel from watchlist"
                    : "Save channel to watchlist"
                }
                aria-pressed={isFavorite}
                onClick={() => onToggleFavorite(channel.id)}
              >
                <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <select
                aria-label="Playback quality"
                disabled={!qualities.length}
                value={quality}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setQuality(value);
                  if (hlsRef.current) hlsRef.current.currentLevel = value;
                }}
                className="max-w-36 rounded-full border border-white/10 bg-[#0a1425] px-3 py-2 text-xs"
              >
                <option value={-1}>Auto quality</option>
                {qualities.map((level) => (
                  <option key={level.index} value={level.index}>
                    {level.label}
                  </option>
                ))}
              </select>
              {document.pictureInPictureEnabled && (
                <button
                  aria-label="Picture in picture"
                  onClick={() => void pictureInPicture()}
                  className="player-control"
                >
                  <PictureInPicture2 size={17} />
                </button>
              )}
              <button
                aria-label="Fullscreen"
                onClick={fullscreen}
                className="player-control"
              >
                <Maximize size={17} />
              </button>
            </div>
          </div>
        </div>
        {channel.isLive && (
          <aside className="player-channel-list">
            <div className="border-b border-white/10 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold">Your live lineup</h3>
                <span className="text-[10px] text-slate-500">
                  {matches.length.toLocaleString()}
                </span>
              </div>
              <label className="relative block">
                <Search
                  size={14}
                  className="absolute left-3 top-3 text-slate-500"
                />
                <input
                  aria-label="Search player channels"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setListLimit(60);
                  }}
                  placeholder="Find a channel…"
                  className="w-full rounded-full border border-white/10 bg-[#050b18] py-2.5 pl-9 pr-3 text-xs outline-none focus:border-amber-300/50"
                />
              </label>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {matches.slice(0, listLimit).map((item) => (
                <button
                  key={item.id}
                  aria-current={channel.id === item.id ? "true" : undefined}
                  onClick={() => onSelectChannel(item)}
                  className={`flex w-full items-center gap-3 border-b border-white/[0.035] p-3 text-left hover:bg-white/5 ${channel.id === item.id ? "bg-amber-300/10" : ""}`}
                >
                  <ChannelLogo
                    src={item.logo}
                    name={item.name}
                    category={item.category}
                    size="sm"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold">
                      {item.name}
                    </span>
                    <span className="mt-1 block truncate text-[10px] text-slate-500">
                      {item.groupTitle}
                    </span>
                  </span>
                </button>
              ))}
              {!matches.length && (
                <p className="p-6 text-xs text-slate-400">
                  No matching channels.
                </p>
              )}
              {listLimit < matches.length && (
                <button
                  className="w-full p-4 text-xs text-amber-200"
                  onClick={() => setListLimit((value) => value + 60)}
                >
                  Show more channels
                </button>
              )}
            </div>
          </aside>
        )}
      </div>
    </dialog>
  );
}
