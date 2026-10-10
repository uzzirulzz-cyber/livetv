import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Heart, Play, Radio, Search } from 'lucide-react';
import { MediaSection } from './components/reference/MediaSection';
import { MediaCard } from './components/reference/MediaCard';
import { CinematicMarquee } from './components/reference/CinematicMarquee';
import type { MediaItem } from './components/reference/types';
import type { Channel } from './types/playbeat';
import { loadBroadcastCatalog } from './services/broadcastCatalog';
import { reportLiveEvent } from './services/digitalReporting';
import image0 from './assets/playbeat-lifestyle-v1.webp';
import image1 from './assets/playbeat-moonlit-pool-toast-v1.webp';
import image2 from './assets/playbeat-coastal-convertible-v1.webp';
import image3 from './assets/playbeat-neon-rooftop-v1.webp';
import image4 from './assets/playbeat-sunset-yacht-v1.webp';
import image5 from './assets/playbeat-festival-lights-v1.webp';
import image6 from './assets/playbeat-vineyard-wine-v1.webp';
import image7 from './assets/playbeat-beach-bonfire-v1.webp';
import image8 from './assets/playbeat-resort-car-v1.webp';
import image9 from './assets/playbeat-city-champagne-v1.webp';
const backgrounds=[image0,image1,image2,image3,image4,image5,image6,image7,image8,image9];
const Player=lazy(()=>import('./components/playbeat/VideoPlayerModal').then(m=>({default:m.VideoPlayerModal})));
const rows=[
 {title:'Discover Live TV',category:'All',subtitle:'Channels from your connected playlist',bg:1},
 {title:'Live Sports',category:'Sports',subtitle:'Browse sports channels',bg:2},
 {title:'Cinema · Live 24/7',category:'Movies',subtitle:'Scheduled cinema channels streaming around the clock',bg:3},
 {title:'Drama & Entertainment',category:'Entertainment',subtitle:'Live entertainment from around the world',bg:4},
 {title:'Kids & Animation',category:'Kids',subtitle:'Family channels from your playlist',bg:5},
 {title:'Music Live',category:'Music',subtitle:'Music channels and performances',bg:6},
 {title:'News & Current Affairs',category:'News',subtitle:'Explore news channels',bg:7},
 {title:'Explore & Discover',category:'Documentary',subtitle:'Documentary and discovery channels',bg:8}
];
function saved():string[]{try{const v:unknown=JSON.parse(localStorage.getItem('pb_favorites')||'[]');return Array.isArray(v)?v.filter((id):id is string=>typeof id==='string'):[];}catch{return [];}}
function card(c:Channel):MediaItem{return {id:c.id,title:c.name,type:'channel',category:c.category,genre:[c.groupTitle||c.category],year:0,rating:0,quality:c.resolution==='4K'?'4K UHD':c.resolution==='1080p'?'FHD 1080p':c.resolution==='720p'?'HD 720p':'Source',posterUrl:c.logo,description:'Live broadcast',videoUrl:c.streamUrl,live:true};}
export default function HomeApp(){
 const [channels,setChannels]=useState<Channel[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(false),[revision,setRevision]=useState(0);
 const [favorites,setFavorites]=useState(saved),[selected,setSelected]=useState<Channel|null>(null),[heroIndex,setHeroIndex]=useState(0);
 const [query,setQuery]=useState(''),[category,setCategory]=useState('All'),[page,setPage]=useState(1);
 useEffect(()=>{const controller=new AbortController();setLoading(true);setError(false);loadBroadcastCatalog(controller.signal).then(setChannels).catch(()=>{if(!controller.signal.aborted)setError(true);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();},[revision]);
 useEffect(()=>{try{localStorage.setItem('pb_favorites',JSON.stringify(favorites));}catch{/* Optional browser storage. */}},[favorites]);
 useEffect(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const id=setInterval(()=>setHeroIndex(i=>(i+1)%backgrounds.length),8000);return()=>clearInterval(id);},[]);
 useEffect(()=>setPage(1),[query,category]);
 const items=useMemo(()=>channels.map(card),[channels]);
 const selectedFavorites=useMemo(()=>items.filter(i=>favorites.includes(i.id)),[items,favorites]);
 const filtered=useMemo(()=>items.filter(i=>(category==='All'||i.category===category)&&(!query||`${i.title} ${i.genre.join(' ')}`.toLowerCase().includes(query.toLowerCase()))),[items,query,category]);
 const categories=useMemo(()=>['All',...new Set(items.map(i=>i.category))],[items]);
 const watch=(item:MediaItem)=>{const channel=channels.find(c=>c.id===item.id);if(channel){reportLiveEvent('play_request',channel.id);setSelected(channel);}};
 const toggle=(id:string)=>setFavorites(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
 const favorite=(item:MediaItem)=>toggle(item.id);
 const common={onWatch:watch,onSelect:watch,onToggleFavorite:favorite,favoritesList:selectedFavorites};
 const navigate=(section:string)=>{window.location.href=section==='movies'?'/movies':section==='series'?'/series':'/live-tv';};
 return <div id="home" className="min-h-screen bg-[#050811] text-slate-100">
 <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050811]/95 backdrop-blur-xl">
 <div className="mx-auto max-w-[1600px] px-5 py-5 flex flex-wrap items-center justify-between gap-4">
 <a href="/" aria-label="PlayBeat Live home"><img src="/logo.svg" alt="PlayBeat Live" className="h-9 w-auto max-w-44"/></a>
 <nav aria-label="Media sections" className="flex flex-wrap gap-2 text-sm font-semibold">{[['Home','/'],['Live TV','/live-tv'],['Movies','/movies'],['Web Series','/series']].map(([label,href])=><a key={href} href={href} aria-current={href==='/'?'page':undefined} className={href==='/'?'px-3 py-2 rounded-lg bg-amber-400 text-slate-950':'px-3 py-2 rounded-lg text-slate-300 hover:bg-white/10'}>{label}</a>)}</nav>
 <a href="#my-list" className="flex items-center gap-2 text-sm text-slate-300"><Heart size={17}/>My List · {favorites.length}</a>
 </div></header>
 <div className="max-w-[1600px] mx-auto px-5 py-4 flex flex-wrap items-center justify-between gap-3 text-xs"><p className="text-cyan-300 tracking-widest uppercase">Your world of entertainment</p><p className="text-slate-400">{loading?'Connecting catalogue…':`${channels.length.toLocaleString()} playlist entries`} · Live TV · Movies · Web series</p></div>
 <section className="relative min-h-[560px] sm:min-h-[650px] overflow-hidden flex items-end"><img src={backgrounds[heroIndex]} alt="" className="absolute inset-0 w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-r from-[#050811]/95 via-[#050811]/55 to-transparent"/><div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-[#050811]/15"/><div className="relative max-w-[1600px] w-full mx-auto px-6 sm:px-10 pb-20 pt-24"><p className="text-xs uppercase tracking-[.25em] text-amber-300 mb-6">PlayBeat · Live worldwide</p><h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[.98] tracking-tight max-w-4xl">NEW WORLDS.<br/><span className="text-amber-300">BIGGER STORIES.</span></h1><p className="text-slate-200 mt-6 max-w-xl leading-7">Live television, cinema channels, sports and entertainment. Discover your next favourite in one place.</p><div className="flex gap-3 mt-7"><button onClick={()=>{window.location.href='/live-tv';}} className="bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Play size={18} fill="currentColor"/>Browse Live TV</button><button onClick={()=>document.getElementById('my-list')?.scrollIntoView({behavior:'smooth'})} className="bg-white/10 border border-white/20 px-6 py-3 rounded-xl font-semibold flex items-center gap-2"><Heart size={18}/>My List</button></div><div className="flex gap-2 mt-8">{backgrounds.map((_,i)=><button key={i} onClick={()=>setHeroIndex(i)} aria-label={`Background ${i+1}`} className={`h-1 rounded-full ${i===heroIndex?'w-8 bg-amber-400':'w-3 bg-white/30'}`}/>)}</div></div></section>

 {loading&&<p role="status" className="max-w-[1600px] mx-auto px-6 py-8">Loading live channels…</p>}
 {error&&<div role="alert" className="max-w-[1600px] mx-auto px-6 py-8 text-amber-200">The channel library could not be reached. <button onClick={()=>setRevision(v=>v+1)} className="underline">Try again</button></div>}
 <section id="my-list" className="scroll-mt-28">{selectedFavorites.length?<MediaSection title="My List" subtitle="Your saved channels on this device" items={selectedFavorites} aspectRatio="landscape" {...common}/>:<div className="mx-auto max-w-[1600px] px-6 py-8"><h2 className="text-2xl font-bold">My List</h2><p className="mt-3 text-slate-400">Save a channel with the heart button to find it here.</p></div>}</section>
 {rows.slice(0,3).map(row=><div key={row.title} className="relative isolate"><img src={backgrounds[row.bg]} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-[.12] -z-10"/><MediaSection title={row.title} subtitle={row.subtitle} items={items.filter(i=>row.category==='All'||i.category===row.category).slice(0,18)} aspectRatio="landscape" {...common}/></div>)}
 <CinematicMarquee onSelectCategory={navigate}/>
 <div className="mx-auto max-w-[1600px] px-6 grid gap-5 sm:grid-cols-2">{[['Movies · On Demand','Explore the connected movie library','/movies'],['Web Series · On Demand','Browse available shows and episodes','/series']].map(([title,text,href])=><a key={href} href={href} className="rounded-2xl border border-white/10 bg-[#090e1d] p-7 hover:border-cyan-400/50"><h2 className="text-2xl font-bold">{title}</h2><p className="text-slate-400 mt-3">{text}</p></a>)}</div>
 {rows.slice(3).map(row=><div key={row.title} className="relative isolate"><img src={backgrounds[row.bg]} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-[.12] -z-10"/><MediaSection title={row.title} subtitle={row.subtitle} items={items.filter(i=>i.category===row.category).slice(0,18)} aspectRatio="landscape" {...common}/></div>)}
 <section id="live-tv-section" className="scroll-mt-28 max-w-[1600px] mx-auto px-5 sm:px-8 py-12"><h2 className="text-3xl font-bold flex items-center gap-3"><Radio className="text-cyan-400"/>Live TV Guide</h2><p className="text-sm text-slate-400 mt-3">Search your connected playlist by channel name or group.</p><div className="mt-6 flex flex-wrap gap-3"><label className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 flex-1 min-w-48"><Search size={18}/><input aria-label="Search live channels" placeholder="Search live channels…" value={query} onChange={e=>setQuery(e.target.value)} className="w-full bg-transparent py-3 outline-none"/></label><select aria-label="Channel category" value={category} onChange={e=>setCategory(e.target.value)} className="rounded-xl border border-white/10 bg-[#0b1020] p-3">{categories.map(c=><option key={c}>{c}</option>)}</select></div><p className="my-5 text-xs text-slate-400">{filtered.length.toLocaleString()} channels · Page {page} of {Math.max(1,Math.ceil(filtered.length/18))}</p><div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 channel-grid">{filtered.slice((page-1)*18,page*18).map(item=><MediaCard key={item.id} item={item} onWatch={watch} onSelect={watch} onToggleFavorite={favorite} isFavorite={favorites.includes(item.id)} aspectRatio="landscape"/>)}</div>{!loading&&!error&&!filtered.length&&<p className="py-8 text-slate-400">No matching channels.</p>}<div className="flex justify-between mt-6"><button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="px-5 py-2 rounded-xl bg-white/5 disabled:opacity-30">Previous</button><button disabled={page*18>=filtered.length} onClick={()=>setPage(p=>p+1)} className="px-5 py-2 rounded-xl bg-white/5 disabled:opacity-30">Next</button></div></section>
 <footer className="border-t border-white/10 py-10 text-sm text-slate-400"><div className="max-w-[1600px] mx-auto px-6"><p className="text-white text-xl font-bold">playbeat.live</p><p className="mt-3">Live TV &amp; Media Library · Stream availability and resolution depend on the connected provider.</p><nav aria-label="Information" className="mt-6 flex flex-wrap gap-6">{[['Privacy Policy','https://playbeat.digital/privacy'],['Terms & Conditions','https://playbeat.digital/terms'],['Refund Policy','https://playbeat.digital/refund-policy'],['Contact','https://playbeat.digital/contact']].map(([label,href])=><a key={href} href={href}>{label}</a>)}</nav></div></footer>
 {selected&&<Suspense fallback={<p role="status" className="fixed bottom-6 left-6 rounded-xl bg-slate-900 p-4">Opening player…</p>}><Player channel={selected} allChannels={channels} isOpen onClose={()=>setSelected(null)} onSelectChannel={c=>{reportLiveEvent('play_request',c.id);setSelected(c);}} isFavorite={favorites.includes(selected.id)} onToggleFavorite={toggle}/></Suspense>}
 </div>;
}

