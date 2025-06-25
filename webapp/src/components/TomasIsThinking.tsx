export default function TomasIsThinking() {
  return (
    <div className="flex w-full mb-6">
      {/* Avatar Tomas */}
      <div className="flex items-start mr-2">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F4F4F4] text-black text-2xl font-bold select-none mt-3"
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
          }}
        >
          T
        </div>
      </div>

      <div className="flex flex-col w-full">
        <div className="px-5 py-3 rounded-2xl text-base w-full bg-white flex flex-col items-start">
          <span className="text-base mb-2 text-gray-400">Thinking...</span>

          <div className="flex items-center gap-4 w-full">
            <span className="inline-block">
              <span className="loader-tomas inline-block w-4 h-4 border-2 border-gray-400 rounded-full animate-spin"></span>
            </span>

            <span className="text-gray-400 text-base ml-2">
              Analyzing your case
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
