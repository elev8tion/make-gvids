import { useMemo, useState, type CSSProperties } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Toaster } from 'sonner';

import { TopNav } from './components/TopNav';
import { Wizard } from './components/Wizard';

export interface Shot {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  video?: string;
  promptHint: string;
}

interface DesignTweaks {
  accent: string;
  density: 'comfortable' | 'compact';
  contrast: 'balanced' | 'high';
}

const STORAGE_KEYS = {
  tweaks: 'makegvids_tweaks',
};

const SHOTS: Shot[] = [
  { id: 'on-the-radar', name: 'On The Radar', category: 'Urban', description: 'Moody nighttime rooftop with glowing city skyline', thumbnail: '/assets/shots/3.jpg', video: '/assets/videos/1.mp4', promptHint: 'urban rooftop night performance, city lights, cinematic energy' },
  { id: 'analog-reverie', name: 'Analog Reverie', category: 'Studio', description: 'Warm vintage tape studio with golden filmic lighting', thumbnail: '/assets/shots/1.jpg', video: '/assets/videos/2.mp4', promptHint: 'intimate analog studio, reel-to-reel, warm nostalgic tone' },
  { id: 'skyward-freefall', name: 'Skyward Freefall', category: 'Epic', description: 'Epic suspended performance in dramatic open sky', thumbnail: '/assets/shots/2.jpg', video: '/assets/videos/3.mp4', promptHint: 'epic sky performance, god rays, wind, cinematic scale' },
  { id: 'blue-cube-studio', name: 'Blue Cube Studio', category: 'Studio', description: 'Minimalist deep blue geometric cube with perfect light', thumbnail: '/assets/shots/5.jpg', video: '/assets/videos/3.mp4', promptHint: 'architectural blue cube, dramatic cool lighting, modern luxury' },
  { id: 'blue-studio-stance', name: 'Blue Studio Stance', category: 'Studio', description: 'Powerful dramatic stance in rich blue environment', thumbnail: '/assets/shots/4.jpg', promptHint: 'intense single-key portrait lighting, confident performance' },
  { id: 'amber-newsroom', name: 'Amber Lit Newsroom', category: 'Cinematic', description: 'Dramatic warm amber broadcast newsroom tension', thumbnail: '/assets/shots/6.jpg', promptHint: 'warm practical lighting, vintage broadcast cameras, gravitas' },
  { id: 'blue-turntable', name: 'Blue Studio Turntable', category: 'Studio', description: 'Sleek modern DJ setup with cyan-blue accents', thumbnail: '/assets/shots/7.jpg', promptHint: 'premium electronic studio, multiple turntables, focused energy' },
  { id: 'amp-stack', name: 'Amp Stack Session', category: 'Raw', description: 'Raw powerful energy surrounded by towering amps', thumbnail: '/assets/shots/8.jpg', promptHint: 'rock intensity, Marshall stacks, smoke, stage power' },
  { id: 'bodega-groove', name: 'Bodega Aisle Groove', category: 'Urban', description: 'Authentic late-night New York bodega performance', thumbnail: '/assets/shots/9.jpg', promptHint: 'raw street authenticity, fluorescent + product lighting' },
  { id: 'neon-rooftop', name: 'Neon Rooftop Drift', category: 'Neon', description: 'Dreamy pink-cyan neon reflections on wet rooftop', thumbnail: '/assets/shots/11.jpg', promptHint: 'high fashion neon city night, wet reflections, dreamy' },
  { id: 'crimson-warehouse', name: 'Crimson Warehouse Flow', category: 'Raw', description: 'Massive industrial space drenched in dramatic crimson', thumbnail: '/assets/shots/10.jpg', promptHint: 'raw industrial power, red dramatic lighting, concrete' },
];

const TWEAK_DEFAULTS: DesignTweaks = {
  accent: '#3b82f6',
  density: 'comfortable',
  contrast: 'balanced',
};

