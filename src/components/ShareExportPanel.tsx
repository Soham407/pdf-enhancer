import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Copy, Download, Code, ExternalLink, Check } from "lucide-react";
import { toast } from "sonner";

export const ShareExportPanel = () => {
  const [copied, setCopied] = useState<string | null>(null);
  
  // Example URLs - in production, these would be generated after publishing
  const shareUrl = "https://flipbookmaker.app/view/abc123xyz";
  const embedCode = `<iframe src="${shareUrl}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = () => {
    toast.success("Preparing download...");
    // In production, this would trigger the actual download
  };

  return (
    <div className="w-full lg:w-96 bg-card border-l border-border p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">Share & Export</h2>

      {/* Direct Link */}
      <Card className="p-4 mb-4">
        <Label className="text-base font-semibold mb-3 flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Direct Link
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          Share this link to let anyone view your flipbook
        </p>
        <div className="flex gap-2">
          <Input
            value={shareUrl}
            readOnly
            className="flex-1 text-sm"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleCopy(shareUrl, "link")}
          >
            {copied === "link" ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </Card>

      {/* Embed Code */}
      <Card className="p-4 mb-4">
        <Label className="text-base font-semibold mb-3 flex items-center gap-2">
          <Code className="w-4 h-4" />
          Embed Code
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          Copy this code to embed the flipbook on your website
        </p>
        <div className="relative">
          <textarea
            value={embedCode}
            readOnly
            className="w-full h-24 p-3 text-xs font-mono bg-muted rounded-lg border border-border resize-none"
          />
          <Button
            size="sm"
            variant="outline"
            className="absolute top-2 right-2"
            onClick={() => handleCopy(embedCode, "embed")}
          >
            {copied === "embed" ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Download */}
      <Card className="p-4 mb-4">
        <Label className="text-base font-semibold mb-3 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          Download your flipbook as an offline HTML5 package
        </p>
        <Button
          className="w-full bg-gradient-hero hover:opacity-90"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Flipbook
        </Button>
      </Card>

      {/* Customize Embed Size */}
      <Card className="p-4">
        <Label className="text-base font-semibold mb-3 block">
          Embed Size
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="width" className="text-xs text-muted-foreground">
              Width (px)
            </Label>
            <Input
              id="width"
              type="number"
              defaultValue={800}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-xs text-muted-foreground">
              Height (px)
            </Label>
            <Input
              id="height"
              type="number"
              defaultValue={600}
              className="mt-1"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
