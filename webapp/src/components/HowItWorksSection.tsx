const howItWorksSteps = [
  {
    id: "01",
    text: "Start a conversation with Tomas, your AI legal assistant.",
  },
  {
    id: "02",
    text: "Provide details and upload necessary documents about your case.",
  },
  {
    id: "03",
    text: "Receive instant legal analysis and actionable recommendations.",
  },
  {
    id: "04",
    text: "Use smart contracts for secure payments and legal actions on-chain.",
  },
  {
    id: "05",
    text: "For complex issues, seamlessly escalate to a human lawyer.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#4CA5E6]">
            How it works
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#38456D] sm:text-4xl">
            Your web3 legal processes, simplified
          </p>

          <p className="mt-6 text-lg leading-8 text-[#38456D]/80">
            Follow these simple steps to get your legal matters resolved
            efficiently and securely with Tomas.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {/* Left side: steps */}
            <div className="relative flex flex-col justify-center pl-9">
              <div className="absolute left-0 top-0 h-full w-px bg-[#4CA5E6]/30"></div>
              {howItWorksSteps.map((step) => (
                <div key={step.id} className="relative mb-12">
                  <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-[#4CA5E6]"></div>
                  <div className="flex items-baseline gap-x-4">
                    <span className="font-mono text-lg font-semibold text-[#4CA5E6]">
                      {step.id}
                    </span>
                    <p className="text-lg leading-7 text-[#38456D]">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side: chat mockup */}
            <div className="flex items-center justify-center p-8 bg-[#FCE3D0]/30 rounded-2xl border border-[#38456D]/10 shadow-2xl">
              <div className="w-full max-w-md">
                <div className="space-y-6">
                  {/* User message */}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-[#4CA5E6] text-white p-4 rounded-xl rounded-br-lg max-w-[80%]">
                      <p className="text-sm font-medium">
                        Hey Tomas, I need help with a smart contract audit for
                        my new DeFi project.
                      </p>
                    </div>
                  </div>
                  {/* Tomas message */}
                  <div className="flex items-start gap-3">
                    <div className="bg-[#E3E4E5] text-[#38456D] p-4 rounded-xl rounded-bl-lg max-w-[80%]">
                      <p className="text-sm font-medium">
                        Of course. Please upload the contract files and any
                        relevant documentation. I will analyze them and provide
                        a detailed report on potential vulnerabilities and legal
                        compliance.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-[#4CA5E6] text-white p-4 rounded-xl rounded-br-lg max-w-[80%]">
                      <p className="text-sm font-medium">
                        Great, uploading them now. Thanks!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
