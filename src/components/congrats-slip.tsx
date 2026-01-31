import { useRef } from "react";
import { Trophy, PartyPopper, Star, Printer } from 'lucide-react';

interface CongratsSlipProps {
    shareRef: React.RefObject<HTMLDivElement | null>;
    selectedUser: any;
}

export const CongratsSlip = ({ shareRef, selectedUser }: CongratsSlipProps) => {
    return (
        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-0 bg-zinc-900/50">
            <div className="min-w-fit w-full flex justify-center py-10">
                <div
                    ref={shareRef}
                    style={{
                        width: '800px',
                        minWidth: '800px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #fffbf0 100%)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    className="p-12 space-y-10 text-zinc-950 flex-shrink-0 rounded-p shadow-2xl"
                >
                    {/* Golden Decorative Elements */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-100 rounded-full opacity-50 blur-3xl animate-pulse" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-50 rounded-full opacity-50 blur-3xl animate-pulse" />

                    {/* Confetti Decors (Simulated with div stars) */}
                    <Star className="absolute top-10 right-20 text-amber-400 opacity-30 animate-bounce" size={24} />
                    <Star className="absolute bottom-20 left-10 text-amber-500 opacity-20 animate-spin" size={16} />
                    <PartyPopper className="absolute top-1/2 -right-4 text-amber-600 opacity-10" size={120} />

                    {/* Branded Header */}
                    <div className="flex justify-between items-start border-b-2 border-amber-100 pb-8 relative z-10">
                        <div className="space-y-1">
                            <h2 className="text-4xl font-display font-black text-amber-700 tracking-tighter flex items-center gap-2">
                                <Trophy size={40} className="text-amber-500" />
                                ยินดีด้วยค่ะ!
                            </h2>
                            <div className="flex items-center gap-2 text-zinc-400 font-bold">
                                <Printer size={16} />
                                <span className="text-xs uppercase tracking-widest font-friendly">ระบบสรุปยอดรางวัลอัตโนมัติ</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-amber-600/50 uppercase tracking-widest mb-1">บริการแจ้งผลรางวัลยอดเฮง</p>
                            <p className="text-2xl font-black text-zinc-950 font-display">{new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="text-center space-y-10 relative z-10">
                        <div className="space-y-2">
                            <p className="text-lg font-bold text-amber-600 uppercase tracking-[0.3em] font-display">สุดยอดความเฮง! ขอแสดงความยินดีกับคุณ</p>
                            <h1 className="text-7xl font-black text-zinc-900 tracking-tight font-display drop-shadow-sm">
                                {selectedUser?.name}
                            </h1>
                        </div>

                        <div className="relative inline-block px-20 py-8">
                            <div className="absolute inset-0 bg-amber-500 transform -skew-x-12 rounded-[2rem] shadow-2xl shadow-amber-500/40" />
                            <h2 className="relative text-6xl font-black text-white font-display tracking-widest animate-bounce">
                                คุณถูกรางวัล!
                            </h2>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm border-2 border-amber-100 rounded-[3rem] p-12 shadow-inner space-y-10">
                            {/* Detailed Win List */}
                            <div className="space-y-5">
                                <div className="grid grid-cols-3 px-6 py-2 text-xs font-black text-amber-700 uppercase tracking-widest border-b-2 border-amber-200">
                                    <div>หมายเลขที่ถูก</div>
                                    <div className="text-center">ประเภท</div>
                                    <div className="text-right">รางวัลที่ได้</div>
                                </div>
                                <div className="space-y-3">
                                    {selectedUser?.details?.map((detail: any, idx: number) => (
                                        <div key={idx} className="grid grid-cols-3 px-6 py-4 bg-white/50 rounded-2xl items-center border border-amber-100 shadow-sm">
                                            <div className="text-3xl font-black text-zinc-900 font-display">{detail.number}</div>
                                            <div className="text-base font-bold text-zinc-500 text-center italic">{detail.buyAmountLabel}</div>
                                            <div className="text-2xl font-black text-amber-600 text-right font-display">
                                                {detail.rewardPrice?.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Overall Summary */}
                            <div className="grid grid-cols-2 gap-10 pt-10 border-t-2 border-amber-100">
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest font-friendly">จำนวนที่ถูกรางวัล</p>
                                    <p className="text-5xl font-black text-zinc-900 font-display">
                                        {selectedUser?.details?.length || 0} <span className="text-xl text-zinc-400 font-bold uppercase">รายการ</span>
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-amber-600 uppercase tracking-widest font-friendly">ยอดเงินรางวัลรวมทั้งสิ้น</p>
                                    <p className="text-6xl font-black text-emerald-600 font-display drop-shadow-sm">
                                        {selectedUser?.rewardPrice?.toLocaleString()} <span className="text-xl text-zinc-400 font-bold">บาท</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Blessing */}
                    <div className="pt-10 border-t-2 border-amber-100 space-y-6 relative z-10">
                        <div className="flex justify-center items-center gap-8">
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-amber-300" />
                            <p className="text-3xl font-bold italic text-amber-700 font-friendly px-6">
                                " เฮงๆ รวยๆ ปังๆ ยิ่งขึ้นไปนะคะ "
                            </p>
                            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-amber-300" />
                        </div>

                        <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-widest px-4">
                            <p>ขอบคุณที่ใช้บริการกับเราค่ะ</p>
                            <p>ขอให้โชคดี ถูกรางวัลตลอดไปนะคะ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
