import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import * as pdfjsLib from "pdfjs-dist";
import { toast } from "sonner";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

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
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef<any>(null);

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
              const viewport = page.getViewport({ scale: 1.5 });
              
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
        className="relative w-full max-w-5xl aspect-[16/10] shadow-elevated overflow-hidden p-8"
        style={{ backgroundColor }}
      >
        {logo && (
          <div className="absolute top-4 left-4 z-20">
            <img src={logo} alt="Logo" className="h-12 object-contain" />
          </div>
        )}

        <div className="w-full h-full flex items-center justify-center">
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
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <div className="flex-1 flex items-center justify-center w-full">
                {/* @ts-ignore - react-pageflip types are incomplete */}
                <HTMLFlipBook
                  width={400}
                  height={500}
                  size="stretch"
                  minWidth={315}
                  maxWidth={1000}
                  minHeight={400}
                  maxHeight={1533}
                  maxShadowOpacity={0.5}
                  showCover={false}
                  mobileScrollSupport={true}
                  onFlip={(e: any) => setCurrentPage(e.data)}
                  className="flipbook"
                  ref={bookRef}
                  startPage={0}
                  drawShadow={true}
                  flippingTime={1000}
                  usePortrait={false}
                  startZIndex={0}
                  autoSize={true}
                  clickEventForward={true}
                  useMouseEvents={true}
                  swipeDistance={30}
                  showPageCorners={true}
                  disableFlipByClick={false}
                >
                  {pdfPages.map((page, index) => (
                    <div key={index} className="page bg-white shadow-2xl">
                      <img 
                        src={page} 
                        alt={`Page ${index + 1}`} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </HTMLFlipBook>
              </div>
              
              {/* Navigation controls */}
              <div className="mt-4 flex items-center gap-4 bg-black/70 backdrop-blur-md px-8 py-4 rounded-full text-white shadow-elevated z-20">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
                  disabled={currentPage === 0}
                  className="text-white hover:text-accent hover:bg-white/10"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <span className="text-sm font-medium min-w-[100px] text-center">
                  Page {currentPage + 1} of {pdfPages.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => bookRef.current?.pageFlip()?.flipNext()}
                  disabled={currentPage >= pdfPages.length - 1}
                  className="text-white hover:text-accent hover:bg-white/10"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
};
