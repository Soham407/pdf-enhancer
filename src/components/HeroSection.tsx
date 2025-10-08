import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
}

export const HeroSection = ({ onGetStarted, onViewDemo }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-bg">
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-end">
        <Button variant="outline" onClick={() => navigate("/pricing")}>
          View Pricing
        </Button>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          100% Free • No Watermarks • No Ads
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
          Transform PDFs into
          <br />
          Stunning Flipbooks
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Create beautiful, interactive digital flipbooks with realistic page-turning effects. 
          Perfect for catalogs, brochures, magazines, and more.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-hero hover:opacity-90 transition-opacity shadow-elevated"
            onClick={onGetStarted}
          >
            <Upload className="mr-2 h-5 w-5" />
            Create Your Flipbook
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-6 border-2"
            onClick={onViewDemo}
          >
            See Demo
          </Button>
        </div>

        {/* Feature badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Realistic Page Peel
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Full Customization
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Easy Sharing
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Mobile Responsive
          </div>
        </div>
      </div>
    </section>
  );
};
