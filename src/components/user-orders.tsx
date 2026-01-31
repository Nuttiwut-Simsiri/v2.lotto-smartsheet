"use client"
import { useMainStore } from "@/hooks/useMainStore";
import useCustomStore from "@/hooks/useCustomStore";
import { useRef } from "react";
import { User, X, PlusCircle, History, Hash, Coins, Settings2, Trash2 } from "lucide-react";

const UserOrders = ({ username, hColor }: { username: string, hColor: string }) => {
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

    const historyOrder = orders?.filter((el: any) => el.name === username)

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
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold transition-colors border border-zinc-700"
                onClick={() => onOpenModal()}
            >
                แก้ไข
            </button>

            <dialog id="edit_user_orders" className="modal modal-middle md:modal-bottom" ref={modalRef}>
                <div className="modal-box glass-card border-zinc-800/50 p-0 max-w-4xl w-11/12 overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/50">
                        <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                            <User className="text-blue-500" size={24} />
                            แก้ไขรายการของ {username}
                        </h3>
                        <form method="dialog">
                            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500">
                                <X size={20} />
                            </button>
                        </form>
                    </div>

                    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Add Order Form */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-2">
                                <PlusCircle size={16} /> เพิ่มรายการใหม่
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Hash size={14} /> ตัวเลข
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="00"
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-zinc-700"
                                        minLength={2}
                                        maxLength={3}
                                        defaultValue={newOrders?.number}
                                        onChange={(ev) => editNewOrder({ number: ev.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Coins size={14} /> จำนวนเงิน
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-zinc-700"
                                        defaultValue={newOrders?.price ?? 0}
                                        step={5}
                                        min={0}
                                        onChange={(ev) => editNewOrder({ price: parseInt(ev.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Settings2 size={14} /> ประเภทเลขชุด
                                </label>
                                <select
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all cursor-pointer appearance-none"
                                    defaultValue={newOrders?.setType}
                                    onChange={(ev) => editNewOrder({ setType: ev.target.value, color: hColor })}
                                >
                                    <option disabled>เลือกชุด...</option>
                                    {setTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all shadow-lg shadow-emerald-600/20 font-bold"
                                onClick={(ev) => handleAddOrder(ev)}
                            >
                                เพิ่มรายการเข้าตาราง
                            </button>
                        </div>

                        {/* Order History */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-2">
                                <History size={16} /> รายการสั่งซื้อเดิม
                            </div>

                            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden h-[450px] flex flex-col">
                                <div className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr_0.8fr_40px] bg-zinc-900/80 p-3 border-b border-zinc-800 shrink-0">
                                    {["เลข", "บน", "โต๊ด", "ล่าง", "รวม", ""].map(h => (
                                        <div key={h} className="text-[10px] font-bold text-zinc-600 uppercase text-center">{h}</div>
                                    ))}
                                </div>
                                <div className="divide-y divide-zinc-900 overflow-y-auto">
                                    {historyOrder?.map((el: any) => (
                                        <div key={el.id} className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr_0.8fr_40px] p-3 text-center items-center hover:bg-zinc-900/30 transition-colors">
                                            <div className="font-mono text-blue-400 font-bold">{el.number}</div>
                                            <div className="text-[11px] text-zinc-500">{el.top || 0}</div>
                                            <div className="text-[11px] text-zinc-500">{el.tod || 0}</div>
                                            <div className="text-[11px] text-zinc-500">{el.bot || 0}</div>
                                            <div className="text-xs font-bold text-white">{el.sum || 0}</div>
                                            <button
                                                onClick={(ev) => handleRemoveOrder(ev, el.id)}
                                                className="text-red-500 hover:text-red-400 p-1 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    {previewOrderForUser && previewOrderForUser.length > 0 && (
                                        <div className="bg-emerald-500/5">
                                            <div className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest px-3 py-1 border-y border-emerald-500/10">
                                                กำลังจะเพิ่ม (Preview)
                                            </div>
                                            {previewOrderForUser.map((el: any) => (
                                                <div key={el.id} className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr_0.8fr_40px] p-3 text-center items-center opacity-70 italic">
                                                    <div className="font-mono text-emerald-400 font-bold">{el.number}</div>
                                                    <div className="text-[11px] text-emerald-500/70">{el.top || 0}</div>
                                                    <div className="text-[11px] text-emerald-500/70">{el.tod || 0}</div>
                                                    <div className="text-[11px] text-emerald-500/70">{el.bot || 0}</div>
                                                    <div className="text-xs font-bold text-emerald-400">{el.sum || 0}</div>
                                                    <div></div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {(!historyOrder || historyOrder.length === 0) && (!previewOrderForUser || previewOrderForUser.length === 0) && (
                                        <div className="flex flex-col items-center justify-center h-48 text-zinc-700 gap-2 opacity-30">
                                            <History size={40} />
                                            <p className="text-xs italic">ไม่มีรายการสั่งซื้อ</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-zinc-900/50 border-t border-zinc-800/50 flex justify-end">
                        <button
                            className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-lg shadow-blue-600/20 font-bold text-lg active:scale-95"
                            onClick={() => handleOK()}
                        >
                            ยืนยันการแก้ไข
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}

export default UserOrders