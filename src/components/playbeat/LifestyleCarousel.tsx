import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import image0 from "../../assets/playbeat-lifestyle-v1.webp";
import image1 from "../../assets/playbeat-moonlit-pool-toast-v1.webp";
import image2 from "../../assets/playbeat-coastal-convertible-v1.webp";
import image3 from "../../assets/playbeat-neon-rooftop-v1.webp";
import image4 from "../../assets/playbeat-sunset-yacht-v1.webp";
import image5 from "../../assets/playbeat-festival-lights-v1.webp";
import image6 from "../../assets/playbeat-vineyard-wine-v1.webp";
import image7 from "../../assets/playbeat-beach-bonfire-v1.webp";
import image8 from "../../assets/playbeat-resort-car-v1.webp";
import image9 from "../../assets/playbeat-city-champagne-v1.webp";

const slides = [
  { image: image0, name: "Sunset beach party", heading: "Live a little.", accent: "Watch a lot.", subtitle: "Big nights. Good company. Endless entertainment.", alt: "Adult friends at a sunset beach party beside a sports car" },
  { image: image1, name: "moonlit pool toast", heading: "Nights to", accent: "remember.", subtitle: "Good company. Great entertainment.", alt: "An elegant outdoor pool party at blue hour. Stylish adult women and men aged 25–35 in flowing colourful summer dresses and linen outfits laugh and toast with champagne. Turquoise water, palms, warm string lights and a lively atmosphere." },
  { image: image2, name: "coastal convertible", heading: "Escape the", accent: "everyday.", subtitle: "Your favourite channels. Wherever you unwind.", alt: "A red convertible sports car on a spectacular palm-lined coastal road above a turquoise beach. Two stylish adult women aged 25–35 in white and coral summer dresses stand beside the car, smiling in golden sunset light, candid luxury holiday campaign." },
  { image: image3, name: "neon rooftop", heading: "Turn up", accent: "the night.", subtitle: "Music, movies, and moments worth staying for.", alt: "A lively sophisticated rooftop music party above a glowing city at night. Stylish adult friends aged 25–35 dancing in colourful evening dresses and summer shirts, joyful faces, electric pink and violet lights, champagne glasses on a table, cinematic fashion editorial." },
  { image: image4, name: "sunset yacht", heading: "A little more", accent: "golden.", subtitle: "Settle in for your next favourite channel.", alt: "Adult friends aged 25–35 on the deck of a beautiful yacht at sunset on the Mediterranean, women in elegant blue and gold summer dresses, men in linen outfits, laughing and making a champagne toast, sea sparkling warm amber, lively luxury holiday mood." },
  { image: image5, name: "festival lights", heading: "Feel the", accent: "energy.", subtitle: "Live music. Big nights. Endless entertainment.", alt: "An open-air beach music festival with huge electric-blue and coral-pink lights, stylish adult women aged 25–35 and friends in colourful summer dresses dancing joyfully in the foreground, palm trees, confetti and sea horizon, premium music fashion campaign." },
  { image: image6, name: "vineyard wine", heading: "Make an", accent: "evening of it.", subtitle: "Find something you love. Stay a little longer.", alt: "A golden-hour vineyard terrace celebration, stylish adult women and men aged 25–35 in colourful linen and summer dresses sharing red wine glasses and laughter, rolling hills, warm lamps, relaxed sophisticated holiday fashion campaign." },
  { image: image7, name: "beach bonfire", heading: "Good times,", accent: "on repeat.", subtitle: "Your lineup for long evenings and easy weekends.", alt: "A joyful tropical beach evening party around a small bonfire, adult friends aged 25–35 wearing fashionable summer dresses and relaxed linen shirts and trousers, dancing and laughing under string lights, turquoise dusk, palms and warm golden firelight." },
  { image: image8, name: "resort car", heading: "Arrive", accent: "in style.", subtitle: "A premium home for your entertainment.", alt: "A metallic silver luxury sports car parked at a glamorous tropical resort entrance with palms and blue sea beyond. Stylish adult women aged 25–35 in bright pink and blue flowing summer dresses and male friends in linen clothing walk toward an evening celebration. Golden light, joyful cinematic holiday campaign." },
  { image: image9, name: "city champagne", heading: "Here’s to", accent: "tonight.", subtitle: "Discover something worth watching.", alt: "A champagne celebration on an elegant city terrace at night, adult friends aged 25–35 in tasteful evening dresses, shirts and trousers laughing with champagne glasses, sparkling city skyline and warm gold bokeh, stylish fashion editorial, energetic social atmosphere." },
];
const intervalMs = 6500;

