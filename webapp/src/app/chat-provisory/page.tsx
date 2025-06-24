// components
import TomasPraefatioChat from "@/components/TomasPraefatioChat";
import Sidebar from "@/components/Sidebar";

export default function ChatProvisory() {
  return (
    <main className="relative h-screen bg-[#38456D] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col px-4 py-4">
        <TomasPraefatioChat />
      </div>
    </main>
  );
}
