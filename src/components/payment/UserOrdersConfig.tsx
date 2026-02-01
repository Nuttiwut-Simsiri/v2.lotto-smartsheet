"use client"
import { useMainStore } from "@/hooks/useMainStore";
import useCustomStore from "@/hooks/useCustomStore";
import { useRef } from "react";
import { User, X, PlusCircle, History, Hash, Coins, Settings2, Trash2 } from "lucide-react";

const UserOrdersConfig = ({ username, hColor }: { username: string, hColor: string }) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const orders = useCustomStore(useMainStore, (state: any) => state.orders)
    const newOrders = useCustomStore(useMainStore, (state: any) => state.newOrders)
    const previewOrderForUser = useCustomStore(useMainStore, (state: any) => state.previewOrderForUser)

    const removeOrder = useMainStore((state) => state.removeOrder)
    const editNewOrder = useMainStore((state) => state.editNewOrder)
    const makePreviewOrderForUser = useMainStore((state) => state.makePreviewOrderForUser)
    const addOrder = useMainStore((state) => state.addOrderForUser)
    const summarize = useMainStore((state) => state.summarize)
    const clearPreviewOrder = useMainStore((state) => state.clearPreviewOrder)

    const historyOrder = orders?.filter((el: any) => el.name === username && el.color === hColor)

    const onOpenModal = () => {
        makePreviewOrderForUser(newOrders?.setType || "บน", Date.now(), hColor)
        modalRef.current?.showModal()
        clearPreviewOrder()
        editNewOrder({ name: username })
    }

    const handleAddOrder = (ev: React.MouseEvent<HTMLElement>) => {
        ev.preventDefault()
        addOrder()
    }

    const handleRemoveOrder = (ev: React.MouseEvent<HTMLElement>, id: string) => {
        ev.preventDefault()
        removeOrder(id)
    }

    const handleOK = () => {
        summarize()
        modalRef.current?.close()
    }

    const setTypes = [
        "บน", "โต๊ด", "ล่าง", "บน+ล่าง", "บน+โต๊ด", "บน+ล่าง+โต๊ด",
        "ชุด (บน)", "ชุด (ล่าง)", "ชุด (โต๊ด)", "ชุด (บน+ล่าง)", "ชุด (บน+โต๊ด)", "ชุด (บน+ล่าง+โต๊ด)"
    ]

    return (
        <>
            <button
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold transition-all border border-zinc-800 hover:border-zinc-700 active:scale-95 shadow-sm"
                onClick={() => onOpenModal()}
            >
                แก้ไข
            </button>

            <dialog id="edit_user_orders" className="modal modal-middle md:modal-bottom" ref={modalRef}>
                <div className="modal-box p-0 bg-zinc-950 border border-zinc-900 rounded-t-[2.5rem] sm:rounded-3xl max-w-5xl w-full max-h-[92vh] sm:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
                    {/* Header with Handle for Mobile */}
                    <div className="pt-3 pb-1 flex flex-col items-center sm:hidden">
                        <div className="w-12 h-1.5 bg-zinc-800 rounded-full mb-4 opacity-50" />
                    </div>

                    <div className="px-6 py-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-xl">
                                <User className="text-blue-500" size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-display font-bold text-white leading-none">แก้ไขรายการ</h3>
                                <p className="text-xs text-zinc-500 mt-1">ลูกค้า: <span style={{ color: hColor }}>{username}</span></p>
                            </div>
                        </div>
                        <form method="dialog">
                            <button className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500">
                                <X size={20} />
                            </button>
                        </form>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12">
                            {/* Form Section */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest bg-zinc-900/50 w-fit px-3 py-1.5 rounded-lg border border-zinc-800/50">
                                    <PlusCircle size={14} className="text-emerald-500" /> เพิ่มรายการใหม่
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Hash size={14} className="text-blue-500/50" /> ตัวเลข
                                        </label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="00"
                                            className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-2xl px-5 py-4 text-white font-mono font-bold text-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder-zinc-700 text-center"
                                            minLength={2}
                                            maxLength={3}
                                            value={newOrders?.number || ""}
                                            onChange={(ev) => editNewOrder({ number: ev.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Coins size={14} className="text-blue-500/50" /> จำนวนเงิน
                                        </label>
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            placeholder="0"
                                            className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-2xl px-5 py-4 text-white font-mono font-bold text-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder-zinc-700 text-center"
                                            value={newOrders?.price || ""}
                                            step={5}
                                            min={0}
                                            onChange={(ev) => editNewOrder({ price: parseInt(ev.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Settings2 size={14} className="text-blue-500/50" /> ประเภทเลขชุด
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {setTypes.map(type => {
                                            const isSelected = newOrders?.setType === type;
                                            return (
                                                <button
                                                    key={type}
                                                    onClick={() => editNewOrder({ setType: type, color: hColor })}
                                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${isSelected
                                                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                                                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                                                        }`}
                                                >
                                                    {type}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <button
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white rounded-2xl transition-all shadow-lg shadow-emerald-600/20 font-bold flex items-center justify-center gap-2"
                                    onClick={(ev) => handleAddOrder(ev)}
                                >
                                    <PlusCircle size={18} />
                                    <span>เพิ่มเข้าตารางสั่งซื้อ</span>
                                </button>
                            </div>

                            {/* History Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest bg-zinc-900/50 w-fit px-3 py-1.5 rounded-lg border border-zinc-800/50">
                                    <History size={14} className="text-blue-500" /> รายการสั่งซื้อที่มีอยู่
                                </div>

                                <div className="bg-zinc-900/30 rounded-3xl border border-zinc-800 overflow-hidden flex flex-col h-full min-h-[400px]">
                                    <div className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr_0.8fr_40px] bg-zinc-900/50 p-4 border-b border-zinc-800/50">
                                        {["เลข", "บน", "โต๊ด", "ล่าง", "รวม", ""].map(h => (
                                            <div key={h} className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase text-center">{h}</div>
                                        ))}
                                    </div>
                                    <div className="divide-y divide-zinc-900/50 overflow-y-auto max-h-[450px]">
                                        {historyOrder?.map((el: any) => (
                                            <div key={el.id} className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr_0.8fr_40px] p-4 text-center items-center hover:bg-white/[0.02] transition-colors">
                                                <div className="font-mono text-blue-400 font-bold text-base">{el.number}</div>
                                                <div className="text-xs text-zinc-500">{el.top || 0}</div>
                                                <div className="text-xs text-zinc-500">{el.tod || 0}</div>
                                                <div className="text-xs text-zinc-500">{el.bot || 0}</div>
                                                <div className="text-xs font-bold text-white">{el.sum || 0}</div>
                                                <button
                                                    onClick={(ev) => handleRemoveOrder(ev, el.id)}
                                                    className="text-red-500/50 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}

                                        {previewOrderForUser && previewOrderForUser.length > 0 && (
                                            <div className="bg-emerald-500/5 border-y border-emerald-500/10">
                                                <div className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest px-4 py-2 bg-emerald-500/5">
                                                    กำลังจะเพิ่มใหม่
                                                </div>
                                                {previewOrderForUser.map((el: any) => (
                                                    <div key={el.id} className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr_0.8fr_40px] p-4 text-center items-center opacity-80 italic animate-pulse">
                                                        <div className="font-mono text-emerald-400 font-bold text-base">{el.number}</div>
                                                        <div className="text-xs text-emerald-500/70">{el.top || 0}</div>
                                                        <div className="text-xs text-emerald-500/70">{el.tod || 0}</div>
                                                        <div className="text-xs text-emerald-500/70">{el.bot || 0}</div>
                                                        <div className="text-xs font-bold text-emerald-400">{el.sum || 0}</div>
                                                        <div></div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {(!historyOrder || historyOrder.length === 0) && (!previewOrderForUser || previewOrderForUser.length === 0) && (
                                            <div className="flex flex-col items-center justify-center py-24 text-zinc-800 gap-3">
                                                <History size={48} className="opacity-20" />
                                                <p className="text-sm font-medium italic">ไม่มีรายการสั่งซื้อ</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-zinc-950 border-t border-zinc-900 sticky bottom-0 z-10 sm:relative sm:z-auto">
                        <div className="flex flex-col gap-3">
                            <button
                                className="w-full py-5 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white rounded-2xl transition-all shadow-xl shadow-blue-600/25 font-bold text-xl"
                                onClick={() => handleOK()}
                            >
                                ยืนยันการแก้ไขข้อมูล
                            </button>
                            <button
                                onClick={() => modalRef.current?.close()}
                                className="sm:hidden text-zinc-500 font-medium py-2 text-sm text-center"
                            >
                                ยกเลิกและปิด
                            </button>
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop bg-black/60 backdrop-blur-sm">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}

export default UserOrdersConfig;