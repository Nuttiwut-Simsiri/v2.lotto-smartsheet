import { useRef } from "react";
import { Trophy, Calendar, User, Star, CheckCircle, Wallet } from 'lucide-react';

interface CongratulationSlipProps {
    selectedUser: any;
    shareRef: React.RefObject<HTMLDivElement | null>;

}

export const CongratulationSlip = ({ selectedUser, shareRef }: CongratulationSlipProps) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-zinc-100 font-sans p-4">
            <div className="w-fit mx-auto">
                <div
                    ref={shareRef}
                    style={{
                        width: '760px',
                        minWidth: '760px',
                        backgroundColor: '#ae0001', // Imperial Red
                        backgroundImage: `radial-gradient(#900000 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }}
                    className="p-16 space-y-12 text-white flex-shrink-0 relative overflow-hidden border-8 border-[#d4af37]"
                >
                    {/* Chinese Corner Ornaments - Solid Borders for perfect rendering */}
                    <div className="absolute top-0 left-0 w-24 h-24 border-l-[12px] border-t-[12px] border-[#d4af37] m-4" />
                    <div className="absolute top-0 right-0 w-24 h-24 border-r-[12px] border-t-[12px] border-[#d4af37] m-4" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 border-l-[12px] border-b-[12px] border-[#d4af37] m-4" />
                    <div className="absolute bottom-0 right-0 w-24 h-24 border-r-[12px] border-b-[12px] border-[#d4af37] m-4" />

                    {/* Header */}
                    <div className="flex justify-between items-center border-b-4 border-[#d4af37]/30 pb-12 relative z-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-[#d4af37]">
                                <div className="p-4 bg-red-950 border-2 border-[#d4af37] rounded-full">
                                    <Trophy size={48} />
                                </div>
                                <div>
                                    <p className="text-md font-black tracking-[0.5em] uppercase text-amber-200/80">LUCKY WINNER</p>
                                    <h2 className="text-6xl font-black text-[#d4af37] tracking-tight leading-none mt-1">ยินดีด้วยค่ะ!</h2>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-amber-200/70 text-sm font-bold uppercase tracking-widest mb-2">DRAW DATE • วันที่</p>
                            <p className="text-xl font-black text-white">{formattedDate}</p>
                            <div className="flex justify-end gap-1 mt-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} size={24} className="fill-[#d4af37] text-[#d4af37]" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* User Info & Status */}
                    <div className="grid grid-cols-2 gap-10 relative z-10">
                        <div className="p-10 bg-red-950/80 border-2 border-[#d4af37]/40 rounded-[2rem] flex flex-col justify-center">
                            <p className="text-[#d4af37] text-sm font-black tracking-widest uppercase mb-4">คุณลูกค้า</p>
                            <h1 className="text-4xl font-black text-white leading-tight break-words">
                                {selectedUser?.name}
                            </h1>
                        </div>
                        <div className="p-10 bg-[#d4af37] border-4 border-amber-600 rounded-[2rem] text-red-950 flex flex-col justify-center items-center">
                            <p className="text-4xl font-black tracking-tighter">ถูกรางวัล! </p>
                        </div>
                    </div>

                    {/* Prize Details Table */}
                    <div className="space-y-4 relative z-10">
                        <div className="grid grid-cols-[1.5fr_1.5fr_1fr] px-12 py-6 bg-red-950 border-b-4 border-[#d4af37] text-[#d4af37] rounded-t-3xl">
                            {["หมายเลขที่ถูก", "ประเภทการซื้อ", "เงินรางวัล"].map((h, i) => (
                                <div key={h} className={`text-sm font-black tracking-widest uppercase ${i === 0 ? 'text-left' : i === 2 ? 'text-right' : 'text-center'}`}>
                                    {h}
                                </div>
                            ))}
                        </div>
                        <div className="bg-red-900/40 rounded-b-3xl border-x-2 border-b-2 border-[#d4af37]/20 pb-4">
                            {selectedUser?.details?.map((detail: any, idx: number) => (
                                <div key={idx} className="grid grid-cols-[1.5fr_1.5fr_1fr] px-12 py-10 items-center border-b border-[#d4af37]/10 last:border-0">
                                    <div className="font-mono text-[#d4af37] font-black text-4xl tracking-tighter">
                                        {detail.number}
                                    </div>
                                    <div className="text-center">
                                        <span className="px-8 py-3 bg-[#be123c] text-white rounded-full font-black text-2xl border-2 border-[#d4af37]/30">
                                            {detail.buyAmountLabel}
                                        </span>
                                    </div>
                                    <div className="text-right font-black text-4xl text-white tracking-tighter tabular-nums">
                                        {detail.rewardPrice?.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Summary */}
                    <div className="mt-12 bg-gradient-to-r from-[#d4af37] via-[#fcd34d] to-[#d4af37] border-4 border-amber-700 p-12 rounded-[3rem] flex items-center justify-between relative">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-red-900">
                                <Wallet size={40} />
                                <span className="text-base font-black uppercase tracking-[0.4em]">TOTAL REWARD</span>
                            </div>
                            <h3 className="text-2xl font-black text-red-950">รวมเงินรางวัลทั้งสิ้น</h3>
                        </div>
                        <div className="text-right flex items-baseline gap-6 text-red-950">
                            <span className="text-[6rem] font-black tracking-tighter tabular-nums leading-none">
                                {selectedUser?.rewardPrice?.toLocaleString()}
                            </span>
                            <span className="text-xl font-black opacity-80">บาท</span>
                        </div>
                    </div>

                    {/* Footer Message */}
                    <div className="pt-12 pb-4 flex flex-col items-center gap-10 text-center relative z-10">
                        <div className="bg-red-950/50 px-12 py-6 rounded-full border-2 border-[#d4af37] border-dashed">
                            <span className="text-3xl font-black text-[#d4af37] tracking-tight">ได้รับโชคใหญ่ มั่งคั่ง ร่ำรวย ค่ะ! 🧧</span>
                        </div>
                        <div className="space-y-6 max-w-2xl">
                            <p className="text-base font-bold text-amber-100 leading-relaxed italic">
                                " ขอให้ท่านมีความสุขและโชคดี ถูกรางวัลใหญ่ในทุกๆ งวดนะคะ "
                            </p>
                            <p className="text-2xl font-black text-[#d4af37] uppercase opacity-80">
                                — ขอบพระคุณที่อุดหนุนค่ะ —
                            </p>
                        </div>
                        <div className="w-80 h-2 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};
