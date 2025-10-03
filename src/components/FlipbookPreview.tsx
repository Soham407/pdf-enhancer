import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import * as pdfjsLib from "pdfjs-dist";
import { toast } from "sonner";

// Configure PDF.js worker with local file
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

interface FlipbookPreviewProps {
  pdfFile: File | null;
  backgroundColor: string;
  flipEffect: string;
  logo: string | null;
}

export const FlipbookPreview = ({
  pdfFile,
  backgroundColor,
  flipEffect,
  logo,
}: FlipbookPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const handlePageTurn = (direction: "next" | "prev") => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    
    if (direction === "next" && currentPage < pdfPages.length - 2) {
      setCurrentPage(currentPage + 2);
    } else if (direction === "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 2);
    }
    
    setTimeout(() => setIsFlipping(false), 600);
  };

  useEffect(() => {
    if (!pdfFile) {
      setPdfPages([]);
      return;
    }

    const loadPDF = async () => {
      setIsLoading(true);
      try {
        const fileReader = new FileReader();
        
        fileReader.onload = async (e) => {
          try {
            const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
            
            const pages: string[] = [];
            
            // Render each page
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const viewport = page.getViewport({ scale: 2 });
              
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              
              if (context) {
                await page.render({
                  canvasContext: context,
                  viewport: viewport,
                  canvas: canvas,
                }).promise;
                
                pages.push(canvas.toDataURL());
              }
            }
            
            setPdfPages(pages);
            setCurrentPage(0);
            toast.success(`PDF loaded: ${pdf.numPages} pages`);
          } catch (error) {
            console.error('Error rendering PDF:', error);
            toast.error('Failed to render PDF pages');
          } finally {
            setIsLoading(false);
          }
        };
        
        fileReader.readAsArrayBuffer(pdfFile);
      } catch (error) {
        console.error('Error loading PDF:', error);
        toast.error('Failed to load PDF');
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [pdfFile]);

  return (
    <div className="flex-1 bg-gradient-bg p-6 overflow-hidden flex items-center justify-center">
      <Card
        className="relative w-full max-w-4xl aspect-[16/10] shadow-elevated overflow-hidden"
        style={{ backgroundColor }}
      >
        {logo && (
          <div className="absolute top-4 left-4 z-10">
            <img src={logo} alt="Logo" className="h-12 object-contain" />
          </div>
        )}

        <div
          ref={containerRef}
          className="w-full h-full flex items-center justify-center"
        >
          {!pdfFile ? (
            <div className="text-center text-muted-foreground">
              <div className="text-6xl mb-4">📖</div>
              <p className="text-lg">Upload a PDF to see your flipbook preview</p>
            </div>
          ) : isLoading ? (
            <div className="text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-lg">Processing your PDF...</p>
            </div>
          ) : pdfPages.length > 0 ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Actual PDF flipbook pages */}
              <div className="relative w-[80%] h-[80%]">
                {/* Left page */}
                {currentPage < pdfPages.length && (
                  <div
                    className={`absolute inset-y-0 left-0 w-1/2 bg-white overflow-hidden shadow-2xl ${
                      flipEffect === "peel"
                        ? "rounded-l-2xl"
                        : flipEffect === "slide"
                        ? "rounded-lg"
                        : "rounded-lg"
                    } ${isFlipping && flipEffect === "peel" ? "animate-page-turn-left" : ""}`}
                    style={{
                      transformStyle: "preserve-3d",
                      transform:
                        flipEffect === "peel"
                          ? "perspective(2000px) rotateY(-2deg)"
                          : flipEffect === "slide"
                          ? "translateX(0)"
                          : "rotateY(0deg)",
                    }}
                  >
                    <img
                      src={pdfPages[currentPage]}
                      alt={`Page ${currentPage + 1}`}
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Interactive corner overlay */}
                    <button
                      onClick={() => handlePageTurn("prev")}
                      disabled={currentPage === 0 || isFlipping}
                      className="absolute top-0 left-0 w-20 h-20 opacity-0 hover:opacity-100 transition-opacity disabled:cursor-not-allowed group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-br-3xl group-hover:from-primary/40" />
                    </button>
                  </div>
                )}
                
                {/* Right page */}
                {currentPage + 1 < pdfPages.length && (
                  <div
                    className={`absolute inset-y-0 right-0 w-1/2 bg-white overflow-hidden shadow-2xl ${
                      flipEffect === "peel"
                        ? "rounded-r-2xl"
                        : flipEffect === "slide"
                        ? "rounded-lg"
                        : "rounded-lg"
                    } ${isFlipping && flipEffect === "peel" ? "animate-page-turn-right" : ""}`}
                    style={{
                      transformStyle: "preserve-3d",
                      transform:
                        flipEffect === "peel"
                          ? "perspective(2000px) rotateY(2deg)"
                          : flipEffect === "slide"
                          ? "translateX(0)"
                          : "rotateY(0deg)",
                    }}
                  >
                    <img
                      src={pdfPages[currentPage + 1]}
                      alt={`Page ${currentPage + 2}`}
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Interactive corner overlay */}
                    <button
                      onClick={() => handlePageTurn("next")}
                      disabled={currentPage >= pdfPages.length - 2 || isFlipping}
                      className="absolute top-0 right-0 w-20 h-20 opacity-0 hover:opacity-100 transition-opacity disabled:cursor-not-allowed group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-3xl group-hover:from-primary/40" />
                    </button>
                  </div>
                )}

                {/* Page spine/binding */}
                {flipEffect === "peel" && (
                  <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-gradient-to-b from-gray-400/50 via-gray-500/50 to-gray-400/50 shadow-lg z-10" />
                )}
              </div>

              {/* Page turn controls */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/70 backdrop-blur-md px-8 py-4 rounded-full text-white shadow-elevated z-20">
                <button
                  onClick={() => handlePageTurn("prev")}
                  disabled={currentPage === 0 || isFlipping}
                  className="text-2xl hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                <span className="text-sm font-medium min-w-[100px] text-center">
                  Pages {currentPage + 1}-{Math.min(currentPage + 2, pdfPages.length)} of {pdfPages.length}
                </span>
                <button
                  onClick={() => handlePageTurn("next")}
                  disabled={currentPage >= pdfPages.length - 2 || isFlipping}
                  className="text-2xl hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
};
