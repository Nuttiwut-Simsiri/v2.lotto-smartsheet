"use client"
import useCustomStore from '@/hooks/useCustomStore';
import { useMainStore } from '@/hooks/useMainStore';
import KeypadInput from "@/components/input/KeypadInput";
import UserOrdersConfig from '@/components/payment/UserOrdersConfig';
import NumberRow from "@/components/common/NumberRow";
import React, { useRef } from 'react';
import { Trash2, Search, Smartphone, Edit2, Check, X as CloseIcon } from 'lucide-react';
import { stringToColor } from '@/utils/colors';


export default function Home() {
  const orders = useCustomStore(useMainStore, (state: any) => state.orders)
  const uniqOrder = useCustomStore(useMainStore, (state: any) => state.uniqOrder)
  const filterKeyword = useCustomStore(useMainStore, (state: any) => state.filterKeyword)
  const changeKeyword = useMainStore((state) => state.changeKeyword)
  const removeOrder = useMainStore((state) => state.removeOrder)
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            ตารางจัดการการซื้อขาย
          </h1>
          <p className="text-zinc-500 mt-2 text-lg">จัดการใบสั่งซื้อหวยของคุณอย่างชาญฉลาด</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onShowRemoveAllOrderModal}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-all duration-300 font-medium group"
          >
            <Trash2 size={20} className="group-hover:rotate-12 transition-transform" />
            <span>ลบทั้งหมด</span>
          </button>

          <KeypadInput />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 items-start">
        {/* Sidebar / Filters */}
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
            <div className="space-y-2">
              {uniqOrder?.map((el: any, index: number) => {
                const customerColor = el.color;
                return (
                  <div key={`${el.name}-${el.color}`} className="glass-card p-4 flex items-center justify-between group hover:border-blue-500/30 transition-all duration-300">
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      <div
                        className="w-3 h-3 rounded-full shadow-lg shadow-blue-500/20 shrink-0"
                        style={{ backgroundColor: customerColor }}
                      />
                      {editingName === `${el.name}-${el.color}` ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            autoFocus
                            className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-sm font-bold text-white outline-none focus:border-blue-500 w-full"
                            value={newNameValue}
                            onChange={(e) => setNewNameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveName(el.name, el.color);
                              if (e.key === 'Escape') setEditingName(null);
                            }}
                          />
                          <button onClick={() => handleSaveName(el.name, el.color)} className="text-emerald-500 hover:text-emerald-400 p-1">
                            <Check size={16} />
                          </button>
                          <button onClick={() => setEditingName(null)} className="text-zinc-500 hover:text-zinc-400 p-1">
                            <CloseIcon size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span
                            className="font-bold text-zinc-100 truncate cursor-pointer hover:underline"
                            style={{ color: customerColor }}
                            onClick={() => startEditing(`${el.name}-${el.color}`, el.name)}
                          >
                            {el.name}
                          </span>
                          <button
                            onClick={() => startEditing(`${el.name}-${el.color}`, el.name)}
                            className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <UserOrdersConfig username={el.name} hColor={customerColor} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content Areas */}
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
                  {orders && (filterKeyword === "ทั้งหมด"
                    ? orders
                    : orders.filter((el: any) => el?.name === filterKeyword)
                  ).map((rowData: any, index: number) => (
                    <NumberRow
                      rowData={rowData}
                      key={rowData.id}
                      index={index}
                    />
                  ))}

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

      {/* Delete Confirmation Modal */}
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
