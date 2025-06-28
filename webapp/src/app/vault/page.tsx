// components
import Sidebar from "@/components/Sidebar";
import Vault from "@/components/Vault";

export default function VaultPage() {
  return (
    <main className="relative h-screen bg-[#FFF] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto h-full">
        <Vault />
      </div>
    </main>
  );
}
