import {useState, useEffect, useRef} from "react";

import "./App.css";

type ChatMessage = {
  id: number;
  content: string;
  isUser: boolean;
};

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [aiReady, setAiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const checkReady = setInterval(() => {
    if(window.puter?.ai){
      setAiReady(true);
      clearInterval(checkReady)
    }
  }, 300);
  return () => clearInterval(checkReady);
}, []);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
}

useEffect(scrollToBottom, [messages]);

const addMessage = (message: string, isUser: boolean) => {
  setMessages((prev) => [
    ...prev,
    { content: message, isUser, id: Date.now() + Math.random() },
    
  ]);
  console.log("Puter response:", message)
};

const sendMessage = async () => {
  const message = inputValue.trim();
  if(!message) return;
  if(!aiReady) {
    addMessage("Please wait while the AI is loading...", false);
    return;
  }

  addMessage(message, true);
  setInputValue("");
  setIsLoading(true);
  
  try{
    const response = await window.puter.ai.chat(message);
    
    const reply =
    typeof response === "string"
      ? response
      : response.output_text ??
        response.message?.content ??
        response.message?.context ??
        response.choices?.[0]?.message?.content ??
        "No reply received";

    addMessage(reply, false);
  } catch (error) {
    console.error("Error sending message:", error);
    addMessage("Sorry, there was an error processing your request. Please try again later.", false);
  } finally {
    setIsLoading(false);
  };
};

const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if(e.key === "Enter" && !e.shiftKey){
    e.preventDefault();
    sendMessage();
  }
}

  return (
      <div className="min-h-screen bg-gradient-to-br from-sky-900 via-slate-950 to-emerald-90 flex flex-col items-center justify-center p-4 gap-8">
        <h1 className="text-6xl sm:text-7xl font-light bg-gradient-to-r from-emerald-400 via-sky-300 to-blue-500 bg-clip-text text-transparent h-20">
          AI Chatbot app
        </h1>
        
        <div className={`px-4 py-2 rounded-full text-sm ${aiReady ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/20"}`}>{aiReady ? "AI is ready 🟢" : "AI is loading..."}</div>

        <div className="w-full max-w-2xl bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-md border border-gray-600 rounded-3xl p-6 shadow-2xl">
        <div className="h-80 overflow-y-auto border-b border-gray-600 mb-6 p-4 bg-gradient-to-b from-gray-900/50 to-gray-800/50 rounded-2xl">
          {
          messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20">Hi! Start the message by typing your question...</div>
          )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={` p-3 m-2 rounded-2xl max-w-xs text-wrap ${msg.isUser ? "bg-gradient-to-r from-emerald-600 text-white" : "bg-gradient-to-r from-emerald-600 to-indigo-600 text-white"}`}>
          <div className="whitespace-pre-wrap">{msg.content}</div>
        </div>
        ))}
        {
          isLoading && (
            <div className="p-3 m-2 rounded-2xl max-w-xs bg-gradient-to-r from-emerald-600 to-indiago text-white">
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full">
                </div>
                Thinking...
              </div>
            </div>
          )
        }

        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyPress} placeholder={aiReady ? "Type your message..." : "Please wait while the AI is loading..."} 
        disabled={!aiReady || isLoading}
        className="flex-1 px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:shadow-xl 
        focus:shadow-sky-400/80 focus:ring-sky-500 transition duration-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button onClick={sendMessage} disabled={!aiReady || isLoading || !inputValue.trim()} className="px-6 py-3 bg-gradient-to-r from-sky-400 to-emerald-400 hover:opacity-80
        text-white font-semibold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed
        ">{isLoading ? (<div className="flex items-center gap-2"><div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full">
          Sending...
        </div>

        </div>): "Send"}</button> 
        </div>
      </div>
    </div>

  );
}

export default App;