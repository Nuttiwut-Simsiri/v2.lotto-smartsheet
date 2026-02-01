"use client"
import React, { useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { DeleteAllModal } from './DeleteAllModal';

export const DeleteAllModalWrapper = () => {
    const modalRef = useRef<HTMLDialogElement>(null);

    const onShowRemoveAllOrderModal = () => {
        modalRef.current?.showModal();
    };

    return (
        <>
            <button
                onClick={onShowRemoveAllOrderModal}
                className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-all duration-300 font-medium group"
            >
                <Trash2 size={20} className="group-hover:rotate-12 transition-transform" />
                <span>ลบทั้งหมด</span>
            </button>
            <DeleteAllModal modalRef={modalRef} />
        </>
    );
};
