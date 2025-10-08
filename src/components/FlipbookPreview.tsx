import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { toast } from "sonner";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [pdfDimensions, setPdfDimensions] = useState({ width: 550, height: 733 });
  const bookRef = useRef<any>(null);
  const isMobile = useIsMobile();

  // Derived counts accounting for added cover pages (front + back)
  const totalFlipPages = pdfPages.length + 2;
  const displayPage = Math.min(Math.max(currentPage - 1, 0) + 1, pdfPages.length);

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
            
            // Get dimensions from first page
            const firstPage = await pdf.getPage(1);
            const firstViewport = firstPage.getViewport({ scale: 1 });
            setPdfDimensions({ width: firstViewport.width, height: firstViewport.height });
            
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
            
            // Add blank page if odd number of pages
            if (pages.length % 2 !== 0) {
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.width = 800;
              canvas.height = 1200;
              
              if (context) {
                context.fillStyle = 'white';
                context.fillRect(0, 0, canvas.width, canvas.height);
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
    <div 
      className="h-screen pt-6 px-6 pb-6 overflow-hidden flex items-center justify-center relative"
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
          <div className="relative w-full h-full flex items-center justify-center max-w-7xl mx-auto">
            {/* Page counter at top */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-6 py-2 rounded-full text-white shadow-elevated z-30">
              <span className="text-sm font-medium">
                Page {displayPage} of {pdfPages.length}
              </span>
            </div>

            {/* Left navigation button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
              disabled={currentPage === 0}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 bg-black/70 backdrop-blur-md text-white hover:text-accent hover:bg-black/80 rounded-full shadow-elevated z-30"
            >
              <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
            </Button>

            {/* Flipbook Container */}
            <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
              {/* @ts-ignore - react-pageflip types are incomplete */}
              <HTMLFlipBook
                width={pdfDimensions.width}
                height={pdfDimensions.height}
                size="stretch"
                minWidth={315}
                maxWidth={1000}
                minHeight={420}
                maxHeight={1333}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={(e: any) => setCurrentPage(e.data)}
                className="flipbook h-full w-auto !max-w-full"
                ref={bookRef}
                key={isMobile ? "portrait" : "landscape"}
                startPage={0}
                drawShadow={true}
                flippingTime={1000}
                usePortrait={isMobile}
                startZIndex={0}
                autoSize={true}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
              >
                {/* Front cover dummy */}
                <div className="page bg-white" />

                {pdfPages.map((page, index) => (
                  <div key={index} className="page flex items-center justify-center shadow-2xl bg-white">
                    <img src={page} alt={`Page ${index + 1}`} className="max-h-full max-w-full object-contain" />
                  </div>
                ))}

                {/* Back cover dummy */}
                <div className="page bg-white" />
              </HTMLFlipBook>
            </div>

            {/* Right navigation button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => bookRef.current?.pageFlip()?.flipNext()}
              disabled={currentPage >= totalFlipPages - 1}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 bg-black/70 backdrop-blur-md text-white hover:text-accent hover:bg-black/80 rounded-full shadow-elevated z-30"
            >
              <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
