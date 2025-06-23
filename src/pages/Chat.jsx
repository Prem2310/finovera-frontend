import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Send, Mic, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { useChatbotMutation } from "../hooks/mutations/useChatbotMutation";
import toast from "react-hot-toast";
import ReactMarkdown from 'react-markdown';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your fintech assistant. How can I help you with your financial questions today?",
      isBot: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [finalMessage, setFinalMessage] = useState("");

  const { mutateAsync: chatbotMutation, isPending } = useChatbotMutation({
    setFinalMessage,
  });

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim() || isTyping || isPending) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    // Show loading toast

    try {
      const response = await chatbotMutation({
        question: currentInput,
      });

      // Extract bot's message from response
      const botMessageText = response?.response || finalMessage || "Sorry, I didn't understand that.";

      const botMessage = {
        id: Date.now() + 1,
        text: botMessageText,
        isBot: true,
      };

      setMessages((prev) => [...prev, botMessage]);
      
      // Show success toast
    } catch (error) {
      console.error("Chat API Error:", error);
      
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.";
      
      const botErrorMessage = {
        id: Date.now() + 1,
        text: errorMessage,
        isBot: true,
        isError: true,
      };
      
      setMessages((prev) => [...prev, botErrorMessage]);
      
      // Show error toast
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

function formatMessage(text) {
  // Split text into lines and process each line
  const lines = text.split('\n').filter(line => line.trim() !== '');
  let output = [];
  let currentList = null; // Track active list type ('ul', 'ol', or null)
  let listItems = []; // Accumulate list items

  const flushList = () => {
    if (listItems.length > 0) {
      const ListTag = currentList === 'ul' ? 'ul' : 'ol';
      output.push(
        <ListTag key={`list-${output.length}`} className="list-disc pl-6 space-y-2">
          {listItems.map((item, idx) => (
            <li key={`item-${idx}`} className="text-sm md:text-base">
              {processInlineMarkdown(item)}
            </li>
          ))}
        </ListTag>
      );
      listItems = [];
      currentList = null;
    }
  };

const processInlineMarkdown = (text) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const codeInlineRegex = /`([^`]+)`/g;

  let elements = [];
  let lastIndex = 0;

  const matches = [...text.matchAll(linkRegex)];
  if (matches.length > 0) {
    matches.forEach((match, i) => {
      const [full, label, href] = match;
      const index = match.index;
      if (index > lastIndex) {
        elements.push(...processInlineMarkdown(text.slice(lastIndex, index)));
      }
      elements.push(
        <a key={`link-${i}`} href={href} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
      lastIndex = index + full.length;
    });

    if (lastIndex < text.length) {
      elements.push(...processInlineMarkdown(text.slice(lastIndex)));
    }

    return elements;
  }

  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
    } else if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index} className="italic">{part.slice(1, -1)}</em>;
    } else if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};


  lines.forEach((line, index) => {
    // Handle headings
    if (line.startsWith('# ')) {
      flushList();
      output.push(
        <h1 key={index} className="text-xl md:text-2xl font-bold mt-4 mb-2 text-slate-900">
          {processInlineMarkdown(line.slice(2).trim())}
        </h1>
      );
      return;
    } else if (line.startsWith('## ')) {
      flushList();
      output.push(
        <h2 key={index} className="text-lg md:text-xl font-semibold mt-3 mb-2 text-slate-900">
          {processInlineMarkdown(line.slice(3).trim())}
        </h2>
      );
      return;
    }

    // Handle unordered lists
    if (line.trim().startsWith('- ')) {
      if (currentList !== 'ul') {
        flushList();
        currentList = 'ul';
      }
      listItems.push(line.slice(2).trim());
      return;
    }

    // Handle numbered lists
    if (/^\d+\.\s/.test(line.trim())) {
      if (currentList !== 'ol') {
        flushList();
        currentList = 'ol';
      }
      listItems.push(line.replace(/^\d+\.\s/, '').trim());
      return;
    }

    // Handle paragraphs
    flushList();
    if (line.trim()) {
      output.push(
        <p key={index} className="text-sm md:text-base leading-relaxed">
          {processInlineMarkdown(line.trim())}
        </p>
      );
    }
  });

  // Flush any remaining list items
  flushList();

  return <div>{output}</div>;
}



return (
  <div className="flex h-full w-full justify-center ">
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex flex-col h-full w-1/2 justify-center relative">
      {/* Header */}
      <motion.div
        className="sticky top-0 px-6 py-4 shadow-sm z-10 bg-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-zinc-600 to-zinc-800 flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Fintech Assistant</h1>
            <p className="text-sm text-slate-500">Your AI-powered financial advisor</p>
          </div>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${message.isBot ? "justify-start" : "justify-end"} group`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`flex items-start space-x-3 max-w-3xl ${
                    message.isBot ? "" : "flex-row-reverse space-x-reverse"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.isBot
                        ? "bg-gradient-to-r from-zinc-600 to-zinc-800"
                        : "bg-gradient-to-r from-slate-600 to-slate-800"
                    }`}
                  >
                    {message.isBot ? (
                      <Bot className="h-4 w-4 text-white" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex flex-col ${message.isBot ? "items-start" : "items-end"}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        message.isBot
                          ? message.isError
                            ? "bg-red-50 border border-red-200 text-red-800"
                            : "bg-white border border-slate-200 text-slate-900"
                          : "bg-gradient-to-r from-zinc-600 to-zinc-800 text-white"
                      }`}
                    >
                      <div className="text-sm md:text-base leading-relaxed">
                      <ReactMarkdown>
                        {message.text}
                      </ReactMarkdown>                      
                      </div>
                    </div>

                    {/* Timestamp and Actions */}
                    <div
                      className={`flex items-center mt-1 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                        message.isBot ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      {message.isBot && !message.isError && (
                        <div className="flex space-x-1">
                          <button className="p-1 rounded-full hover:bg-slate-100 transition-colors">
                            <Copy className="h-3 w-3 text-slate-400" />
                          </button>
                          <button className="p-1 rounded-full hover:bg-slate-100 transition-colors">
                            <ThumbsUp className="h-3 w-3 text-slate-400" />
                          </button>
                          <button className="p-1 rounded-full hover:bg-slate-100 transition-colors">
                            <ThumbsDown className="h-3 w-3 text-slate-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              className="flex justify-start group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start space-x-3 max-w-3xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-zinc-600 to-zinc-800 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-slate-400"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-slate-400"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-slate-400"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Suggestions */}
      <motion.div
        className="sticky bottom-16 px-4 pb-4 z-10 bg-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              "What is TCS stock price?",
              "Investment strategies for beginners",
              "Retirement planning tips",
              "Crypto market analysis",
              "Tax-saving investments",
            ].map((suggestion, index) => (
              <motion.button
                key={index}
                className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Input Form */}
      <motion.div
        className="sticky bottom-0 bg-white border-t border-slate-200 px-4 py-4 shadow-lg z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about investments, savings, or financial planning..."
                className="w-full border border-slate-300 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-zink-500 focus:border-transparent text-slate-900 placeholder-slate-500 shadow-sm"
                disabled={isTyping}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Mic className="h-4 w-4" />
              </motion.button>
            </div>
            <motion.button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className={`p-3 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                inputValue.trim() && !isTyping
                  ? "bg-gradient-to-r from-zinc-600 to-zinc-800 hover:from-blue-600 hover:to-purple-700 text-white hover:shadow-xl"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
              whileHover={{ scale: inputValue.trim() && !isTyping ? 1.05 : 1 }}
              whileTap={{ scale: inputValue.trim() && !isTyping ? 0.95 : 1 }}
            >
              {isTyping ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
    </div>
  );
};

export default Chat;
