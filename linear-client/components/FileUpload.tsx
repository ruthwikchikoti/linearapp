import { useState, useRef } from "react";

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
}

export default function FileUpload({ onUpload, multiple = false, accept = "*" }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;
    
    setFiles(selectedFiles);
    setUploading(true);
    
    // Create previews for images
    const imagePreviews: string[] = [];
    selectedFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          imagePreviews.push(result);
          if (imagePreviews.length === selectedFiles.filter(f => f.type.startsWith("image/")).length) {
            setPreviews(imagePreviews);
          }
        };
        reader.readAsDataURL(file);
      }
    });
    
    try {
      // Call onUpload with files - parent handles upload
      await onUpload(selectedFiles);
    } finally {
      // Reset input after upload completes
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(previews.filter((_, i) => i !== index));
    onUpload(newFiles);
  };

  return (
    <div className="file-upload">
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="upload-button"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "📎 Attach files"}
      </button>
      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              {file.type.startsWith("image/") && previews[index] && (
                <img src={previews[index]} alt={file.name} className="file-preview" />
              )}
              <span className="file-name">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="file-remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

