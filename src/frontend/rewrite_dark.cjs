const fs = require('fs');
const path = require('path');

const communityPagePath = path.join(__dirname, 'src', 'pages', 'matchpro', 'MatchProCommunityPage.jsx');
const leaderboardPagePath = path.join(__dirname, 'src', 'pages', 'matchpro', 'MatchProLeaderboardPage.jsx');
const leaderboardCssPath = path.join(__dirname, 'src', 'pages', 'matchpro', 'MatchProLeaderboardPage.css');
const createMatchPagePath = path.join(__dirname, 'src', 'pages', 'matches', 'CreateMatchPage.jsx');

// ================= COMMUNITY PAGE =================
let comm = fs.readFileSync(communityPagePath, 'utf8');

// Imports
comm = comm.replace(`import { gsap } from 'gsap'`, `import { gsap } from 'gsap'\nimport { Users, Trophy, Swords, Heart, MessageCircle, Share2, Calendar, MapPin, Camera, Sparkles, MessageSquare, Flame } from 'lucide-react'`);

// Objects
comm = comm.replace(/icon: '🏸'/g, `icon: <Swords size={24} />`);
comm = comm.replace(/icon: '🏓'/g, `icon: <Swords size={24} className="text-green-400" />`);
comm = comm.replace(/icon: '🏆'/g, `icon: <Trophy size={24} className="text-yellow-400" />`);
comm = comm.replace(/icon: '⚡'/g, `icon: <Sparkles size={24} className="text-blue-400" />`);
comm = comm.replace(/icon: '🌟'/g, `icon: <Sparkles size={24} className="text-purple-400" />`);

// JSX Text
comm = comm.replace(/👥 Community Hub/g, `<Users size={32} className="inline mr-2 text-[#5E6AD2]" /> Community Hub`);
comm = comm.replace(/>🏸</g, `><Swords size={120} className="text-white/5" /><`);
comm = comm.replace(/📷/g, `<Camera size={20} className="text-gray-400" />`);
comm = comm.replace(/📍/g, `<MapPin size={20} className="text-gray-400" />`);
comm = comm.replace(/>❤️</g, `><Heart size={16} fill="currentColor" className="text-red-500" /><`);
comm = comm.replace(/>🤍</g, `><Heart size={16} className="text-gray-400" /><`);
comm = comm.replace(/>💬</g, `><MessageCircle size={16} /><`);
comm = comm.replace(/>↗️ Chia sẻ/g, `><Share2 size={16} /> Chia sẻ`);
comm = comm.replace(/📅/g, `<Calendar size={14} className="inline mr-1" />`);
comm = comm.replace(/👥 /g, `<Users size={14} className="inline mr-1" /> `);
comm = comm.replace(/🏆 Giải thưởng:/g, `<Trophy size={14} className="inline mr-1 text-yellow-500" /> Giải thưởng:`);
comm = comm.replace(/🎁 /g, ``);
comm = comm.replace(/🔥 Chủ đề thịnh hành/g, `<Flame size={20} className="inline mr-2 text-orange-500" /> Chủ đề thịnh hành`);
comm = comm.replace(/👥 Gợi ý kết bạn/g, `<Users size={20} className="inline mr-2 text-[#5E6AD2]" /> Gợi ý kết bạn`);
comm = comm.replace(/<svg width="14".*?<\/svg>/g, `<MessageSquare size={14} />`);

