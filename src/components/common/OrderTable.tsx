"use client"
import React from 'react';
import { Smartphone } from 'lucide-react';
import { useMainStore } from '@/hooks/useMainStore';
import useCustomStore from '@/hooks/useCustomStore';
import { useShallow } from 'zustand/react/shallow';
import NumberRow from "@/components/common/NumberRow";

export const OrderTable = () => {
    const orders = useCustomStore(useMainStore, useShallow((state: any) => state.orders))
    const filterKeyword = useCustomStore(useMainStore, (state: any) => state.filterKeyword)

    const tableHeaders = ["ชื่อ", "หมายเลข", "บน", "โต๊ด", "ล่าง", "รวม"];

    const filteredOrders = React.useMemo(() => {
        if (!orders) return [];
        return filterKeyword === "ทั้งหมด"
            ? orders
            : orders.filter((el: any) => el?.name === filterKeyword);
    }, [orders, filterKeyword]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-semibold text-white">
                    รายการสั่งซื้อ <span className="text-zinc-500 text-base font-normal ml-2">({orders?.length || 0} รายการ)</span>
                </h3>
            </div>

            <div className="glass-card border-zinc-800/50 shadow-2xl overflow-hidden">
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
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((rowData: any, index: number) => (
                                    <NumberRow
                                        rowData={rowData}
                                        key={rowData.id}
                                        index={index}
                                    />
                                ))
                            ) : (
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
    );
};
