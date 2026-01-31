import { Printer } from 'lucide-react';

interface SlipContentProps {
    shareRef: React.RefObject<HTMLDivElement | null>;
    selectedUser: any;
    categoryBreakdown: { top: number; tod: number; bot: number };
    showQRCode: boolean;
}

export const SlipContent = ({ shareRef, selectedUser, categoryBreakdown, showQRCode }: SlipContentProps) => {
    return (
        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-0 bg-white">
            <div className="min-w-fit w-full flex justify-center bg-white">
                <div
                    ref={shareRef}
                    style={{
                        width: '800px',
                        minWidth: '800px',
                        backgroundColor: '#ffffff'
                    }}
                    className="p-12 space-y-8 text-zinc-950 flex-shrink-0"
                >
                    {/* Branded Header for Image - Thai Design */}
                    <div className="flex justify-between items-start border-b-4 border-zinc-100 pb-8">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">ใบสรุปยอดซื้อขาย</h2>
                            <div className="flex items-center gap-2 text-zinc-400 font-bold">
                                <Printer size={16} />
                                <span className="text-xs uppercase tracking-widest">ระบบจดหวยอัตโนมัติ</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">วันที่ออกใบเสร็จ</p>
                            <p className="text-lg font-black text-zinc-950">{new Date().toLocaleDateString('th-TH')}</p>
                            <p className="text-xs font-bold text-zinc-400">{new Date().toLocaleTimeString('th-TH')} น.</p>
                        </div>
                    </div>

                    {/* Customer Section - Balanced Spacing */}
                    <div className="bg-zinc-50 rounded-[2rem] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-zinc-100">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">ชื่อลูกค้า</p>
                            <h1 className="text-4xl font-black text-blue-600 tracking-tight">{selectedUser?.name}</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">จำนวนรายการ</p>
                            <p className="text-3xl font-black text-zinc-900">{selectedUser?.details?.length || 0} รายการ</p>
                        </div>
                    </div>

                    {/* Numbers List - Responsive Design */}
                    <div className="space-y-6">
                        {selectedUser?.details?.length > 10 ? (
                            /* 2-Column Mode for Large Orders - Balanced */
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4 relative">
                                {/* Vertical Divider Line */}
                                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-300 -translate-x-1/2 hidden xs:block" />

                                {[0, 1].map((colIndex) => {
                                    const half = Math.ceil(selectedUser.details.length / 2);
                                    const colDetails = selectedUser.details.slice(colIndex * half, (colIndex + 1) * half);
                                    return (
                                        <div key={colIndex} className="space-y-3">
                                            <div className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr_1fr] px-4 py-2.5 bg-zinc-100 rounded-xl">
                                                {["เลข", "บน", "โต๊ด", "ล่าง", "รวม"].map(h => (
                                                    <div key={h} className="text-xl font-black text-zinc-700 text-center last:text-right first:text-left">{h}</div>
                                                ))}
                                            </div>
                                            <div className="space-y-2">
                                                {colDetails.map((order: any) => (
                                                    <div key={order.id} className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr_1fr] px-3 py-3 rounded-xl bg-white border border-zinc-100 shadow-sm items-center">
                                                        <div className="font-mono text-zinc-950 font-black text-xl flex items-center gap-1">
                                                            <span className="text-zinc-300 text-xs">#</span>{order.number}
                                                        </div>
                                                        <div className={`text-center font-black text-base ${order.top > 0 ? 'text-blue-600' : 'text-zinc-100'}`}>{order.top || "-"}</div>
                                                        <div className={`text-center font-black text-base ${order.tod > 0 ? 'text-emerald-600' : 'text-zinc-100'}`}>{order.tod || "-"}</div>
                                                        <div className={`text-center font-black text-base ${order.bot > 0 ? 'text-amber-600' : 'text-zinc-100'}`}>{order.bot || "-"}</div>
                                                        <div className="text-right font-black text-base text-zinc-950">
                                                            {((order.top || 0) + (order.tod || 0) + (order.bot || 0)).toLocaleString()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Standard 1-Column Mode - Readable */
                            <div className="space-y-4">
                                <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1.2fr] px-6 py-4 border-b-2 border-zinc-200 bg-zinc-50/50 rounded-t-2xl">
                                    {["หมายเลข", "บน", "โต๊ด", "ล่าง", "รวม (บาท)"].map(h => (
                                        <div key={h} className="text-2xl font-black text-zinc-700 text-center last:text-right first:text-left">{h}</div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    {selectedUser?.details?.map((order: any) => (
                                        <div key={order.id} className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1.2fr] px-6 py-5 rounded-2xl bg-white border border-zinc-100 shadow-sm items-center">
                                            <div className="font-mono text-zinc-950 font-black text-3xl flex items-center gap-2">
                                                <span className="text-zinc-200 text-xl">#</span>{order.number}
                                            </div>
                                            <div className={`text-center font-black text-xl ${order.top > 0 ? 'text-blue-600' : 'text-zinc-100'}`}>{order.top || "-"}</div>
                                            <div className={`text-center font-black text-xl ${order.tod > 0 ? 'text-emerald-600' : 'text-zinc-100'}`}>{order.tod || "-"}</div>
                                            <div className={`text-center font-black text-xl ${order.bot > 0 ? 'text-amber-600' : 'text-zinc-100'}`}>{order.bot || "-"}</div>
                                            <div className="text-right font-black text-2xl text-zinc-950">
                                                {((order.top || 0) + (order.tod || 0) + (order.bot || 0)).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Category Breakdown Table - NEW SUMMARY SECTION */}
                    <div className="pt-4 mt-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex justify-between items-center group">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest">ยอดรวม (บน)</p>
                                    <p className="text-sm font-bold text-blue-900">รวม</p>
                                </div>
                                <p className="text-2xl font-black text-blue-600">{categoryBreakdown.top.toLocaleString()}</p>
                            </div>
                            <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex justify-between items-center group">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">ยอดรวม (โต๊ด)</p>
                                    <p className="text-sm font-bold text-emerald-900">รวม</p>
                                </div>
                                <p className="text-2xl font-black text-emerald-600">{categoryBreakdown.tod.toLocaleString()}</p>
                            </div>
                            <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 flex justify-between items-center group">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-black text-amber-400 uppercase tracking-widest">ยอดรวม (ล่าง)</p>
                                    <p className="text-sm font-bold text-amber-900">รวม</p>
                                </div>
                                <p className="text-2xl font-black text-amber-600">{categoryBreakdown.bot.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Final Total - Clear & Reliable */}
                    <div className="pt-4 mt-6">
                        <div className="bg-zinc-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full -mr-16 -mt-16" />
                            <div className="relative flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">ยอดเงินรวมสุทธิ</p>
                                    <h3 className="text-lg font-bold">จำนวนเงิน</h3>
                                </div>
                                <div className="text-right">
                                    <span className="text-5xl font-black text-white tracking-tighter">
                                        {selectedUser?.sum?.toLocaleString()}
                                        <span className="text-xl ml-2 font-bold text-white/60">บาท</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Section - Dynamic Component Design */}
                    {showQRCode && (
                        <div className="flex flex-col items-center justify-center pt-8 space-y-4">
                            <div className="relative group">
                                {/* Premium Glow Effect */}
                                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 via-transparent to-emerald-500/10 blur-3xl opacity-50"></div>

                                {/* The Frame Component */}
                                <div className="relative w-72 bg-white rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-zinc-100 flex flex-col items-center gap-6">
                                    {/* PromptPay Branded Header */}
                                    <div className="flex items-center gap-1 scale-110">
                                        <div className="flex items-center bg-[#003d6b] px-2 py-0.5 rounded-sm">
                                            <span className="text-[10px] font-bold text-white italic tracking-tighter">Prompt</span>
                                            <span className="text-[10px] font-black text-[#00e3a0] ml-0.5 italic tracking-tighter">Pay</span>
                                        </div>
                                    </div>

                                    {/* QR Code Slot - Put your actual QR image here */}
                                    <div className="w-48 h-48 bg-white rounded-3xl p-3 border-4 border-zinc-50 shadow-inner flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/QRCode/noonidzz-qr-code.jpeg"
                                            alt="Actual QR Code"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* Thai Branding Text */}
                                    <div className="text-center">
                                        <h4 className="text-[#003d6b] font-black text-xl tracking-tight">ชำระเงินผ่านพร้อมเพย์</h4>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Scan to Pay</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] max-w-[250px] text-center leading-relaxed">
                                กรุณาตรวจสอบชื่อผู้รับเงินให้ถูกต้องก่อนโอนเงินทุกครั้ง
                            </p>
                        </div>
                    )}

                    {/* Footer Thai */}
                    <div className="py-2 border-t border-zinc-100 flex justify-between items-center text-zinc-400">
                        <p className="text-xs font-bold italic"> ขอบคุณที่อุดหนุนค่ะ ขอให้เฮงๆ รวยๆ โชคดีถูกรางวัลนะคะ 🧧✨ </p>
                        <div className="flex items-center gap-1 opacity-30">
                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
