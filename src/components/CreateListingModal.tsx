import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Flame,
  ShieldCheck,
  Lock,
  Upload,
  CheckCircle2,
  Video,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServerRegion } from '../types';

interface CreateListingModalProps {
  onClose: () => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({ onClose }) => {
  const { createListing, currentUser, t } = useApp();

  const [title, setTitle] = useState('');
  const [uid, setUid] = useState('');
  const [server, setServer] = useState<ServerRegion>('BD');
  const [level, setLevel] = useState<number>(72);
  const [rank, setRank] = useState('Heroic 3 Star');
  const [elitePasses, setElitePasses] = useState<number>(25);
  const [price, setPrice] = useState<number>(3500);
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Media
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Evo Guns
  const [evoGuns, setEvoGuns] = useState<{ name: string; level: number; maxLevel: number }[]>([
    { name: 'AK-47 Blue Flame Dragon', level: 7, maxLevel: 7 },
    { name: 'MP40 Cobra', level: 5, maxLevel: 7 }
  ]);
  const [newGunName, setNewGunName] = useState('M1887 Rapper Underworld');
  const [newGunLevel, setNewGunLevel] = useState(7);

  // Bundles & Characters
  const [bundles, setBundles] = useState<string[]>(['Sakura Season 1', 'Green Criminal']);
  const [newBundle, setNewBundle] = useState('');

  const [characters, setCharacters] = useState<string[]>(['Alok', 'Chrono', 'Homer', 'Tatsuya']);
  const [newCharacter, setNewCharacter] = useState('');

  // Credentials
  const [loginType, setLoginType] = useState<'Facebook' | 'Google' | 'VK' | 'Twitter'>('Facebook');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [backupCodes, setBackupCodes] = useState('');

  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAddImage = () => {
    if (newImageUrl.trim() && images.length < 10) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleAddGun = () => {
    if (newGunName.trim()) {
      setEvoGuns([...evoGuns, { name: newGunName.trim(), level: newGunLevel, maxLevel: 7 }]);
      setNewGunName('');
    }
  };

  const handleAddBundle = () => {
    if (newBundle.trim()) {
      setBundles([...bundles, newBundle.trim()]);
      setNewBundle('');
    }
  };

  const handleAddCharacter = () => {
    if (newCharacter.trim()) {
      setCharacters([...characters, newCharacter.trim()]);
      setNewCharacter('');
    }
  };

  // AI Free Fire Valuation Endpoint Integration
  const handleAiValuate = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          rank,
          evoGuns: evoGuns.map(g => `${g.name} (Lvl ${g.level})`),
          elitePasses,
          bundles,
          server
        })
      });

      const data = await res.json();
      if (data.success && data.evaluation) {
        const evalData = data.evaluation;
        if (evalData.suggestedTitle) setTitle(evalData.suggestedTitle);
        if (evalData.estimatedPriceBDT) setPrice(evalData.estimatedPriceBDT);
        if (evalData.suggestedDescription) setDescription(evalData.suggestedDescription);
      }
    } catch (err) {
      console.error("AI valuation failed:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !uid.trim()) {
      alert("Please provide account Title and UID!");
      return;
    }

    createListing({
      title,
      uid,
      server,
      level,
      rank,
      evoGuns,
      elitePasses,
      characters,
      bundles,
      images,
      videoUrl,
      price,
      description,
      sensitiveCredentials: {
        loginType,
        loginEmail: loginEmail || 'seller_account_details@gmail.com',
        loginPassword: loginPassword || 'Password123#',
        backupCodes
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-[#0F172A] border border-blue-900/90 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-white my-auto p-5 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-900/50 rounded-xl border border-blue-500/30">
              <Plus className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">List Free Fire Account</h3>
              <p className="text-xs text-slate-400">Escrow Protected Account Marketplace</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAiValuate}
              disabled={isAiLoading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-purple-400/40 hover:scale-105 transition cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>{isAiLoading ? 'Evaluating...' : 'AI Price & Title Generator'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase">Listing Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 🔥 Max Level 75 | 4 Evo Guns | Sakura Bundle Account"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase">Server</label>
              <select
                value={server}
                onChange={(e: any) => setServer(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono"
              >
                <option value="BD">BD Server</option>
                <option value="IN">India Server</option>
                <option value="SG">Singapore Server</option>
                <option value="NA">North America</option>
                <option value="EU">Europe</option>
              </select>
            </div>
          </div>

          {/* Account Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 font-mono uppercase block mb-1">UID</label>
              <input
                type="text"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder="1928471920"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 font-mono uppercase block mb-1">Level</label>
              <input
                type="number"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-400 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 font-mono uppercase block mb-1">Rank</label>
              <input
                type="text"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="Grandmaster"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 font-mono uppercase block mb-1">Price (BDT)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-black"
                required
              />
            </div>
          </div>

          {/* Evo Guns Builder */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-amber-400 font-mono uppercase flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-amber-400" /> Evo Guns
            </label>

            <div className="flex flex-wrap gap-2">
              {evoGuns.map((gun, idx) => (
                <span key={idx} className="bg-slate-900 border border-amber-500/40 text-amber-300 text-xs px-2.5 py-1 rounded-xl flex items-center gap-2 font-mono">
                  <span>{gun.name} (Lvl {gun.level})</span>
                  <button type="button" onClick={() => setEvoGuns(evoGuns.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newGunName}
                onChange={(e) => setNewGunName(e.target.value)}
                placeholder="Gun name e.g. M1014 Green Dragon"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              />
              <select
                value={newGunLevel}
                onChange={(e) => setNewGunLevel(Number(e.target.value))}
                className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-amber-300 font-mono"
              >
                {[1, 2, 3, 4, 5, 6, 7].map(lvl => (
                  <option key={lvl} value={lvl}>Lvl {lvl}</option>
                ))}
              </select>
              <button type="button" onClick={handleAddGun} className="bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer">
                Add
              </button>
            </div>
          </div>

          {/* Bundles & Characters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-cyan-400 font-mono uppercase block">Rare Outfits / Bundles</label>
              <div className="flex flex-wrap gap-1">
                {bundles.map((b, idx) => (
                  <span key={idx} className="bg-blue-950 text-cyan-300 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                    {b} <button type="button" onClick={() => setBundles(bundles.filter((_, i) => i !== idx))}>×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  value={newBundle}
                  onChange={(e) => setNewBundle(e.target.value)}
                  placeholder="e.g. Hip Hop"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                />
                <button type="button" onClick={handleAddBundle} className="bg-slate-800 text-cyan-300 text-xs px-2.5 py-1 rounded">Add</button>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-cyan-400 font-mono uppercase block">Characters</label>
              <div className="flex flex-wrap gap-1">
                {characters.map((c, idx) => (
                  <span key={idx} className="bg-slate-900 text-slate-300 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                    {c} <button type="button" onClick={() => setCharacters(characters.filter((_, i) => i !== idx))}>×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  value={newCharacter}
                  onChange={(e) => setNewCharacter(e.target.value)}
                  placeholder="e.g. Wukong"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                />
                <button type="button" onClick={handleAddCharacter} className="bg-slate-800 text-cyan-300 text-xs px-2.5 py-1 rounded">Add</button>
              </div>
            </div>
          </div>

          {/* Media Images & Video */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 font-mono uppercase flex items-center gap-1">
              <Upload className="w-3.5 h-3.5 text-cyan-400" /> Photos (Up to 10 photos)
            </label>

            <div className="flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-800 group">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute inset-0 bg-red-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste Image URL..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              />
              <button type="button" onClick={handleAddImage} className="bg-slate-800 text-cyan-300 text-xs px-3 py-1.5 rounded-xl cursor-pointer">
                Add Photo
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 font-mono uppercase">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide account highlights, skins, login info type, etc..."
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Encrypted Credentials Box */}
          <div className="bg-gradient-to-r from-blue-950/80 to-slate-900 border border-blue-700/60 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold text-xs">
              <Lock className="w-4 h-4" /> Sensitive Login Information (Escrow Encrypted)
            </div>
            <p className="text-[11px] text-slate-400">
              Hidden from buyers until payment is verified by Admin.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                value={loginType}
                onChange={(e: any) => setLoginType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Facebook">Facebook Bind</option>
                <option value="Google">Google Bind</option>
                <option value="VK">VK Bind</option>
              </select>

              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Login Email / Phone"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />

              <input
                type="text"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black py-3.5 rounded-2xl shadow-xl transition hover:scale-105 cursor-pointer uppercase font-mono text-sm"
          >
            Publish Free Fire Account Listing
          </button>
        </form>
      </div>
    </div>
  );
};
