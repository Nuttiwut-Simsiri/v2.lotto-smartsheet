"use client"
import { signIn } from "next-auth/react"
import { Trophy, ShieldCheck, Fingerprint, Cpu, Zap, Activity, Monitor } from "lucide-react"

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-cyan-500/30 text-white">
            {/* --- ULTRA-DARK STEALTH SCI-FI BACKGROUND --- */}

            {/* 1. Deep Space Vibe */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#001a1a_0%,#050505_70%)] opacity-40" />

            {/* 2. Micro-Grid (More subtle) */}
            <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage: `linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                    perspective: '1000px',
                    transform: 'rotateX(60deg) translateY(-30%) scale(2)',
                }}
            />

            {/* 3. Horizontal Scanner (Subtle) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                <div className="w-full h-1 bg-cyan-400 absolute top-[-10%] animate-[scan_12s_linear_infinite] blur-[1px]" />
            </div>

            {/* 4. Peripheral Glows (Darker) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/[0.03] blur-[180px] rounded-full" />

            {/* --- MAIN INTERFACE (HUD Panel) --- */}
            <div className="w-full max-w-lg relative z-10 scale-95 sm:scale-100">

                {/* HUD Ornamental Frame */}
                <div className="absolute -top-6 -left-6 w-16 h-16 border-t-2 border-l-2 border-zinc-800 rounded-tl-xl" />
                <div className="absolute -top-6 -right-6 w-16 h-16 border-t-2 border-r-2 border-zinc-800 rounded-tr-xl" />
                <div className="absolute -bottom-6 -left-6 w-16 h-16 border-b-2 border-l-2 border-zinc-800 rounded-bl-xl" />
                <div className="absolute -bottom-6 -right-6 w-16 h-16 border-b-2 border-r-2 border-zinc-800 rounded-tr-xl" />

                {/* Main Panel */}
                <div className="bg-black/60 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-12 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative group">

                    {/* Stealth Accents */}
                    <div className="absolute top-4 right-6 flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                    </div>

                    <div className="flex flex-col items-center text-center space-y-12">

                        {/* Central Core Icon */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
                            <div className="relative w-28 h-28 bg-zinc-950 border border-zinc-800 rounded-[2.5rem] flex items-center justify-center transform rotate-45 group-hover:rotate-[135deg] transition-all duration-1000">
                                <div className="-rotate-45 group-hover:-rotate-[135deg] transition-all duration-1000">
                                    <Cpu className="text-cyan-500" size={42} strokeWidth={1} />
                                </div>
                            </div>
                            {/* Scanning Line on Icon */}
                            <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] rotate-45">
                                <div className="w-full h-1 bg-cyan-400/30 absolute animate-[scan_3s_linear_infinite]" />
                            </div>
                        </div>

                        {/* Title Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-3">
                                <div className="h-[1px] w-6 bg-zinc-800" />
                                <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 font-bold">Encrypted Node</span>
                                <div className="h-[1px] w-6 bg-zinc-800" />
                            </div>

                            <h1 className="text-4xl font-black tracking-tighter uppercase">
                                LOTTO<span className="text-cyan-500 ml-1">SMART</span>
                                <div className="text-[10px] tracking-[1em] text-zinc-600 mt-1 font-mono">INTERFACE v2.0</div>
                            </h1>
                        </div>

                        {/* Login Action Area */}
                        <div className="w-full pt-4">
                            <button
                                onClick={() => signIn("google")}
                                className="w-full group/btn relative bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 px-8 py-6 rounded-2xl transition-all duration-500 overflow-hidden"
                            >
                                {/* Glowing corner icons for button */}
                                <Zap className="absolute top-2 left-2 text-zinc-800 group-hover/btn:text-cyan-500/50 transition-colors" size={12} />

                                <div className="flex items-center justify-center gap-6">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform duration-500">
                                        <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="google" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="uppercase tracking-[0.2em] text-xs font-black">Identity Verification</span>
                                        <span className="text-[10px] text-zinc-600 font-mono tracking-widest mt-0.5">VIA GOOGLE AUTH</span>
                                    </div>
                                </div>

                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            </button>
                        </div>

                        {/* Technical Specs Footer */}
                        <div className="pt-8 w-full">
                            <div className="flex justify-between items-center px-2 py-4 border-y border-zinc-900/50">
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-[8px] text-zinc-600 uppercase font-mono tracking-widest text-left">Security Link</span>
                                    <span className="text-[10px] text-zinc-400 font-bold">ESTABLISHED</span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[8px] text-zinc-600 uppercase font-mono tracking-widest text-right">Data Protocol</span>
                                    <span className="text-[10px] text-cyan-500 font-bold">AES-256-GCM</span>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-8">
                                <div className="flex items-center gap-2">
                                    <Fingerprint size={14} className="text-zinc-700" />
                                    <span className="text-[8px] text-zinc-600 uppercase tracking-widest">Active</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity size={14} className="text-cyan-500/50 animate-pulse" />
                                    <span className="text-[8px] text-zinc-600 uppercase tracking-widest">Live Sync</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Decorative Console Text */}
                <div className="mt-12 flex flex-col items-center gap-4 opacity-30 group-hover:opacity-50 transition-opacity duration-1000">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                    <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-[0.3em]">
                        [ Terminal Root Access: Unauthorized Attempts Re-routed to Cyber Command ]
                    </p>
                </div>
            </div>

            <style jsx global>{`
                @keyframes scan {
                    from { top: -100%; }
                    to { top: 200%; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
