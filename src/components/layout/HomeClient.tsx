"use client"
import useCustomStore from '@/hooks/useCustomStore';
import { useMainStore } from '@/hooks/useMainStore';
import KeypadInput from "@/components/input/KeypadInput";
import NumberRow from "@/components/common/NumberRow";
import React, { useRef } from 'react';
import { Trash2, Search, Smartphone, Edit2, Check, X as CloseIcon } from 'lucide-react';
import { UserProfile } from '@/components/layout/UserProfile';
import { useShallow } from 'zustand/react/shallow';

interface HomeClientProps {
    session: any;
}

export default function HomeClient({ session }: HomeClientProps) {
    const orders = useCustomStore(useMainStore, useShallow((state: any) => state.orders))
    const uniqOrder = useCustomStore(useMainStore, useShallow((state: any) => state.uniqOrder))
    const filterKeyword = useCustomStore(useMainStore, (state: any) => state.filterKeyword)
    const changeKeyword = useMainStore((state) => state.changeKeyword)
    const removeAllOrder = useMainStore((state) => state.removeAllOrder)

    const ref = useRef<HTMLDivElement>(null)
    const modalRef = useRef<HTMLDialogElement>(null);
    const [editingName, setEditingName] = React.useState<string | null>(null);
    const [newNameValue, setNewNameValue] = React.useState("");
    const updateCustomerName = useMainStore((state) => state.updateCustomerName);

    const startEditing = (id: string, name: string) => {
        setEditingName(id);
        setNewNameValue(name);
    }

    const handleSaveName = (oldName: string, color?: string) => {
        updateCustomerName(oldName, newNameValue, color);
        setEditingName(null);
    }

    const onShowRemoveAllOrderModal = () => {
        modalRef.current?.showModal()
    }

    const tableHeaders = ["ชื่อ", "หมายเลข", "บน", "โต๊ด", "ล่าง", "รวม"];

    return (
        <main className="animate-fade-in max-w-7xl mx-auto w-full px-4 pt-12 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="flex-1">
                    <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        ตารางจัดการการซื้อขาย
                    </h1>
                    <p className="text-zinc-500 text-lg mt-2">จัดการรายละเอียดการสั่งซื้อและลูกค้าทั้งหมดในที่เดียว</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <UserProfile session={session} />
                    <div className="h-10 w-[1px] bg-zinc-800 hidden md:block"></div>
                    <KeypadInput />
                </div>
            </div>

            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={onShowRemoveAllOrderModal}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-all duration-300 font-medium group"
                >
                    <Trash2 size={20} className="group-hover:rotate-12 transition-transform" />
                    <span>ลบทั้งหมด</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 items-start">
                <aside className="space-y-8 lg:sticky lg:top-12">
                    <div className="glass-card p-6 border-zinc-800/50">
                        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Search size={16} /> การแสดงผล
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs text-zinc-500 ml-1">กรองตามรายชื่อ</label>
                                <select
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                    value={filterKeyword}
                                    onChange={(ev) => changeKeyword(ev.target.value)}
                                >
                                    <option value="ทั้งหมด">ทั้งหมดทุกรายชื่อ</option>
                                    {uniqOrder?.map((el: any) => (
                                        <option key={el.name} value={el.name}>{el.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider ml-1">รายชื่อลูกค้า</h2>
                        <div className="flex flex-col gap-2">
                            {uniqOrder?.map((el: any) => {
                                const isEditing = editingName === el.name;
                                return (
                                    <div key={el.name} className="group relative flex items-center gap-2">
                                        {isEditing ? (
                                            <div className="flex-1 flex items-center gap-2 bg-zinc-900 p-1 rounded-xl border border-blue-500/50">
                                                <input
                                                    autoFocus
                                                    className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none"
                                                    value={newNameValue}
                                                    onChange={(e) => setNewNameValue(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName(el.name, el.color)}
                                                />
                                                <button onClick={() => handleSaveName(el.name, el.color)} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => setEditingName(null)} className="p-2 text-zinc-500 hover:bg-zinc-500/10 rounded-lg">
                                                    <CloseIcon size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => changeKeyword(el.name)}
                                                className={`flex-1 flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 border ${filterKeyword === el.name
                                                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                                                    : "bg-zinc-900/50 border-zinc-800/50 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/50"
                                                    }`}
                                            >
                                                <span className="text-sm font-bold truncate">{el.name}</span>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div onClick={(e) => { e.stopPropagation(); startEditing(el.name, el.name); }} className="p-1.5 hover:bg-white/10 rounded-md">
                                                        <Edit2 size={12} />
                                                    </div>
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: el.color }} />
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-display font-semibold text-white">
                            รายการสั่งซื้อ <span className="text-zinc-500 text-base font-normal ml-2">({orders?.length || 0} รายการ)</span>
                        </h3>
                    </div>

                    <div className="glass-card border-zinc-800/50 shadow-2xl overflow-hidden" ref={ref}>
                        <div className="overflow-x-auto min-w-full">
                            <div className="min-w-[600px]">
                                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] bg-zinc-900/50 border-b border-zinc-800 p-4">
                                    {tableHeaders.map((header) => (
                                        <div key={header} className="text-xs font-bold text-zinc-400 uppercase tracking-widest text-center px-2">
                                            {header}
                                        </div>
                                    ))}
                                </div>

                                <div className="divide-y divide-zinc-800/50">
                                    {React.useMemo(() => {
                                        if (!orders) return null;
                                        const filtered = filterKeyword === "ทั้งหมด"
                                            ? orders
                                            : orders.filter((el: any) => el?.name === filterKeyword);

                                        return filtered.map((rowData: any, index: number) => (
                                            <NumberRow
                                                rowData={rowData}
                                                key={rowData.id}
                                                index={index}
                                            />
                                        ));
                                    }, [orders, filterKeyword])}

                                    {(!orders || orders.length === 0) && (
                                        <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-4">
                                            <div className="p-4 bg-zinc-800/30 rounded-full">
                                                <Smartphone size={40} className="opacity-20" />
                                            </div>
                                            <p>ไม่มีข้อมูลการสั่งซื้อในขณะนี้</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <dialog id="delete_modal" className="modal modal-middle md:modal-bottom" ref={modalRef}>
                <div className="modal-box glass-card border-zinc-800/50">
                    <h3 className="font-bold text-2xl text-white font-display">ลบรายการทั้งหมด?</h3>
                    <p className="py-6 text-zinc-400">คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลการซื้อขายทั้งหมด? ข้อมูลที่ถูกลบไปแล้วจะไม่สามารถเรียกคืนได้</p>
                    <div className="modal-action gap-3">
                        <form method="dialog" className="flex gap-3 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all font-medium">ยกเลิก</button>
                            <button
                                className="flex-1 sm:flex-none px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all shadow-lg shadow-red-600/20 font-medium"
                                onClick={() => removeAllOrder()}
                            >
                                ยืนยันการลบ
                            </button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </main>
    );
}
