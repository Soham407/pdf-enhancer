import { useEffect, useRef } from "react";
import { Card } from "./ui/card";

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

  useEffect(() => {
    // This is a placeholder for the actual flipbook implementation
    // In a real implementation, you would use a library like turn.js or implement custom page-turning logic
    console.log("PDF File:", pdfFile);
    console.log("Flip Effect:", flipEffect);
  }, [pdfFile, flipEffect]);

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
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Sample flipbook pages */}
              <div className="relative w-[80%] h-[80%] shadow-2xl">
                <div
                  className="absolute inset-0 bg-white rounded-r-lg shadow-lg border-r border-gray-200"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "perspective(2000px) rotateY(-5deg)",
                  }}
                >
                  <div className="p-8 h-full flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      Sample Page 1
                    </h3>
                    <p className="text-gray-600">
                      This is a preview of your flipbook. The actual pages will be
                      rendered from your PDF.
                    </p>
                    <div className="mt-auto text-sm text-gray-400 text-right">
                      Page 1
                    </div>
                  </div>
                </div>
                <div
                  className="absolute inset-0 bg-white rounded-l-lg shadow-lg border-l border-gray-200"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "perspective(2000px) rotateY(5deg)",
                    left: "50%",
                  }}
                >
                  <div className="p-8 h-full flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      Sample Page 2
                    </h3>
                    <p className="text-gray-600">
                      Click and drag the corners to turn pages with the {flipEffect}{" "}
                      effect.
                    </p>
                    <div className="mt-auto text-sm text-gray-400">Page 2</div>
                  </div>
                </div>
              </div>

              {/* Page turn indicator */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full text-white">
                <button className="hover:text-accent transition-colors">←</button>
                <span className="text-sm">1 of 2</span>
                <button className="hover:text-accent transition-colors">→</button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
