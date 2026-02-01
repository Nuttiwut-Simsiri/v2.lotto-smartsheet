import { CongratulationSlip } from "./CongratulationSlip";
import { X, Share2, Trophy } from 'lucide-react';

interface CongratulationModalProps {
    modalRef: any;
    shareRef: any;
    selectedUser: any;
    isSharing: boolean;
    onShare: () => void;
}

export const CongratulationModal = ({
    modalRef,
    shareRef,
    selectedUser,
    isSharing,
    onShare
}: CongratulationModalProps) => {

    return (
        <dialog id="congrats_modal" className="modal modal-middle md:modal-bottom backdrop-blur-sm" ref={modalRef}>
             <div className="modal-box p-0 bg-zinc-950 border border-zinc-900 rounded-t-[2.5rem] sm:rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="pt-3 pb-1 flex flex-col items-center sm:hidden">
                    <div className="w-12 h-1.5 bg-zinc-800 rounded-full mb-4 opacity-50" />
                </div>

                <div className="px-6 py-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-10 font-display">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-xl">
                            <Trophy className="text-amber-500" size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white leading-none">แชร์ความยินดี</h3>
                            <p className="text-xs text-zinc-500 mt-1"> คุณ <span className="text-amber-400">{selectedUser?.name}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onShare}
                            disabled={isSharing}
                            className={`flex items-center gap-2 px-4 py-2 ${isSharing ? 'bg-zinc-800' : 'bg-amber-600 hover:bg-amber-500'} text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-amber-500/10`}
                        >
                            {isSharing ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Share2 size={16} />
                            )}
                            <span>{isSharing ? 'กำลังเจนนรูป...' : 'แชร์ความยินดี'}</span>
                        </button>
                        <form method="dialog">
                            <button className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500 outline-none">
                                <X size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                <div ref={shareRef} className="overflow-y-auto">
                    <CongratulationSlip selectedUser={selectedUser} />
                </div>

                <div className="p-6 bg-zinc-950 border-t border-zinc-900">
                    <form method="dialog">
                        <button className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl transition-all font-bold border border-zinc-800 active:scale-95 text-sm uppercase tracking-widest">
                            ปิดหน้าต่าง
                        </button>
                    </form>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop bg-black/60 backdrop-blur-sm">
                <button>ปิดหน้าต่าง</button>
            </form>
        </dialog>
    )
}
