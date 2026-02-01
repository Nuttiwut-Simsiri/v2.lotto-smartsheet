import { useState, useRef, useMemo } from "react";
import useCustomStore from "@/hooks/useCustomStore";
import { useMainStore } from "@/hooks/useMainStore";
import { toJpeg } from 'html-to-image';
import { SummaryTableRow } from "./SummaryTableRow";
import { BillDetailsModal } from "../payment/BillDetailsModal";

export default function SummaryTable({ headers }: { headers: string[] }) {
    const summaryOrders = useCustomStore(useMainStore, (state: any) => state.summaryOrders)
    const orders = useCustomStore(useMainStore, (state: any) => state.orders)
    const onPaidOrder = useMainStore((state) => state.onPaidOrder)

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [showQRCode, setShowQRCode] = useState(true);
    const modalRef = useRef<HTMLDialogElement>(null);
    const shareRef = useRef<HTMLDivElement>(null);

    // Calculate category breakdown for summary table
    const categoryBreakdown = useMemo(() => {
        return selectedUser?.details?.reduce((acc: any, curr: any) => {
            acc.top += (curr.top || 0);
            acc.tod += (curr.tod || 0);
            acc.bot += (curr.bot || 0);
            return acc;
        }, { top: 0, tod: 0, bot: 0 }) || { top: 0, tod: 0, bot: 0 };
    }, [selectedUser]);

    const openDetails = (userSummary: any) => {
        const userDetails = orders.filter((o: any) => o.name === userSummary.name);
        setSelectedUser({ ...userSummary, details: userDetails });
        modalRef.current?.showModal();
    }

    const sharingRef = useRef(false);

    const handleShare = async () => {
        if (!shareRef.current || sharingRef.current) return;

        sharingRef.current = true;
        setIsSharing(true);

        try {
            const dataUrl = await toJpeg(shareRef.current, {
                cacheBust: true,
                backgroundColor: '#ffffff',
                pixelRatio: 2,
                canvasWidth: 780,
                style: {
                    margin: '0',
                    width: '780px',
                }
            });

            const blob = await (await fetch(dataUrl)).blob();
            const fileName = `lotto-summary-${selectedUser?.name}-${Date.now()}.jpeg`;
            const file = new File([blob], fileName, { type: 'image/jpeg' });

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
            sharingRef.current = false;
            setIsSharing(false);
        }
    }

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <div className="min-w-[780px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.2fr_0.5fr] bg-zinc-900/50 p-4 border-b border-zinc-800">
                        {headers.map((h, i) => (
                            <div key={i} className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest text-center first:text-left first:px-2">
                                {h}
                            </div>
                        ))}
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-zinc-800/50">
                        {summaryOrders?.filter((el: any) => el.name).map((el: any) => (
                            <SummaryTableRow
                                key={el.id}
                                el={el}
                                onViewDetails={openDetails}
                                onPaidOrder={onPaidOrder}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Numbers Detail Modal */}
            <BillDetailsModal
                modalRef={modalRef}
                shareRef={shareRef}
                selectedUser={selectedUser}
                categoryBreakdown={categoryBreakdown}
                isSharing={isSharing}
                showQRCode={showQRCode}
                onShowQRCodeChange={setShowQRCode}
                onShare={handleShare}
            />
        </div>
    )
}