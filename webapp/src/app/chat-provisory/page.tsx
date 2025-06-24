// components
import TomasPraefatioChat from "@/components/TomasPraefatioChat";
import Sidebar from "@/components/Sidebar";

export default function ChatProvisory() {
  return (
    <main className="relative h-screen bg-[#FFF] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TomasPraefatioChat />
      </div>
    </main>
  );
}
