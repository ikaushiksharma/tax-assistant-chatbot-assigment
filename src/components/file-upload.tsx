import React, { ChangeEvent } from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="p-4">
      <input
        type="file"
        onChange={handleFileChange}
        className="border border-gray-300 p-2 rounded-md"
      />
    </div>
  );
};

export default FileUpload;
