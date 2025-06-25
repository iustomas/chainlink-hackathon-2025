// components
import Sidebar from "@/components/Sidebar";
import TomasPraefatioChat from "@/components/TomasPraefatioChat";

export default function ChatProvisory() {
  return (
    <main className="relative h-screen bg-[#FFF] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto h-full">
        <TomasPraefatioChat />
      </div>
    </main>
  );
}
