import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useChatbotMutation } from "../hooks/mutations/useChatbotMutation";
import toast from "react-hot-toast";

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

  const { mutateAsync: chatbotMutation } = useChatbotMutation({
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

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    toast.loading("Processing your request...");

    try {
      const response = await chatbotMutation({
        question: inputValue,
      });

      // Extract bot's message from response
      const botMessageText =
        response?.response || "Sorry, I didn't understand that.";

      const botMessage = {
        id: messages.length + 2,
        text: botMessageText,
        isBot: true,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred.";
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          text: errorMessage,
          isBot: true,
          isError: true,
        },
      ]);
    } finally {
      setIsTyping(false);
      toast.dismiss(); // Remove loading toast
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col text-zinc-900 dark:text-zinc-50">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`flex ${
                message.isBot ? "justify-start" : "justify-end"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message.isBot && (
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center mr-2 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-zinc-900 "
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
              )}
              <div
                className={`max-w-lg rounded-2xl px-4 py-3 ${
                  message.isBot
                    ? message.isError
                      ? "bg-red-100 dark:bg-red-900/30"
                      : "bg-white text-black border border-zinc-800 dark:border-zinc-800"
                    : "bg-zinc-800 dark:bg-white text-white dark:text-zinc-800"
                }`}
              >
                <p className="text-sm md:text-base">{message.text}</p>
              </div>
              {!message.isBot && (
                <div className="w-8 h-8 rounded-full bg-zinc-800 dark:bg-white flex items-center justify-center ml-2 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white dark:text-zinc-800"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center mr-2 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-zinc-700 dark:text-zinc-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-zinc-400"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-zinc-400"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-zinc-400"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Suggestions */}
      <motion.div
        className="px-4 pb-3 -mt-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-3xl mx-auto flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            "Investment strategies",
            "Retirement planning",
            "Stock market trends",
            "Crypto analysis",
          ].map((suggestion, index) => (
            <motion.button
              key={index}
              className="whitespace-nowrap px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setInputValue(suggestion)}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Input Form */}
      <motion.div
        className="border-t border-zinc-200 px-4 py-4 bg-white dark:bg-zinc-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about investments, savings, or financial planning..."
                className="w-full bg-zinc-100  border border-zinc-200  rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-500 dark:placeholder-zinc-400"
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="22"></line>
                </svg>
              </motion.button>
            </div>
            <motion.button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className={`p-3 rounded-full flex items-center justify-center ${
                inputValue.trim() && !isTyping
                  ? "bg-zinc-800  dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-800"
                  : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
              }`}
              whileHover={{ scale: inputValue.trim() && !isTyping ? 1.05 : 1 }}
              whileTap={{ scale: inputValue.trim() && !isTyping ? 0.95 : 1 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Footer */}
    </div>
  );
};

export default Chat;
