import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import * as pdfjsLib from "pdfjs-dist";
import { toast } from "sonner";
import $ from "jquery";
import "turn.js";

// Configure PDF.js worker with local file
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

interface FlipbookPreviewProps {
  pdfFile: File | null;
  backgroundColor: string;
  flipEffect: string;
  logo: string | null;
}

// Internal component for turn.js flipbook
const TurnJsFlipbook = ({ pages }: { pages: string[] }) => {
  const flipbookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (flipbookRef.current && pages.length > 0) {
      const $flipbook = $(flipbookRef.current);

      // Initialize turn.js
      ($flipbook as any).turn({
        width: 800,
        height: 600,
        autoCenter: true,
        display: "double",
        acceleration: true,
        elevation: 50,
        gradients: true,
        duration: 1000,
      });

      // Cleanup on unmount
      return () => {
        if (($flipbook as any).turn("is")) {
          ($flipbook as any).turn("destroy");
        }
      };
    }
  }, [pages]);

  return (
    <div ref={flipbookRef} className="flipbook-container">
      {pages.map((page, index) => (
        <div key={index} className="page bg-white shadow-2xl">
          <img 
            src={page} 
            alt={`Page ${index + 1}`} 
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>
  );
};

export const FlipbookPreview = ({
  pdfFile,
  backgroundColor,
  flipEffect,
  logo,
}: FlipbookPreviewProps) => {
  const [pdfPages, setPdfPages] = useState<string[]>([]);
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
            <TurnJsFlipbook pages={pdfPages} />
          ) : null}
        </div>
      </Card>
    </div>
  );
};
