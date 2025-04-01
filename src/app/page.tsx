"use client";

import React from "react";
import { useChat } from "@ai-sdk/react";
import ChatWindow from "../components/chat-window";
import ChatInput from "../components/chat-input";
import { ReasoningUIPart, StepStartUIPart, TableRowType } from "@/types";
import { Calculator } from "lucide-react";

const ChatPage: React.FC = () => {
  const onResponse = async (response: Response) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;

    // Add a placeholder message to update continuously
    const messageId = Date.now().toString();
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: messageId,
        content: "",
        role: "assistant",
      },
    ]);

    if (!reader) return;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value, { stream: !done });

        if (chunk === "DATA BEGINS HERE") {
          // Signal that data is coming next
          const signalPart: StepStartUIPart = {
            type: "step-start",
          };
          const reasoning: ReasoningUIPart = {
            type: "reasoning",
            reasoning: "TABLE",
            details: [],
          };
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = {
              ...updatedMessages[updatedMessages.length - 1],
              parts: [
                ...(updatedMessages[updatedMessages.length - 1]?.parts || []),
                signalPart,
                reasoning,
              ],
            };
            return updatedMessages;
          });
        } else if (chunk.startsWith("{") && chunk.endsWith(",")) {
          // This is a data item (JSON object followed by comma)
          try {
            const dataItem: TableRowType = JSON.parse(chunk.slice(0, -1)); // Remove trailing comma
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages];
              const lastMessage = updatedMessages[updatedMessages.length - 1];
              const reasoningType = lastMessage?.parts?.[
                lastMessage?.parts?.length - 1
              ] as ReasoningUIPart;
              reasoningType?.details?.push(dataItem);

              return updatedMessages;
            });
          } catch (e) {
            console.error("Error parsing data item:", e);
          }
        } else {
          // Regular text chunk
          // @ts-expect-error state warning
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];

            // Check if we need to add to the last part or create a new one
            if (
              lastMessage?.parts &&
              lastMessage?.parts?.length > 0 &&
              lastMessage?.parts?.[lastMessage?.parts?.length - 1]?.type === "text"
            ) {
              // Append to existing text part
              const parts = [...lastMessage?.parts] as { type: string; text: string }[];
              parts[parts.length - 1] = {
                ...parts[parts.length - 1],
                text: parts[parts.length - 1]?.text + chunk,
              };

              return updatedMessages.map((msg, i) =>
                i === updatedMessages.length - 1 ? { ...msg, parts } : msg,
              );
            } else {
              // Add new text part
              return updatedMessages.map((msg, i) =>
                i === updatedMessages.length - 1
                  ? {
                      ...msg,
                      parts: [...(msg?.parts || []), { type: "text", text: chunk }],
                    }
                  : msg,
              );
            }
          });
        }
      }
    }
  };

  const { messages, setMessages, input, handleInputChange, handleSubmit } = useChat({
    onResponse,
  });

  return (
    <div className="flex flex-col max-w-7xl mx-auto h-screen">
      <header className="relative bg-gradient-to-r from-indigo-900 to-indigo-800 p-3 shadow-lg">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-center gap-3">
          <Calculator className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white">Tax Assistant</h1>
            <p className="text-indigo-100 text-sm mt-1">
              Your AI-powered tax consultation companion
            </p>
          </div>
        </div>
      </header>
      <div className="flex flex-col bg-gray-800 flex-grow w-full mx-auto">
        <ChatWindow messages={messages} />
        <ChatInput input={input} onInputChange={handleInputChange} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ChatPage;
