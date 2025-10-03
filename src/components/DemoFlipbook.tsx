import { useState } from "react";
import { Card } from "./ui/card";

export const DemoFlipbook = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const demoPages = [
    {
      title: "Page 1",
      content: "Welcome to your interactive flipbook! This demonstrates the realistic page-peel effect.",
      color: "from-purple-50 to-pink-50",
    },
    {
      title: "Page 2",
      content: "Click the corners or edges to turn pages. The animation mimics real paper turning.",
      color: "from-blue-50 to-cyan-50",
    },
    {
      title: "Page 3",
      content: "Perfect for catalogs, brochures, magazines, menus, and digital publications.",
      color: "from-green-50 to-emerald-50",
    },
    {
      title: "Page 4",
      content: "Upload your PDF to create your own stunning flipbook in seconds!",
      color: "from-orange-50 to-amber-50",
    },
  ];

  const handlePageTurn = (direction: "next" | "prev") => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    
    if (direction === "next" && currentPage < demoPages.length - 2) {
      setCurrentPage(currentPage + 2);
    } else if (direction === "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 2);
    }
    
    setTimeout(() => setIsFlipping(false), 600);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-bg">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Interactive Demo</h2>
          <p className="text-xl text-muted-foreground">
            Experience the realistic page-peel effect
          </p>
        </div>

        <Card className="relative w-full aspect-[16/10] shadow-elevated overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="absolute inset-0 flex items-center justify-center p-8">
            {/* Flipbook container */}
            <div className="relative w-full max-w-4xl h-full">
              {/* Left page */}
              {currentPage < demoPages.length && (
                <div
                  className={`absolute inset-y-0 left-0 w-1/2 bg-white rounded-l-2xl shadow-2xl overflow-hidden transition-all duration-600 ${
                    isFlipping ? "animate-page-turn-left" : ""
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "perspective(2000px) rotateY(-2deg)",
                  }}
                >
                  <div
                    className={`w-full h-full bg-gradient-to-br ${demoPages[currentPage].color} p-12 flex flex-col justify-center`}
                  >
                    <h3 className="text-4xl font-bold mb-6 text-gray-800">
                      {demoPages[currentPage].title}
                    </h3>
                    <p className="text-xl text-gray-700 leading-relaxed mb-8">
                      {demoPages[currentPage].content}
                    </p>
                    <div className="mt-auto text-sm text-gray-500 font-medium">
                      Page {currentPage + 1}
                    </div>
                  </div>
                  
                  {/* Interactive corner overlay */}
                  <button
                    onClick={() => handlePageTurn("prev")}
                    disabled={currentPage === 0}
                    className="absolute top-0 left-0 w-20 h-20 opacity-0 hover:opacity-100 transition-opacity disabled:cursor-not-allowed group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-br-3xl group-hover:from-primary/40" />
                  </button>
                </div>
              )}

              {/* Right page */}
              {currentPage + 1 < demoPages.length && (
                <div
                  className={`absolute inset-y-0 right-0 w-1/2 bg-white rounded-r-2xl shadow-2xl overflow-hidden transition-all duration-600 ${
                    isFlipping ? "animate-page-turn-right" : ""
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "perspective(2000px) rotateY(2deg)",
                  }}
                >
                  <div
                    className={`w-full h-full bg-gradient-to-br ${
                      demoPages[currentPage + 1].color
                    } p-12 flex flex-col justify-center`}
                  >
                    <h3 className="text-4xl font-bold mb-6 text-gray-800">
                      {demoPages[currentPage + 1].title}
                    </h3>
                    <p className="text-xl text-gray-700 leading-relaxed mb-8">
                      {demoPages[currentPage + 1].content}
                    </p>
                    <div className="mt-auto text-sm text-gray-500 font-medium text-right">
                      Page {currentPage + 2}
                    </div>
                  </div>
                  
                  {/* Interactive corner overlay */}
                  <button
                    onClick={() => handlePageTurn("next")}
                    disabled={currentPage >= demoPages.length - 2}
                    className="absolute top-0 right-0 w-20 h-20 opacity-0 hover:opacity-100 transition-opacity disabled:cursor-not-allowed group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-3xl group-hover:from-primary/40" />
                  </button>
                </div>
              )}

              {/* Page spine/binding */}
              <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-gradient-to-b from-gray-400/50 via-gray-500/50 to-gray-400/50 shadow-lg z-10" />
            </div>
          </div>

          {/* Navigation controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/70 backdrop-blur-md px-8 py-4 rounded-full text-white shadow-elevated z-20">
            <button
              onClick={() => handlePageTurn("prev")}
              disabled={currentPage === 0 || isFlipping}
              className="text-2xl hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <span className="text-sm font-medium min-w-[100px] text-center">
              Pages {currentPage + 1}-{Math.min(currentPage + 2, demoPages.length)} of{" "}
              {demoPages.length}
            </span>
            <button
              onClick={() => handlePageTurn("next")}
              disabled={currentPage >= demoPages.length - 2 || isFlipping}
              className="text-2xl hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </Card>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            💡 Tip: Hover over the top corners to see interactive turn indicators
          </p>
        </div>
      </div>
    </section>
  );
};
