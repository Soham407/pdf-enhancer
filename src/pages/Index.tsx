import { useState, useRef } from "react";
import { HeroSection } from "@/components/HeroSection";
import { UploadSection } from "@/components/UploadSection";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { FlipbookPreview } from "@/components/FlipbookPreview";
import { ShareExportPanel } from "@/components/ShareExportPanel";
import { DemoFlipbook } from "@/components/DemoFlipbook";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<"hero" | "upload" | "editor">("hero");
  const demoRef = useRef<HTMLDivElement>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [flipEffect, setFlipEffect] = useState("peel");
  const [logo, setLogo] = useState<string | null>(null);

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
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Header for mobile */}
      <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToUpload}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="font-bold">Flipbook Editor</h1>
        <div className="w-20" /> {/* Spacer for centering */}
      </div>

      {/* Customization Panel */}
      <div className="hidden lg:block">
        <CustomizationPanel
          backgroundColor={backgroundColor}
          onBackgroundChange={setBackgroundColor}
          flipEffect={flipEffect}
          onFlipEffectChange={setFlipEffect}
          onLogoUpload={handleLogoUpload}
        />
      </div>

      {/* Preview Area */}
      <FlipbookPreview
        pdfFile={pdfFile}
        backgroundColor={backgroundColor}
        flipEffect={flipEffect}
        logo={logo}
      />

      {/* Share & Export Panel */}
      <div className="hidden lg:block">
        <ShareExportPanel />
      </div>
    </div>
  );
};

export default Index;
