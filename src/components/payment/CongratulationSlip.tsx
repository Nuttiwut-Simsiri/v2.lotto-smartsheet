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
        <div className="bg-white font-sans">
            <div className="w-fit mx-auto">
                <div
                    ref={shareRef}
                    style={{
                        width: '760px',
                        minWidth: '760px',
                        backgroundColor: '#ffffff'
                    }}
                    className="p-16 space-y-12 text-[#1e293b] flex-shrink-0 relative shadow-2xl"
                >
                    {/* ขอบตกแต่งด้านบน - สีทองหรูหรา */}
                    <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700" />

                    {/* ส่วนหัว: แสดงความยินดีและวันที่ */}
                    <div className="flex justify-between items-start border-b-2 border-amber-50/50 pb-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-[#d97706]">
                                <div className="p-3 bg-amber-50 rounded-2xl shadow-sm">
                                    <Trophy size={36} className="drop-shadow-sm" />
                                </div>
                                <span className="text-sm font-black tracking-[0.3em] uppercase opacity-80">PRIZE STATUS</span>
                            </div>
                            <h2 className="text-5xl font-black text-[#78350f] tracking-tight leading-tight drop-shadow-sm">ขอแสดงความยินดี!</h2>
                        </div>
                        <div className="text-right space-y-3">
                            <div className="flex items-center justify-end gap-2 text-amber-600/40">
                                <Calendar size={18} />
                                <span className="text-xs font-black uppercase tracking-widest">วันที่ออกรางวัล</span>
                            </div>
                            <p className="text-xl font-black text-[#78350f]">{formattedDate}</p>
                            <div className="flex justify-end gap-2">
                                {[1, 2, 3].map((i) => (
                                    <Star key={i} size={18} className="fill-amber-400 text-amber-400 drop-shadow-sm" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* การ์ดข้อมูลผู้โชคดี */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="p-10 bg-amber-50/40 border border-amber-100/50 rounded-[3rem] space-y-4 flex flex-col justify-center min-h-[220px]">
                            <div className="flex items-center gap-2 text-amber-600/60">
                                <User size={20} />
                                <span className="text-xs font-black uppercase tracking-widest">คุณลูกค้าผู้โชคดี</span>
                            </div>
                            <h1 className="text-3xl font-black text-[#78350f] leading-tight break-words pr-4">
                                {selectedUser?.name}
                            </h1>
                        </div>
                        <div className="p-10 bg-gradient-to-br from-[#d97706] to-[#b45309] border border-amber-700 rounded-[3rem] space-y-4 text-white shadow-2xl shadow-amber-600/30 flex flex-col justify-center items-center min-h-[220px]">
                            <div className="flex items-center gap-2 opacity-80">
                                <Star size={20} />
                                <span className="text-xs font-black uppercase tracking-widest">WINNING STATUS</span>
                            </div>
                            <p className="text-4xl font-black tracking-tight drop-shadow-md">ถูกรางวัล!</p>
                        </div>
                    </div>

                    {/* ตารางรายละเอียดรางวัล */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-[1.5fr_1.5fr_1fr] px-12 py-7 bg-[#78350f] text-white rounded-[2.5rem] shadow-xl">
                            {["หมายเลขที่ถูก", "ประเภทการซื้อ", "เงินรางวัล"].map((h, i) => (
                                <div key={h} className={`text-sm font-black tracking-widest uppercase ${i === 0 ? 'text-left' : i === 2 ? 'text-right' : 'text-center'}`}>
                                    {h}
                                </div>
                            ))}
                        </div>
                        <div className="divide-y divide-amber-100/30 px-4">
                            {selectedUser?.details?.map((detail: any, idx: number) => (
                                <div key={idx} className="grid grid-cols-[1.5fr_1.5fr_1fr] py-10 items-center">
                                    <div className="font-mono text-[#0f172a] font-black text-6xl tracking-tighter">
                                        {detail.number}
                                    </div>
                                    <div className="text-center">
                                        <span className="px-8 py-3 bg-amber-50 text-amber-800 rounded-2xl font-black text-2xl border-2 border-amber-100/50 shadow-sm inline-block min-w-[160px]">
                                            {detail.buyAmountLabel}
                                        </span>
                                    </div>
                                    <div className="text-right font-black text-6xl text-[#78350f] tracking-tighter tabular-nums drop-shadow-sm">
                                        {detail.rewardPrice?.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* สรุปยอดเงินรางวัลรวม */}
                    <div className="mt-14 bg-gradient-to-br from-amber-50/80 to-white border-2 border-[#d97706]/60 p-14 rounded-[4rem] flex items-center justify-between relative overflow-hidden shadow-2xl shadow-amber-100/50">
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2 text-[#d97706]">
                                <Wallet size={28} />
                                <span className="text-sm font-black uppercase tracking-[0.4em] opacity-70">TOTAL REWARD</span>
                            </div>
                            <h3 className="text-2xl font-black text-[#78350f]">รวมเงินรางวัลทั้งสิ้น</h3>
                        </div>
                        <div className="relative z-10 text-right flex items-baseline gap-6">
                            <span className="text-[6rem] font-black text-[#d97706] tracking-tighter tabular-nums drop-shadow-md leading-none">
                                {selectedUser?.rewardPrice?.toLocaleString()}
                            </span>
                            <span className="text-2xl font-black text-[#78350f] opacity-80">บาท</span>
                        </div>
                        {/* ของตกแต่งแบบ Soft Blur */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/20 rounded-full -mr-40 -mt-40 blur-[80px]" />
                        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-300/10 rounded-full -ml-30 -mb-30 blur-[60px]" />
                    </div>

                    {/* ท้ายสลิปและคำอวยพร */}
                    <div className="pt-20 pb-6 flex flex-col items-center gap-12 text-center">
                        <div className="flex items-center gap-4 text-[#d97706] font-black scale-125 drop-shadow-sm">
                            <CheckCircle size={36} />
                            <span className="text-2xl tracking-tight">ได้รับโชคใหญ่ เฮงปังที่สุดค่ะ!</span>
                        </div>
                        <div className="space-y-5 max-w-2xl px-6">
                            <p className="text-2xl font-bold text-[#78350f] leading-relaxed italic opacity-90">
                                " ขอให้ท่านมีความสุขและโชคดี ถูกรางวัลใหญ่ในทุกๆ งวดนะคะ "
                            </p>
                            <p className="text-xl font-black text-amber-500/60 tracking-[0.4em] uppercase">
                                — ขอบพระคุณที่อุดหนุนค่ะ ✨ —
                            </p>
                        </div>
                        <div className="w-48 h-2 bg-gradient-to-r from-transparent via-amber-200 to-transparent rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};
