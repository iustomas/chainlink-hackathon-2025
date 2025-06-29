// components
import Sidebar from "@/components/Sidebar";
import Subscription from "@/components/Subscription";

export default function SubscriptionPage() {
  return (
    <main className="relative h-screen bg-[#FFF] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto h-full">
        <Subscription />
      </div>
    </main>
  );
}
