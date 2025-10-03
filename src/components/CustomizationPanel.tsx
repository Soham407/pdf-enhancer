import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Upload } from "lucide-react";

interface CustomizationPanelProps {
  backgroundColor: string;
  onBackgroundChange: (color: string) => void;
  flipEffect: string;
  onFlipEffectChange: (effect: string) => void;
  onLogoUpload: (file: File) => void;
}

const flipEffects = [
  { id: "peel", name: "Realistic Page Peel", description: "Interactive corner drag with shadows" },
  { id: "slide", name: "Simple Slide", description: "Modern horizontal sliding effect" },
  { id: "card", name: "Card Flip", description: "Simple flip like a playing card" },
];

const backgroundColors = [
  { id: "white", value: "#ffffff", name: "White" },
  { id: "cream", value: "#f8f6f3", name: "Cream" },
  { id: "light-gray", value: "#f5f5f5", name: "Light Gray" },
  { id: "dark", value: "#1a1a1a", name: "Dark" },
];

export const CustomizationPanel = ({
  backgroundColor,
  onBackgroundChange,
  flipEffect,
  onFlipEffectChange,
  onLogoUpload,
}: CustomizationPanelProps) => {
  const handleLogoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLogoUpload(file);
    }
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-6">Customize</h2>

      {/* Background Color */}
      <Card className="p-4 mb-6">
        <Label className="text-base font-semibold mb-3 block">Background</Label>
        <div className="grid grid-cols-2 gap-2">
          {backgroundColors.map((color) => (
            <button
              key={color.id}
              onClick={() => onBackgroundChange(color.value)}
              className={`group relative h-16 rounded-lg border-2 transition-all ${
                backgroundColor === color.value
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
              style={{ backgroundColor: color.value }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white rounded-lg">
                {color.name}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-3">
          <Label htmlFor="custom-color" className="text-sm text-muted-foreground">
            Custom Color
          </Label>
          <input
            id="custom-color"
            type="color"
            value={backgroundColor}
            onChange={(e) => onBackgroundChange(e.target.value)}
            className="w-full h-10 rounded-lg border border-border cursor-pointer mt-1"
          />
        </div>
      </Card>

      {/* Flip Effect */}
      <Card className="p-4 mb-6">
        <Label className="text-base font-semibold mb-3 block">Page Turn Effect</Label>
        <div className="space-y-2">
          {flipEffects.map((effect) => (
            <button
              key={effect.id}
              onClick={() => onFlipEffectChange(effect.id)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                flipEffect === effect.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="font-medium">{effect.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {effect.description}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Logo Upload */}
      <Card className="p-4 mb-6">
        <Label className="text-base font-semibold mb-3 block">Branding</Label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoInput}
          className="hidden"
          id="logo-upload"
        />
        <label htmlFor="logo-upload">
          <Button variant="outline" className="w-full" asChild>
            <span>
              <Upload className="mr-2 h-4 w-4" />
              Upload Logo
            </span>
          </Button>
        </label>
        <p className="text-xs text-muted-foreground mt-2">
          Add your logo to the flipbook viewer
        </p>
      </Card>
    </div>
  );
};
