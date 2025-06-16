interface StepsProps {
  currentStep: number;
}

export default function Steps({ currentStep = 1 }: StepsProps) {
  const steps = [
    { number: 1, label: "Intake Payment" },
    { number: 2, label: "Consultation with Tomas" },
    { number: 3, label: "Proposal Presentation" },
    { number: 4, label: "Proposal Acceptance" },
    { number: 5, label: "Service Delivery" },
  ];

  return (
    <div className="w-full max-w-4xl px-6 mb-12 mt-[100px]">
      <div className="flex items-center justify-between relative">
        {/* Connecting Lines */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 -translate-y-1/2"></div>

        {/* Steps */}
        {steps.map((step) => (
          <div
            key={step.number}
            className="relative flex items-center justify-center w-24"
          >
            <div
              className={`w-10 h-10 rounded-full ${
                step.number <= currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              } flex items-center justify-center font-semibold z-10`}
            >
              {step.number}
            </div>

            <div className="absolute -bottom-12 text-center w-24">
              <p className="text-sm font-medium text-gray-800">{step.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
