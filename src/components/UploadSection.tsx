import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
}

export const UploadSection = ({ onFileSelect }: UploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      if (file.size > 100 * 1024 * 1024) {
        toast.error("File size must be less than 100MB");
        return;
      }
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      toast.error("Please upload a PDF file");
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error("File size must be less than 100MB");
        return;
      }
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-bg">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Upload Your PDF</h2>
          <p className="text-muted-foreground">
            Upload your PDF file to start creating your interactive flipbook
          </p>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 bg-card shadow-card ${
            isDragging
              ? "border-primary bg-primary/5 scale-105"
              : "border-border hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <Upload className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Drop your PDF here
              </h3>
              <p className="text-muted-foreground mb-6">
                or click to browse
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button className="bg-gradient-hero hover:opacity-90" asChild>
                  <span>Choose File</span>
                </Button>
              </label>
              <p className="text-sm text-muted-foreground mt-4">
                Maximum file size: 100MB
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
