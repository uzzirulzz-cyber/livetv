import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { X } from 'lucide-react';
export function OnDemandPlayer({ title, source, onClose }: { title: string; source: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const modal = dialog.current;
    const element = video.current;
    if (!modal || !element) return;
    modal.showModal(); setError(false);
    const overflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    let hls: Hls | undefined;
    if (/\.m3u8(?:\?|$)/i.test(source) && Hls.isSupported()) {
      hls = new Hls(); hls.loadSource(source); hls.attachMedia(element);
      hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal) setError(true); });
    } else element.src = source;
    return () => { hls?.destroy(); element.pause(); element.removeAttribute('src'); element.load(); modal.close(); document.body.style.overflow = overflow; };
  }, [source]);
  return <dialog ref={dialog} onCancel={event => { event.preventDefault(); onClose(); }} aria-label={title} className="m-auto w-[95vw] max-w-5xl rounded-2xl border border-white/10 bg-[#091122] p-4 text-white backdrop:bg-black/90"><div className="mb-4 flex items-center justify-between gap-4"><h2 className="font-semibold">{title}</h2><button autoFocus aria-label="Close media player" onClick={onClose} className="rounded-lg p-2"><X /></button></div><video ref={video} controls autoPlay playsInline onError={() => setError(true)} className="aspect-video w-full bg-black" />{error && <p role="alert" className="mt-3 text-amber-200">This title could not be played. Check the media provider connection and try again.</p>}</dialog>;
}