function useDesignTweaks() {
  const [tweaks, setTweaks] = useState<DesignTweaks>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.tweaks);
      return saved ? { ...TWEAK_DEFAULTS, ...JSON.parse(saved) } : TWEAK_DEFAULTS;
    } catch {
      return TWEAK_DEFAULTS;
    }
  });

  const updateTweaks = (patch: Partial<DesignTweaks>) => {
    setTweaks((current) => {
      const next = { ...current, ...patch };
      try {
        localStorage.setItem(STORAGE_KEYS.tweaks, JSON.stringify(next));
      } catch {
        // no-op
      }
      return next;
    });
  };

  const resetTweaks = () => {
    setTweaks(TWEAK_DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEYS.tweaks);
    } catch {
      // no-op
    }
  };

  return { tweaks, updateTweaks, resetTweaks };
}

const accentVariants = {
  '#3b82f6': { hover: '#2563eb', warm: '#60a5fa' },
  '#22c55e': { hover: '#16a34a', warm: '#4ade80' },
  '#f97316': { hover: '#ea580c', warm: '#fb923c' },
  '#e11d48': { hover: '#be123c', warm: '#fb7185' },
} as const;

function App() {
  const [showCreate, setShowCreate] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showShotsModal, setShowShotsModal] = useState(false);
  const [showTweaks, setShowTweaks] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const { tweaks, updateTweaks, resetTweaks } = useDesignTweaks();

  const categories = useMemo(() => ['All', ...Array.from(new Set(SHOTS.map((s) => s.category)))], []);

  const filteredShots = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return SHOTS.filter((shot) => {
      const matchesSearch = search.length === 0 || shot.name.toLowerCase().includes(search) || shot.description.toLowerCase().includes(search);
      const matchesCategory = activeCategory === 'All' || shot.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, searchTerm]);

  const featuredShots = useMemo(() => SHOTS.slice(0, 3), []);
  const galleryShots = useMemo(() => SHOTS.slice(3, 9), []);

  // Launch the pipeline wizard. (Scene selection happens inside the wizard;
  // the landing gallery is a preview that routes the user into the flow.)
  const openWizard = () => {
    setShowCreate(true);
    setShowShotsModal(false);
  };

  const accentSet = accentVariants[tweaks.accent as keyof typeof accentVariants] ?? accentVariants['#3b82f6'];

  const themeVars = {
    '--accent': tweaks.accent,
    '--accent-hover': accentSet.hover,
    '--accent-warm': accentSet.warm,
    '--surface-glass': tweaks.contrast === 'high' ? 'rgba(17,17,19,0.92)' : 'rgba(17,17,19,0.75)',
    '--border': tweaks.contrast === 'high' ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)',
  } as CSSProperties;

  return (
    <div style={themeVars} className="page-shell relative min-h-screen text-[var(--text)] overflow-x-hidden">
      <Toaster position="top-center" richColors closeButton />
      <div className="noise-overlay" aria-hidden />

      <TopNav
        onNewClip={() => setShowCreate(true)}
        onShowShots={() => setShowShotsModal(true)}
        onShowHowItWorks={() => setShowHowItWorks(true)}
      />

      <main className="pt-28 pb-28 space-y-20">
        <section className="page-container hero-section">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-kicker eyebrow">AI VIDEO ENGINE</div>
              <h1 className="hero-title">Cinematic music videos, built from your refs.</h1>
              <p className="hero-subtitle text-[#c8c8d4] max-w-2xl">
                Upload your best angles, dress your subject, pick a scene, pair a vocal take, and animate a lip-synced performance. Everything stays in-browser until you generate.
              </p>

              <div className="hero-actions">
                <button onClick={() => setShowCreate(true)} className="btn btn-primary px-6 py-3 text-sm font-semibold">
                  Start a new clip
                </button>
                <button onClick={() => setShowShotsModal(true)} className="btn btn-secondary px-5 py-3 text-sm">
                  Browse curated shots
                </button>
                <button onClick={() => setShowHowItWorks(true)} className="btn btn-ghost px-5 py-3 text-sm">
                  How it works
                </button>
              </div>

              <div className="hero-meta-rail">
                <div className="meta-card">
                  <div className="meta-label">Pipeline</div>
                  <div className="meta-value">8 guided steps</div>
                  <div className="meta-hint">Subject → animate → download</div>
                </div>
                <div className="meta-card">
                  <div className="meta-label">Library</div>
                  <div className="meta-value">{SHOTS.length} scenes</div>
                  <div className="meta-hint">Urban · Studio · Neon · Raw</div>
                </div>
                <div className="meta-card">
                  <div className="meta-label">Output</div>
                  <div className="meta-value">9:16 / 16:9 · 480p / 720p</div>
                  <div className="meta-hint">Lip-synced to your audio</div>
                </div>
              </div>
            </div>

            <div className="hero-media">
              <div className="hero-media__frame">
                <img src={SHOTS[0].thumbnail} className="w-full h-full object-cover" alt={SHOTS[0].name} />
                <div className="hero-media__glow" />
                <div className="hero-media__tag">Featured scene</div>
                <div className="hero-media__caption">
                  <div className="hero-media__title">{SHOTS[0].name}</div>
                  <p className="hero-media__desc">{SHOTS[0].description}</p>
                  <div className="hero-media__actions">
                    <button onClick={openWizard} className="btn btn-primary btn-sm">Use this shot</button>
                    <button onClick={() => setShowHowItWorks(true)} className="btn btn-secondary btn-sm">See the flow</button>
                  </div>
                </div>
              </div>

              <div className="hero-media__strip">
                {featuredShots.slice(1, 3).map((shot) => (
                  <button
                    key={shot.id}
                    type="button"
                    onClick={openWizard}
                    className="hero-thumb"
                    aria-label={`Use shot ${shot.name}`}
                  >
                    <img src={shot.thumbnail} alt={shot.name} />
                    <div className="hero-thumb__label">{shot.name}</div>
                    <div className="hero-thumb__pill">{shot.category}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="page-container section-block">
          <div className="section-head">
            <div className="space-y-3">
              <div className="eyebrow text-[11px] text-text-secondary">Shot gallery</div>
              <h2 className="section-title">Curated scenes, ready to remix.</h2>
              <p className="section-subtitle text-text-secondary max-w-2xl">
                Pick a premium canvas and the engine balances lighting, motion, and lip sync against your reference set. No generic towers — every shot is a cinematic micro-world.
              </p>
            </div>
            <div className="section-actions">
              <button onClick={() => setShowShotsModal(true)} className="btn btn-secondary px-4 py-2 text-xs">
                View full library
              </button>
              <button onClick={() => setShowCreate(true)} className="btn btn-primary px-4 py-2 text-xs">
                Open Wizard
              </button>
            </div>
          </div>

          <div className="featured-shots-grid">
            {featuredShots.map((shot, idx) => (
              <button
                key={shot.id}
                onClick={openWizard}
                className="featured-shot-card"
                type="button"
                aria-label={`Use shot ${shot.name}`}
              >
                <img src={shot.thumbnail} alt={shot.name} />
                <div className="featured-shot-card__gradient" />
                <div className="featured-shot-card__top">
                  <span className="featured-shot-card__pill">{shot.category}</span>
                  <span className="featured-shot-card__index">0{idx + 1}</span>
                </div>
                <div className="featured-shot-card__body">
                  <div className="featured-shot-card__title">{shot.name}</div>
                  <div className="featured-shot-card__desc">{shot.description}</div>
                  <div className="featured-shot-card__cta">Use shot ↗</div>
                </div>
              </button>
            ))}
          </div>

          <div className="shot-rail">
            {galleryShots.map((shot) => (
              <button
                key={shot.id}
                onClick={openWizard}
                className="shot-rail-card"
                type="button"
                aria-label={`Use ${shot.name}`}
              >
                <div className="shot-rail-card__image">
                  <img src={shot.thumbnail} alt={shot.name} />
                  <div className="shot-rail-card__overlay" />
                  <span className="shot-rail-card__pill">{shot.category}</span>
                </div>
                <div className="shot-rail-card__body">
                  <div className="shot-rail-card__title">{shot.name}</div>
                  <p className="shot-rail-card__desc">{shot.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {showCreate && <Wizard onClose={() => setShowCreate(false)} />}

      <AnimatePresence>
        {showShotsModal && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-6" onClick={() => setShowShotsModal(false)}>
            <div className="max-w-6xl w-full glass rounded-3xl p-6 md:p-8 max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-[#3b82f6] text-xs tracking-[2px]">SHOT LIBRARY</div>
                  <h3 className="text-3xl font-semibold tracking-[-1px] mt-1">Find your scene</h3>
                </div>
                <button onClick={() => setShowShotsModal(false)} className="btn btn-ghost p-2" aria-label="Close shots modal">
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search shots"
                    className="w-full bg-[#171717] border border-[#262626] rounded-xl pl-9 pr-3 py-2.5 text-sm focus:border-[#3b82f6] outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition ${
                        activeCategory === category
                          ? 'bg-[#3b82f6]/20 border-[#3b82f6] text-white'
                          : 'bg-[#111113] border-[#2a2a2d] text-[#a1a1aa] hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-auto pr-1 max-h-[58vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredShots.map((shot) => (
                    <button
                      type="button"
                      key={shot.id}
                      onClick={openWizard}
                      className="text-left shot-card focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                    >
                      <img src={shot.thumbnail} alt={shot.name} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                        <div className="font-semibold tracking-tight">{shot.name}</div>
                        <div className="text-sm text-[#d4d4d8] mt-0.5 line-clamp-1">{shot.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {filteredShots.length === 0 && <div className="text-center py-14 text-[#71717a] text-sm">No matching shots found.</div>}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHowItWorks && (
          <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/90 p-6" onClick={() => setShowHowItWorks(false)}>
            <div className="max-w-2xl w-full glass rounded-3xl p-10" onClick={(e) => e.stopPropagation()}>
              <div className="text-5xl tracking-[-1.5px] font-semibold mb-10">How make-gvids works</div>
              <div className="space-y-9 text-[17px]">
                {[
                  ['1. Upload your subject', '1–3 high-quality photos. Different angles = dramatically better consistency.'],
                  ['2. Dress & stage', 'Pick an outfit and a cinematic scene for your performer.'],
                  ['3. Add your audio', 'Drop a track and choose a 10s or 15s section for the performance.'],
                  ['4. Animate', 'make-gvids composes the still and animates a lip-synced clip.'],
                ].map(([title, desc], i) => (
                  <div key={i} className="flex gap-6">
                    <div className="font-mono text-[#3b82f6] text-sm pt-1 w-8 flex-shrink-0">{title.split('.')[0]}</div>
                    <div>
                      <div className="font-medium mb-1">{title.split('. ')[1]}</div>
                      <div className="text-[#a1a1aa] leading-snug">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => { setShowHowItWorks(false); setShowCreate(true); }} className="btn btn-primary mt-10 w-full py-4 rounded-2xl text-base">Start your first clip</button>
            </div>
          </div>
        )}
      </AnimatePresence>

      <div className={`fixed right-5 bottom-5 z-[95] ${showCreate ? 'opacity-30 pointer-events-none' : ''}`}>
        {showTweaks ? (
          <div className="glass rounded-2xl w-[280px] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">Production Tweaks</div>
              <button type="button" onClick={() => setShowTweaks(false)} className="text-[#a1a1aa] hover:text-white" aria-label="Close tweaks">
                <X size={14} />
              </button>
            </div>

            <label className="block text-xs text-[#a1a1aa] mb-1">Accent</label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {Object.keys(accentVariants).map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => updateTweaks({ accent: color })}
                  className={`h-8 rounded-md border ${tweaks.accent === color ? 'border-white' : 'border-white/15'}`}
                  style={{ background: color }}
                  aria-label={`Set accent ${color}`}
                />
              ))}
            </div>

            <label className="block text-xs text-[#a1a1aa] mb-1">Density</label>
            <select
              value={tweaks.density}
              onChange={(e) => updateTweaks({ density: e.target.value as DesignTweaks['density'] })}
              className="w-full mb-3 bg-[#171717] border border-[#2a2a2d] rounded-md px-2 py-2 text-sm"
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>

            <label className="block text-xs text-[#a1a1aa] mb-1">Contrast</label>
            <select
              value={tweaks.contrast}
              onChange={(e) => updateTweaks({ contrast: e.target.value as DesignTweaks['contrast'] })}
              className="w-full mb-4 bg-[#171717] border border-[#2a2a2d] rounded-md px-2 py-2 text-sm"
            >
              <option value="balanced">Balanced</option>
              <option value="high">High</option>
            </select>

            <button type="button" onClick={resetTweaks} className="btn btn-ghost w-full text-xs py-2">Reset</button>
          </div>
        ) : (
          <button type="button" onClick={() => setShowTweaks(true)} className="btn btn-secondary px-4 py-2 text-xs rounded-full inline-flex items-center gap-2">
            <SlidersHorizontal size={14} /> Tweaks
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
