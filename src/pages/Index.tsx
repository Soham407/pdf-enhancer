import { useState, useRef } from "react";
import { HeroSection } from "@/components/HeroSection";
import { UploadSection } from "@/components/UploadSection";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { FlipbookPreview } from "@/components/FlipbookPreview";
import { ShareExportPanel } from "@/components/ShareExportPanel";
import { DemoFlipbook } from "@/components/DemoFlipbook";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Palette, Share2 } from "lucide-react";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<"hero" | "upload" | "editor">("hero");
  const demoRef = useRef<HTMLDivElement>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [flipEffect, setFlipEffect] = useState("peel");
  const [logo, setLogo] = useState<string | null>(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const handleGetStarted = () => {
    setCurrentStep("upload");
  };

  const handleFileSelect = (file: File) => {
    setPdfFile(file);
    setCurrentStep("editor");
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogo(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBackToUpload = () => {
    setCurrentStep("upload");
    setPdfFile(null);
  };

  const handleViewDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (currentStep === "hero") {
    return (
      <div ref={demoRef}>
        <HeroSection onGetStarted={handleGetStarted} onViewDemo={handleViewDemo} />
        <DemoFlipbook />
      </div>
    );
  }

  if (currentStep === "upload") {
    return <UploadSection onFileSelect={handleFileSelect} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header with drawer controls */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToUpload}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="font-bold">Flipbook Editor</h1>
        <div className="flex gap-2">
          <Sheet open={customizeOpen} onOpenChange={setCustomizeOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Palette className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <CustomizationPanel
                backgroundColor={backgroundColor}
                onBackgroundChange={setBackgroundColor}
                flipEffect={flipEffect}
                onFlipEffectChange={setFlipEffect}
                onLogoUpload={handleLogoUpload}
              />
            </SheetContent>
          </Sheet>

          <Sheet open={shareOpen} onOpenChange={setShareOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <ShareExportPanel />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden">
        <FlipbookPreview
          pdfFile={pdfFile}
          backgroundColor={backgroundColor}
          flipEffect={flipEffect}
          logo={logo}
        />
      </div>
    </div>
  );
};

export default Index;
