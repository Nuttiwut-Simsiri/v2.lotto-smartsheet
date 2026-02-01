import { useRef } from "react";
import { Trophy, Calendar, User, Star, CheckCircle, Wallet } from 'lucide-react';

interface CongratulationSlipProps {
    selectedUser: any;
}

export const CongratulationSlip = ({ selectedUser }: CongratulationSlipProps) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-0 bg-slate-50 font-sans">
            <div className="min-w-fit w-full flex justify-center py-16">
                <div
                    ref={useRef(null)}
                    style={{
                        width: '760px',
                        minWidth: '760px',
                        backgroundColor: '#ffffff'
                    }}
                    className="p-16 space-y-12 text-[#1e293b] flex-shrink-0 relative border border-amber-100"
                >
                    {/* ขอบตกแต่งด้านบน - สีทองหรูหรา */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-[#d97706]" />

                    {/* ส่วนหัว: แสดงความยินดีและวันที่ */}
                    <div className="flex justify-between items-start border-b-2 border-amber-50 pb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-[#d97706]">
                                <Trophy size={28} />
                                <span className="text-sm font-black tracking-tight uppercase">สถานะรางวัล</span>
                            </div>
                            <h2 className="text-5xl font-black text-[#78350f] tracking-tight">ขอแสดงความยินดี!</h2>
                        </div>
                        <div className="text-right space-y-2">
                            <div className="flex items-center justify-end gap-2 text-amber-600/50">
                                <Calendar size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">วันที่ออกรางวัล</span>
                            </div>
                            <p className="text-xl font-black text-[#78350f]">{formattedDate}</p>
                            <div className="flex justify-end gap-1">
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                            </div>
                        </div>
                    </div>

                    {/* การ์ดข้อมูลผู้โชคดี */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-10 bg-amber-50/30 border border-amber-100 rounded-[2.5rem] space-y-2">
                            <div className="flex items-center gap-2 text-amber-600/60">
                                <User size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">คุณลูกค้าผู้โชคดี</span>
                            </div>
                            <h1 className="text-5xl font-black text-[#78350f] truncate">{selectedUser?.name}</h1>
                        </div>
                        <div className="p-10 bg-amber-600 border border-amber-700 rounded-[2.5rem] space-y-2 text-white shadow-lg shadow-amber-600/20">
                            <div className="flex items-center gap-2 opacity-80">
                                <Star size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">สถานะรางวัล</span>
                            </div>
                            <p className="text-4xl font-black text-center">ถูกรางวัล!</p>
                        </div>
                    </div>

                    {/* ตารางรายละเอียดรางวัล */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 px-10 py-5 bg-[#78350f] text-white rounded-2xl">
                            {["หมายเลขที่ถูก", "ประเภทการซื้อ", "เงินรางวัล (บาท)"].map((h, i) => (
                                <div key={h} className={`text-xs font-black tracking-wide ${i === 0 ? 'text-left' : i === 2 ? 'text-right' : 'text-center'}`}>
                                    {h}
                                </div>
                            ))}
                        </div>
                        <div className="space-y-1">
                            {selectedUser?.details?.map((detail: any, idx: number) => (
                                <div key={idx} className="grid grid-cols-3 px-10 py-7 items-center border-b border-amber-50">
                                    <div className="font-mono text-[#0f172a] font-black text-4xl tracking-tighter">
                                        {detail.number}
                                    </div>
                                    <div className="text-center font-bold text-xl text-amber-600/70">{detail.buyAmountLabel}</div>
                                    <div className="text-right font-black text-4xl text-[#78350f]">
                                        {detail.rewardPrice?.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* สรุปยอดเงินรางวัลรวม */}
                    <div className="mt-8 bg-amber-50/50 border-2 border-[#d97706] p-12 rounded-[3rem] flex items-center justify-between relative overflow-hidden">
                        <div className="relative z-10 space-y-2">
                            <div className="flex items-center gap-2 text-[#d97706]">
                                <Wallet size={20} />
                                <span className="text-sm font-black uppercase tracking-[0.2em]">สรุปยอดรับเงิน</span>
                            </div>
                            <h3 className="text-2xl font-black text-[#78350f]">รวมเงินรางวัลทั้งสิ้น</h3>
                        </div>
                        <div className="relative z-10 text-right">
                            <span className="text-8xl font-black text-[#d97706] tracking-tighter whitespace-nowrap">
                                {selectedUser?.rewardPrice?.toLocaleString()}
                            </span>
                            <span className="text-3xl font-black text-[#d97706] ml-4">บาท</span>
                        </div>
                        {/* ของตกแต่งแบบเรียบ (Render ปลอดภัย) */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/30 rounded-full -mr-16 -mt-16" />
                    </div>

                    {/* ท้ายสลิปและคำอวยพร */}
                    <div className="pt-20 pb-4 flex flex-col items-center gap-8 text-center">
                        <div className="flex items-center gap-2 text-[#d97706] font-black">
                            <CheckCircle size={28} />
                            <span className="text-2xl tracking-tight">ได้รับโชคใหญ่ เฮงปังที่สุดค่ะ!</span>
                        </div>
                        <div className="space-y-3">
                            <p className="text-lg font-bold text-[#78350f] leading-relaxed">
                                " ขอให้ท่านมีความสุขและโชคดี ถูกรางวัลใหญ่ในทุกๆ งวดนะคะ "
                            </p>
                            <p className="text-sm font-bold text-amber-400 italic">
                                ขอบพระคุณที่อุดหนุนค่ะ ✨
                            </p>
                        </div>
                        <div className="w-24 h-1 bg-amber-50 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};
