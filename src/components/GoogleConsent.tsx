import { useEffect, useState } from 'react';
import { initGoogleTracking, setGoogleConsent, storedGoogleConsent } from '../services/googleTracking';
export default function GoogleConsent() {
  const [ready,setReady] = useState(false);
  const [choice,setChoice] = useState(storedGoogleConsent);
  const [open,setOpen] = useState(!choice);
  useEffect(() => { void initGoogleTracking().then(v => setReady(Boolean(v))); },[]);
  if (!ready) return null;
  const choose = (analytics:boolean,ads:boolean) => { const next={analytics,ads}; setChoice(next); setOpen(false); void setGoogleConsent(next); };
  return <aside aria-label="Privacy choices" className="fixed bottom-4 left-4 right-4 z-[80] mx-auto max-w-xl rounded-2xl border border-white/15 bg-[#10141b] p-4 text-sm text-zinc-200 shadow-xl">
    {open ? <><p>Choose whether to allow Google Analytics and advertising cookies. Your choice can be changed here.</p><a className="text-yellow-300 underline" href="https://playbeat.digital/privacy">Privacy policy</a><div className="mt-3 flex flex-wrap gap-2">
      <button className="rounded-lg border border-white/20 px-3 py-2" onClick={()=>choose(false,false)}>Essential only</button>
      <button className="rounded-lg border border-white/20 px-3 py-2" onClick={()=>choose(true,false)}>Allow analytics</button>
      <button className="rounded-lg bg-yellow-400 px-3 py-2 text-black" onClick={()=>choose(true,true)}>Allow all</button>
    </div></> : <button onClick={()=>setOpen(true)} className="text-xs">Privacy settings · Analytics {choice?.analytics?'on':'off'} · Ads {choice?.ads?'on':'off'}</button>}
  </aside>;
}
