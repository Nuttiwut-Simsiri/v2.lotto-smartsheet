import { BillSlip } from "./BillSlip";
import { X, Share2} from 'lucide-react';
import { useMainStore } from "@/hooks/useMainStore";

interface BillDetailsModalProps {
    modalRef: any;
    shareRef: any;
    selectedUser: any;
    categoryBreakdown: any;
    isSharing: boolean;
    showQRCode: boolean;
    onShowQRCodeChange: (show: boolean) => void;
    onShare: () => void;
}

export const BillDetailsModal = ({
    modalRef,
    shareRef,
    selectedUser,
    categoryBreakdown,
    isSharing,
    showQRCode,
    onShowQRCodeChange,
    onShare
}: BillDetailsModalProps) => {
    const onPaidOrder = useMainStore((state) => state.onPaidOrder)

    const handlePrint = () => {
        window.print();
    }

    return (
        <dialog id="details_modal" className="modal modal-middle md:modal-bottom backdrop-blur-sm" ref={modalRef}>
            <div className={`modal-box p-0 bg-zinc-950 border border-zinc-900 rounded-t-[2.5rem] sm:rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl`}>
                {/* Header */}
                <div className="bg-zinc-100 px-6 py-4 flex justify-between items-center border-b border-zinc-200">
                    <h3 className="font-bold text-lg text-zinc-800 flex items-center gap-2">
                        <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                        รายละเอียดบิล
                    </h3>
                   

                     <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 mr-2 px-3 py-1.5 bg-zinc-900 rounded-xl border border-zinc-800">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">QR Code</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={showQRCode}
                                    onChange={(e) => onShowQRCodeChange(e.target.checked)}
                                />
                                <div className="w-8 h-4 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-400 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500/50 peer-checked:after:bg-emerald-500"></div>
                            </label>
                        </div>
                        <button
                            onClick={onShare}
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
                

                <BillSlip
                    shareRef={shareRef}
                    selectedUser={selectedUser}
                    categoryBreakdown={categoryBreakdown}
                    showQRCode={showQRCode}
                />

                <div className="p-6 bg-zinc-950 border-t border-zinc-900">
                    <form method="dialog">
                        <button className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl transition-all font-bold border border-zinc-800 active:scale-95">
                            ปิดหน้าต่าง
                        </button>
                    </form>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop bg-black/60 backdrop-blur-sm">
                <button>ปิด</button>
            </form>
        </dialog>
    );
};
