import { UIMessage } from "ai";
import React, { useEffect, useRef } from "react";
import { TableDataType } from "@/types";
import { Table } from "./table";

interface ChatWindowProps {
  messages: UIMessage[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-gradient-to-r from-slate-500 to-slate-700"
    >
      {messages.map((msg, id) => (
        <div
          key={id}
          className={`flex animate-fadeIn ${
            msg.role === "user" ? "justify-end ml-12 md:ml-40" : "justify-start mr-12 md:mr-40"
          }`}
        >
          <div className="flex flex-col max-w-[85%]">
            {msg?.experimental_attachments && msg.experimental_attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2 items-center text-sm text-gray-300 bg-gray-700/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                {msg?.experimental_attachments?.map((attachment, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 bg-gray-600/50 px-2 py-1 rounded-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    {typeof attachment === "string" ? attachment : attachment.name}
                  </span>
                ))}
              </div>
            )}
            <div
              className={`p-4 rounded-2xl shadow-lg transition-all duration-200 ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white ml-auto"
                  : "bg-white/10 text-gray-100 backdrop-blur-sm"
              }`}
            >
              {msg.parts.map((part, index) => {
                return (
                  <React.Fragment key={index}>
                    {part.type === "text" && (
                      <div className="leading-relaxed whitespace-pre-wrap break-words">
                        {part.text.split("\\n").map((line, subIdx) => (
                          <React.Fragment key={subIdx}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                    {part.type === "reasoning" && part.reasoning === "TABLE" && (
                      <div className="mt-2  rounded-lg">
                        <Table data={part?.details as TableDataType} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