// Colors
comm = comm.replace(/text-\[#0F172A\]/g, 'text-white');
comm = comm.replace(/bg-white/g, 'card-base');
comm = comm.replace(/bg-slate-50/g, 'bg-white/5');
comm = comm.replace(/bg-slate-100/g, 'bg-white/10');
comm = comm.replace(/border-\[#e0ecf0\]/g, 'border-white/10');
comm = comm.replace(/border-slate-100/g, 'border-white/10');
comm = comm.replace(/border-slate-200\/60/g, 'border-white/10');
comm = comm.replace(/border-slate-200/g, 'border-white/10');
comm = comm.replace(/text-slate-400/g, 'text-gray-400');
comm = comm.replace(/text-slate-500/g, 'text-gray-400');
comm = comm.replace(/text-slate-600/g, 'text-gray-400');
comm = comm.replace(/text-slate-700/g, 'text-gray-300');
comm = comm.replace(/bg-\[#f8fafc\]/g, 'bg-[#0a0a0c]');
comm = comm.replace(/#14B8A6/g, '#5E6AD2');
comm = comm.replace(/#0D9488/g, '#6872D9');
comm = comm.replace(/from-\[#0F172A\] to-\[#0a4d5c\]/g, 'from-[#5E6AD2]/20 to-[#020203]');
comm = comm.replace(/hover:bg-slate-50/g, 'hover:bg-white/10');
comm = comm.replace(/hover:bg-slate-100/g, 'hover:bg-white/20');
comm = comm.replace(/bg-red-50 text-red-500/g, 'bg-red-500/20 text-red-500');
comm = comm.replace(/shadow-sm/g, 'shadow-[0_0_15px_rgba(0,0,0,0.3)]');
comm = comm.replace(/text-black/g, 'text-white');
comm = comm.replace(/bg-amber-50/g, 'bg-amber-500/20');
comm = comm.replace(/border-amber-100/g, 'border-amber-500/20');
comm = comm.replace(/hover:border-red-200/g, 'hover:border-red-500/50');
comm = comm.replace(/hover:bg-red-50/g, 'hover:bg-red-500/20');

fs.writeFileSync(communityPagePath, comm);

// ================= LEADERBOARD CSS =================
let lbCss = fs.readFileSync(leaderboardCssPath, 'utf8');
lbCss = lbCss.replace(/#0F172A/g, 'white');
lbCss = lbCss.replace(/#14B8A6/g, '#5E6AD2');
lbCss = lbCss.replace(/background: white/g, 'background: rgba(255, 255, 255, 0.03);\n  backdrop-filter: blur(10px);');
lbCss = lbCss.replace(/border: 1.5px solid #e0ecf0;/g, 'border: 1px solid rgba(255,255,255,0.1);');
lbCss = lbCss.replace(/border: 1px solid #e0ecf0;/g, 'border: 1px solid rgba(255,255,255,0.1);');
lbCss = lbCss.replace(/border-bottom: 1px solid #e0ecf0;/g, 'border-bottom: 1px solid rgba(255,255,255,0.1);');
lbCss = lbCss.replace(/border-bottom: 1px solid #f0f5f9;/g, 'border-bottom: 1px solid rgba(255,255,255,0.05);');
lbCss = lbCss.replace(/#64748b/g, '#9ca3af');
lbCss = lbCss.replace(/#94a3b8/g, '#6b7280');
lbCss = lbCss.replace(/background: #f8fafc;/g, 'background: rgba(0,0,0,0.3);');
lbCss = lbCss.replace(/background: #fafcfd;/g, 'background: rgba(255,255,255,0.02);');
lbCss = lbCss.replace(/rgba\(13,138,138/g, 'rgba(94,106,210');
lbCss = lbCss.replace(/#0fc8b5/g, '#6872D9');
lbCss = lbCss.replace(/border: 3px solid #e0ecf0/g, 'border: 3px solid #333');
lbCss = lbCss.replace(/color: #0F172A;/g, 'color: white;');
fs.writeFileSync(leaderboardCssPath, lbCss);

// ================= LEADERBOARD JSX =================
let lbJsx = fs.readFileSync(leaderboardPagePath, 'utf8');
lbJsx = lbJsx.replace(/#14B8A6/g, '#5E6AD2');
lbJsx = lbJsx.replace(/🏆/g, '');
lbJsx = lbJsx.replace(/🥇/g, '');
lbJsx = lbJsx.replace(/🥈/g, '');
lbJsx = lbJsx.replace(/🥉/g, '');
lbJsx = lbJsx.replace(/👑/g, '');
fs.writeFileSync(leaderboardPagePath, lbJsx);

// ================= CREATE MATCH JSX =================
let cm = fs.readFileSync(createMatchPagePath, 'utf8');
cm = cm.replace(/theme="light"/g, 'theme="dark"');
cm = cm.replace(/variant="light"/g, 'variant="dark"');
cm = cm.replace(/bg-\[#f5f9fb\]/g, 'bg-[#020203]');
cm = cm.replace(/text-slate-900/g, 'text-white');
cm = cm.replace(/text-slate-700/g, 'text-gray-300');
cm = cm.replace(/text-slate-500/g, 'text-gray-400');
cm = cm.replace(/text-slate-600/g, 'text-gray-400');
cm = cm.replace(/text-slate-400/g, 'text-gray-500');
cm = cm.replace(/bg-white/g, 'card-base !p-0');
cm = cm.replace(/border-slate-100/g, 'border-white/10');
cm = cm.replace(/border-slate-200/g, 'border-white/10');
cm = cm.replace(/bg-slate-50\/50/g, 'bg-white/5');
cm = cm.replace(/bg-slate-50/g, 'bg-white/5');
cm = cm.replace(/bg-slate-100/g, 'bg-white/10');
cm = cm.replace(/bg-slate-200/g, 'bg-white/20');
cm = cm.replace(/#14B8A6/g, '#5E6AD2');
cm = cm.replace(/#0D9488/g, '#6872D9');
cm = cm.replace(/#00897b/g, '#fff');
cm = cm.replace(/text-blue-800/g, 'text-blue-300');
cm = cm.replace(/bg-blue-50/g, 'bg-blue-500/10');
cm = cm.replace(/border-blue-100/g, 'border-blue-500/20');
cm = cm.replace(/text-\[#00897b\]/g, 'text-white');
fs.writeFileSync(createMatchPagePath, cm);

console.log("Rewrite complete.");
