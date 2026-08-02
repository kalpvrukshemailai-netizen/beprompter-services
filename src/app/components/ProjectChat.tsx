import { useState, useEffect, useRef } from "react";
import { Send, Loader2, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  profiles?: { full_name: string; role: string };
}

export function ProjectChat({ projectId, currentUserId }: { projectId: string; currentUserId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    // Subscribe to real-time messages
    const channel = supabase
      .channel(`project_messages_${projectId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `project_id=eq.${projectId}` },
        (payload) => {
          // Fetch the message with profile info
          fetchSingleMessage(payload.new.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*, profiles(full_name, role)")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });
    
    if (data) setMessages(data as any);
    setLoading(false);
  };

  const fetchSingleMessage = async (msgId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*, profiles(full_name, role)")
      .eq("id", msgId)
      .single();
    
    if (data) {
      setMessages((prev) => {
        // Prevent duplicates
        if (prev.find(m => m.id === data.id)) return prev;
        return [...prev, data as any];
      });
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    const { error } = await supabase.from("messages").insert({
      project_id: projectId,
      sender_id: currentUserId,
      content: input.trim(),
    });

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setInput("");
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-10">
        <Loader2 size={24} className="animate-spin text-white/30" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#050505] border-l border-white/10 rounded-r-xl overflow-hidden">
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#60c8ff]/10 flex items-center justify-center">
          <User size={14} className="text-[#60c8ff]" />
        </div>
        <div>
          <h3 className="text-white text-sm font-bold tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Project Chat</h3>
          <p className="text-white/40 text-[10px] tracking-widest uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>Real-time Comm</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <p className="text-white/30 text-sm font-bold uppercase tracking-widest mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>No messages yet</p>
            <p className="text-white/20 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Start the conversation about this project.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            const isClient = msg.profiles?.role === "client";
            
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${isMe ? 'ml-auto' : ''}`}>
                <div className="flex items-baseline gap-2 mb-1 px-1">
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {msg.profiles?.full_name || "Unknown"}
                  </span>
                  {!isClient && (
                    <span className="bg-[#60c8ff]/20 text-[#60c8ff] text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm">
                      {msg.profiles?.role}
                    </span>
                  )}
                </div>
                <div 
                  className={`p-3 rounded-lg text-sm leading-relaxed ${isMe ? 'bg-[#60c8ff] text-black rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none'}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-white/10 bg-white/5">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-black border border-white/10 text-white text-sm px-4 py-3 rounded-md outline-none focus:border-[#60c8ff]/50 transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="bg-[#60c8ff] text-black px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </form>
    </div>
  );
}