export function LifestyleCarousel({ onExplore }: { onExplore: () => void }) {
  const region = useRef<HTMLElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [running, setRunning] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [ready, setReady] = useState<Set<number>>(() => new Set());
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0, 1]));
  const next = (index + 1) % slides.length;
  const advancing = running && !reducedMotion && !hovered && visible && pageVisible && ready.has(next);
  const current = slides[index];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches) setRunning(false);
    };
    const visibility = () => setPageVisible(!document.hidden);
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    if (region.current) observer.observe(region.current);
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setVisited(previous => new Set([...previous, index, next]));
  }, [index, next]);

  useEffect(() => {
    if (!advancing || !ready.has(next)) return;
    const timer = window.setTimeout(() => setIndex(next), intervalMs);
    return () => window.clearTimeout(timer);
  }, [advancing, index, next, ready]);

  const select = (slide: number) => {
    setRunning(false);
    setIndex((slide + slides.length) % slides.length);
  };

  return (
    <section
      ref={region}
      className="iptv-life-banner iptv-life-carousel"
      aria-label="The PlayBeat lifestyle"
      aria-roledescription="carousel"
      data-slide={index + 1}
      data-playing={advancing}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={event => {
        if (!(event.target as HTMLElement).closest("[data-carousel-toggle]")) setRunning(false);
      }}
      onTouchStart={event => {
        const touch = event.touches[0];
        touchStart.current = { x: touch.clientX, y: touch.clientY };
      }}
      onTouchEnd={event => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const touch = event.changedTouches[0];
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) select(index + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="iptv-life-images" aria-live="off">
        {slides.map((slide, i) => (
          <div key={slide.name} className={`iptv-life-slide ${i === index ? "is-active" : ""}`} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}: ${slide.name}`} aria-hidden={i !== index}>
            {visited.has(i) && <img src={slide.image} alt={slide.alt} width={1916} height={821} loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "low"} onLoad={() => setReady(previous => previous.has(i) ? previous : new Set([...previous, i]))} />}
          </div>
        ))}
      </div>
      <div className="iptv-life-copy">
        <span className="iptv-life-eyebrow">
          <span className="iptv-life-beats" aria-hidden="true"><i /><i /><i /><i /></span>
          TURN UP THE MOMENT
        </span>
        <div key={index} className="iptv-life-message" aria-live={running ? "off" : "polite"} aria-atomic="true">
          <h2>{current.heading}<br /><span>{current.accent}</span></h2>
          <p>{current.subtitle}</p>
        </div>
        <button onClick={onExplore}>Discover your lineup <ArrowUpRight size={15} /></button>
      </div>
      <span className="iptv-life-signature">THE PLAYBEAT LIFE</span>
      <div className="iptv-life-pagination" aria-label="Choose a lifestyle slide">
        {slides.map((slide, i) => <button key={slide.name} aria-label={`Show slide ${i + 1}: ${slide.name}`} aria-current={i === index ? "true" : undefined} onClick={() => select(i)}><span /></button>)}
      </div>
      <div className="iptv-life-controls">
        <span className="iptv-life-count" aria-live="off">{String(index + 1).padStart(2, "0")} <span>/ 10</span></span>
        <button aria-label="Previous lifestyle slide" onClick={() => select(index - 1)}><ChevronLeft size={16} /></button>
        <button data-carousel-toggle aria-label={running ? "Pause lifestyle slideshow" : "Start lifestyle slideshow"} aria-pressed={running} onClick={() => setRunning(previous => !previous)} disabled={reducedMotion}>{running ? <Pause size={14} /> : <Play size={14} />}</button>
        <button aria-label="Next lifestyle slide" onClick={() => select(index + 1)}><ChevronRight size={16} /></button>
      </div>
      <span key={`${index}-${advancing}`} className="iptv-life-progress" data-advancing={advancing} aria-hidden="true" />
    </section>
  );
}

