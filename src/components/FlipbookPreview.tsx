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
              <div className="relative w-[80%] h-[80%] shadow-2xl">
                {/* Left page */}
                {currentPage < pdfPages.length && (
                  <div
                    className="absolute inset-0 bg-white rounded-r-lg shadow-lg border-r border-gray-200 overflow-hidden"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: "perspective(2000px) rotateY(-5deg)",
                    }}
                  >
                    <img
                      src={pdfPages[currentPage]}
                      alt={`Page ${currentPage + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                {/* Right page */}
                {currentPage + 1 < pdfPages.length && (
                  <div
                    className="absolute inset-0 bg-white rounded-l-lg shadow-lg border-l border-gray-200 overflow-hidden"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: "perspective(2000px) rotateY(5deg)",
                      left: "50%",
                    }}
                  >
                    <img
                      src={pdfPages[currentPage + 1]}
                      alt={`Page ${currentPage + 2}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Page turn controls */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full text-white">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 2))}
                  disabled={currentPage === 0}
                  className="hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                <span className="text-sm">
                  {currentPage + 1}-{Math.min(currentPage + 2, pdfPages.length)} of {pdfPages.length}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(pdfPages.length - 2, currentPage + 2))
                  }
                  disabled={currentPage >= pdfPages.length - 2}
                  className="hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
