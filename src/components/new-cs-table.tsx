import { useState, useRef } from "react";
import useCustomStore from "@/hooks/useCustomStore";
import { useMainStore } from "@/hooks/useMainStore";
import { Check, Eye, X, Hash, Info, Share2, Download, Printer } from 'lucide-react';
import { toPng } from 'html-to-image';
import Image from "next/image";

export default function NewCSTable({ headers }: { headers: string[] }) {
    const summaryOrders = useCustomStore(useMainStore, (state: any) => state.summaryOrders)
    const orders = useCustomStore(useMainStore, (state: any) => state.orders)
    const onPaidOrder = useMainStore((state) => state.onPaidOrder)

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [showQRCode, setShowQRCode] = useState(true);
    const modalRef = useRef<HTMLDialogElement>(null);
    const shareRef = useRef<HTMLDivElement>(null);

    // Calculate category breakdown for summary table
    const categoryBreakdown = selectedUser?.details?.reduce((acc: any, curr: any) => {
        acc.top += (curr.top || 0);
        acc.tod += (curr.tod || 0);
        acc.bot += (curr.bot || 0);
        return acc;
    }, { top: 0, tod: 0, bot: 0 }) || { top: 0, tod: 0, bot: 0 };

    const openDetails = (userSummary: any) => {
        const userDetails = orders.filter((o: any) => o.name === userSummary.name);
        setSelectedUser({ ...userSummary, details: userDetails });
        modalRef.current?.showModal();
    }

    const handleShare = async () => {
        if (!shareRef.current) return;
        setIsSharing(true);
        try {
            const dataUrl = await toPng(shareRef.current, {
                quality: 0.95,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
                width: 800,
                style: {
                    width: '800px',
                    height: 'auto',
                    borderRadius: '0px'
                },
                cacheBust: true,
            });

            const blob = await (await fetch(dataUrl)).blob();
            const fileName = `lotto-summary-${selectedUser?.name}-${Date.now()}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `สรุปยอดคุณ ${selectedUser?.name}`,
                    text: `รายการสั่งซื้อลอตเตอรี่ของคุณ ${selectedUser?.name}`
                });
            } else {
                const link = document.createElement('a');
                link.download = fileName;
                link.href = dataUrl;
                link.click();
            }
        } catch (err) {
            console.error('Sharing failed', err);
        } finally {
            setIsSharing(false);
        }
    }

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.2fr_0.5fr] bg-zinc-900/50 p-4 border-b border-zinc-800">
                        {headers.map((h, i) => (
                            <div key={i} className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center first:text-left first:px-2">
                                {h}
                            </div>
                        ))}
                    </div>

                    <div className="divide-y divide-zinc-800/50">
                        {summaryOrders?.filter((el: any) => el.name).map((el: any, index: number) => (
                            <div key={el.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.2fr_0.5fr] items-center p-4 hover:bg-zinc-800/20 transition-colors group">
                                <div className="text-sm font-semibold text-white px-2 truncate">
                                    {el.name}
                                </div>

                                <div
                                    className="px-2 cursor-pointer group/num"
                                    onClick={() => openDetails(el)}
                                >
                                    <div className="text-xs font-mono text-center text-zinc-500 bg-zinc-900/50 group-hover/num:bg-blue-500/10 group-hover/num:text-blue-400 py-1.5 rounded-lg border border-zinc-800/50 group-hover/num:border-blue-500/30 transition-all flex items-center justify-center gap-2">
                                        •••
                                        <Eye size={12} className="opacity-0 group-hover/num:opacity-100 transition-opacity" />
                                    </div>
                                </div>

                                <div className="text-sm text-center text-blue-400 font-medium">
                                    {el.top || "-"}
                                </div>

                                <div className="text-sm text-center text-emerald-400 font-medium">
                                    {el.tod || "-"}
                                </div>

                                <div className="text-sm text-center text-amber-400 font-medium">
                                    {el.bot || "-"}
                                </div>

                                <div className="text-sm font-bold text-center text-red-500">
                                    {el.sum?.toLocaleString('th-TH') || 0}
                                </div>

                                <div className="flex justify-center">
                                    <label className="relative flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={el.isPaid ?? false}
                                            className="sr-only peer"
                                            onChange={(ev) => onPaidOrder(ev.target.checked, el.id)}
                                        />
                                        <div className="w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-lg peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all flex items-center justify-center">
                                            <Check size={14} className={`text-white transition-opacity ${el.isPaid ? 'opacity-100' : 'opacity-0'}`} />
                                        </div>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Numbers Detail Modal */}
            <dialog ref={modalRef} className="modal modal-middle md:modal-bottom">
                <div className="modal-box p-0 bg-zinc-950 border border-zinc-900 rounded-t-[2.5rem] sm:rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
                    <div className="pt-3 pb-1 flex flex-col items-center sm:hidden">
                        <div className="w-12 h-1.5 bg-zinc-800 rounded-full mb-4 opacity-50" />
                    </div>

                    <div className="px-6 py-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-10 font-display">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-xl">
                                <Info className="text-blue-500" size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white leading-none">รายละเอียดหมายเลข</h3>
                                <p className="text-xs text-zinc-500 mt-1">ลูกค้า: <span className="text-blue-400">{selectedUser?.name}</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 mr-2 px-3 py-1.5 bg-zinc-900 rounded-xl border border-zinc-800">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">QR Code</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={showQRCode}
                                        onChange={(e) => setShowQRCode(e.target.checked)}
                                    />
                                    <div className="w-8 h-4 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-400 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500/50 peer-checked:after:bg-emerald-500"></div>
                                </label>
                            </div>
                            <button
                                onClick={handleShare}
                                disabled={isSharing}
                                className={`flex items-center gap-2 px-4 py-2 ${isSharing ? 'bg-zinc-800' : 'bg-emerald-600 hover:bg-emerald-500'} text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/10`}
                            >
                                {isSharing ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Share2 size={16} />
                                )}
                                <span>{isSharing ? 'กำลังเจนนรูป...' : 'แชร์สลิป'}</span>
                            </button>
                            <form method="dialog">
                                <button className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500 outline-none">
                                    <X size={20} />
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-0 bg-white">
                        <div
                            ref={shareRef}
                            style={{ width: '800px' }} // Force fixed width for capture consistency
                            className="p-12 space-y-8 bg-white text-zinc-950 mx-auto"
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
                                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-400 -translate-x-1/2 hidden md:block" />

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
                                                <Image
                                                    src="/QRCode/noonidzz-qr-code.jpeg" // ใส่รูป QR จริงของคุณตรงนี้
                                                    alt="Actual QR Code"
                                                    className="w-full h-full object-contain"
                                                    width={192}
                                                    height={192}
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
                            <div className="pt-6 border-t border-zinc-100 flex justify-between items-center text-zinc-400">
                                <p className="text-xs font-bold italic"> ขอบคุณที่อุดหนุนค่ะ </p>
                                <div className="flex items-center gap-1 opacity-30">
                                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-zinc-950 border-t border-zinc-900">
                        <form method="dialog">
                            <button className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl transition-all font-bold border border-zinc-800 active:scale-95">
                                ปิดหน้าต่าง
                            </button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop bg-black/60 backdrop-blur-sm">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}