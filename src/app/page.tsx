import React from 'react';
import { auth } from "@/auth";
import { UserProfile } from '@/components/layout/UserProfile';
import KeypadInput from "@/components/input/KeypadInput";
import { CustomerSidebar } from '@/components/layout/CustomerSidebar';
import { OrderTable } from '@/components/common/OrderTable';
import { DeleteAllModalWrapper } from '@/components/common/DeleteAllModalWrapper';

export default async function Home() {
  const session = await auth();

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

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UserProfile session={session} />
          <div className="h-10 w-[1px] bg-zinc-800 hidden md:block"></div>

          <div className="flex items-center gap-3">
            <DeleteAllModalWrapper />
            <KeypadInput />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 items-start">
        <CustomerSidebar />
        <OrderTable />
      </div>
    </main>
  );
}
