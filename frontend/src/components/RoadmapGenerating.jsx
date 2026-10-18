import { useEffect, useState } from 'react';

const messages = [
  'Analyzing your skill gaps...',
  'Mapping out your foundation stage...',
  'Finding the right projects for you...',
  'Sequencing your path to job-ready...',
  'Lining up resources to learn from...',
  'Almost there — building your journey...',
];

function RoadmapGenerating() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center text-center">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🧭</div>
      </div>

      <h2 className="text-xl font-bold mb-2">Building Your Roadmap</h2>
      <p
        key={messageIndex}
        className="text-gray-500 text-sm animate-fade-in-up min-h-[20px]"
      >
        {messages[messageIndex]}
      </p>

      <div className="flex gap-1.5 mt-6">
        {messages.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === messageIndex ? 'w-6 bg-blue-600' : 'w-1.5 bg-gray-200'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default RoadmapGenerating;