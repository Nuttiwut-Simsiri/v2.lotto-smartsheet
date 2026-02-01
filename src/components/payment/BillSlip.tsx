import { Printer, Calendar, User, ShoppingBag, CheckCircle, Wallet } from 'lucide-react';
import { generate } from 'promptparse';
import { QRCodeSVG } from 'qrcode.react';
import { useMemo } from 'react';

interface BillSlipProps {
    shareRef: React.RefObject<HTMLDivElement | null>;
    selectedUser: any;
    categoryBreakdown: { top: number; tod: number; bot: number };
    showQRCode: boolean;
}

export const BillSlip = ({ shareRef, selectedUser, categoryBreakdown, showQRCode }: BillSlipProps) => {
    const today = new Date();

    const formattedDate = useMemo(() => today.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }), []);

    const formattedTime = useMemo(() => today.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit'
    }), []);

    const qrValue = useMemo(() => {
        if (!selectedUser?.sum || !showQRCode) return "";
        return generate.anyId({
            type: 'MSISDN',
            target: process.env.NEXT_PUBLIC_PROMPTPAY_ID || "",
            amount: selectedUser?.sum || 0
        });
    }, [selectedUser?.sum, showQRCode]);

    return (
        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-0 bg-slate-100">
            <div className="min-w-fit w-full flex justify-center py-16">
                <div
                    ref={shareRef}
                    style={{
                        width: '640px',
                        minWidth: '640px',
                        backgroundColor: '#ffffff'
                    }}
                    className="p-16 space-y-12 text-[#1e293b] flex-shrink-0 relative border border-slate-200"
                >
                    {/* ขอบตกแต่งด้านบน */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-[#003d6b]" />

                    {/* ส่วนหัว: ข้อมูลระบบและวันที่ */}
                    <div className="flex justify-between items-start border-b-2 border-slate-50 pb-12">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5 text-[#003d6b]">
                                <Printer size={20} />
                                <span className="text-sm font-black tracking-tight">ระบบบันทึกรายการอัตโนมัติ</span>
                            </div>
                            <h2 className="text-4xl font-black text-[#0f172a] tracking-tight">ใบสรุปยอดสั่งซื้อ</h2>
                        </div>
                        <div className="text-right space-y-2">
                            <div className="flex items-center justify-end gap-2 text-slate-400">
                                <Calendar size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">วันที่ทำรายการ</span>
                            </div>
                            <p className="text-xl font-black text-[#0f172a]">{formattedDate}</p>
                            <p className="text-sm font-bold text-slate-500">เวลา {formattedTime} น.</p>
                        </div>
                    </div>

                    {/* การ์ดข้อมูลลูกค้า */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-3xl space-y-2">
                            <div className="flex items-center gap-2 text-slate-400">
                                <User size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest font-sans">ชื่อลูกค้า</span>
                            </div>
                            <h1 className="text-4xl font-black text-[#003d6b]">{selectedUser?.name}</h1>
                        </div>
                        <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-3xl space-y-2">
                            <div className="flex items-center gap-2 text-slate-400">
                                <ShoppingBag size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest font-sans">รวมจำนวนรายการ</span>
                            </div>
                            <p className="text-4xl font-black text-[#0f172a]">{selectedUser?.details?.length || 0} <span className="text-xl text-slate-400">รายการ</span></p>
                        </div>
                    </div>

                    {/* ตารางรายการหวย */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr] px-10 py-5 bg-[#003d6b] text-white rounded-2xl">
                            {["หมายเลข", "บน", "โต๊ด", "ล่าง", "รวม (บาท)"].map((h, i) => (
                                <div key={h} className={`text-base font-black tracking-wide ${i === 0 ? 'text-left' : i === 4 ? 'text-right' : 'text-center'}`}>
                                    {h}
                                </div>
                            ))}
                        </div>
                        <div className="space-y-0 text-center">
                            {selectedUser?.details?.map((order: any) => (
                                <div key={order.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr] px-10 py-6 items-center border-b border-slate-50">
                                    <div className="font-mono text-[#0f172a] font-black text-4xl tracking-tighter text-left">
                                        {order.number}
                                    </div>
                                    <div className={`font-black text-2xl ${order.top > 0 ? 'text-[#334155]' : 'text-slate-100'}`}>{order.top || "-"}</div>
                                    <div className={`font-black text-2xl ${order.tod > 0 ? 'text-[#64748b]' : 'text-slate-100'}`}>{order.tod || "-"}</div>
                                    <div className={`font-black text-2xl ${order.bot > 0 ? 'text-[#94a3b8]' : 'text-slate-100'}`}>{order.bot || "-"}</div>
                                    <div className="text-right font-black text-3xl text-[#0f172a]">
                                        {((order.top || 0) + (order.tod || 0) + (order.bot || 0)).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* สรุปยอดแยกตามประเภท */}
                    <div className="grid grid-cols-3 gap-6 pt-6 font-sans">
                        {[
                            { label: 'ยอดรวม (บน)', val: categoryBreakdown.top, color: 'text-[#0ea5e9]' },
                            { label: 'ยอดรวม (โต๊ด)', val: categoryBreakdown.tod, color: 'text-[#10b981]' },
                            { label: 'ยอดรวม (ล่าง)', val: categoryBreakdown.bot, color: 'text-[#f59e0b]' }
                        ].map(item => (
                            <div key={item.label} className="bg-slate-50/30 rounded-2xl p-6 border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                <p className={`text-3xl font-black ${item.color}`}>{item.val.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    {/* ยอดชำระสุทธิ */}
                    <div className="mt-8 bg-[#003d6b]/[0.02] border-2 border-[#003d6b] p-10 rounded-[2.5rem] flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[#003d6b]">
                                <Wallet size={20} />
                                <span className="text-sm font-black uppercase tracking-[0.2em]">จำนวนเงินสุทธิ</span>
                            </div>
                            <h3 className="text-2xl font-black text-[#0f172a]">ยอดที่ต้องชำระทั้งสิ้น</h3>
                        </div>
                        <div className="text-right">
                            <span className="text-8xl font-black text-[#003d6b] tracking-tighter">
                                {selectedUser?.sum?.toLocaleString()}
                            </span>
                            <span className="text-3xl font-black text-[#003d6b] ml-4">บาท</span>
                        </div>
                    </div>

                    {/* ส่วนชำระเงิน QR Code (Redesigned for 100% Render Accuracy) */}
                    {showQRCode && (
                        <div className="flex flex-col items-center gap-10 border-t border-dashed border-slate-200 mt-12 bg-slate-50/50 -mx-16 p-10">
                            <div className="flex flex-col items-center gap-8">
                                {/* PromptPay Logo - Flat Design */}
                                <div className="flex items-center bg-[#003d6b] px-6 py-2 rounded-lg">
                                    <span className="text-xl font-black text-white italic tracking-tighter">Prompt</span>
                                    <span className="text-xl font-black text-[#00e3a0] ml-1 italic tracking-tighter">Pay</span>
                                </div>

                                {/* QR Code Container - Solid Border (No Shadows/Blurs) */}
                                <div className="p-6 border-4 border-[#003d6b] rounded-[2rem] bg-white relative">
                                    <QRCodeSVG
                                        value={qrValue}
                                        size={240}
                                        level="H"
                                    />

                                </div>

                                <div className="text-center space-y-3">
                                    <p className="text-sm font-black text-[#003d6b] uppercase tracking-[0.2em]">สแกนเพื่อชำระเงิน</p>
                                    <div className="h-1 w-12 bg-[#00e3a0] mx-auto rounded-full" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ท้ายใบเสร็จ */}
                    <div className="pt-10 pb-4 flex flex-col items-center gap-6 text-center">
                        <div className="flex items-center gap-2 text-[#003d6b] font-black">
                            <CheckCircle size={24} />
                            <span className="text-xl tracking-tight">ขอบพระคุณที่อุดหนุนค่ะ</span>
                        </div>
                        <p className="text-sm font-bold text-slate-400 max-w-sm leading-relaxed italic">
                            ขอให้ท่านเฮงๆ รวยๆ ถูกรางวัลใหญ่ในงวดนี้ค่ะ 🧧✨
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
