"use client"
import React from 'react';
import { useMainStore } from '@/hooks/useMainStore';

interface DeleteAllModalProps {
    modalRef: React.RefObject<HTMLDialogElement | null>;
}

export const DeleteAllModal = ({ modalRef }: DeleteAllModalProps) => {
    const removeAllOrder = useMainStore((state) => state.removeAllOrder)

    return (
        <dialog id="delete_modal" className="modal modal-middle md:modal-bottom" ref={modalRef}>
            <div className="modal-box glass-card border-zinc-800/50 p-8 bg-zinc-950">
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
            <form method="dialog" className="modal-backdrop bg-black/80 backdrop-blur-sm">
                <button>close</button>
            </form>
        </dialog>
    );
};
