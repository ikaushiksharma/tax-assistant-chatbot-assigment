"use client";
import { ChatRequestOptions } from "ai";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Paperclip, Send, X } from "lucide-react";

interface ChatInputProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>, options?: ChatRequestOptions) => void;
}

const taxTopics = [
  "W-2 Forms",
  "Standard Deduction",
  "Filing Status",
  "Tax Brackets",
  "Child Tax Credit",
  "Retirement Contributions (401k, IRA)",
  "Capital Gains Tax",
  "State Taxes",
  "Self-Employment Tax",
  "IRS Audit Risk",
];

const ChatInput: React.FC<ChatInputProps> = ({ input, onInputChange, onSubmit }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [randomTopics, setRandomTopics] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const getRandomTopics = () => taxTopics.sort(() => Math.random() - 0.5).slice(0, 3);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDiscardFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    onSubmit(e, {
      experimental_attachments: selectedFiles.map((file) => ({ name: file.name, url: "abc" })),
    });
    setRandomTopics(getRandomTopics());
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    setRandomTopics(getRandomTopics());
  }, []);

  return (
    <div className=" bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-4xl mx-auto p-4">
        {selectedFiles.length > 0 && (
          <div className="mb-3 space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm animate-fadeIn"
              >
                <Paperclip className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="flex-1 truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleDiscardFile(index)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {randomTopics.map((topic, index) => (
            <button
              key={index}
              type="button"
              onClick={() =>
                onInputChange({
                  target: { value: topic },
                } as React.ChangeEvent<HTMLTextAreaElement>)
              }
              className="px-4 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                         rounded-full text-sm font-medium transition-colors duration-200"
            >
              {topic}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={input}
            onChange={onInputChange}
            placeholder="Type your message..."
            className="w-full px-4 py-3 pr-24 bg-gray-50 dark:bg-gray-700 border border-gray-200 
                     dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 
                     focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
            rows={2}
          />
          <div className="absolute py-1 right-2 bottom-2 flex items-center gap-2">
            <label
              htmlFor="attachment"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                       dark:hover:text-gray-300 cursor-pointer transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </label>
            <input
              type="file"
              id="attachment"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
              multiple
            />
            <button
              type="submit"
              className="p-2 bg-indigo-600 hover:bg-indigo-800 text-white rounded-lg 
                       transition-colors duration-200 flex items-center gap-1"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
