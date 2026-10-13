import { useState, useEffect, useRef } from "react";
import { Plus, Download, Copy, Save, Edit3, Trash2 } from "lucide-react";

interface Script {
  id: string;
  title: string;
  category: string;
  subject: string;
  body: string;
}

const DEFAULT_SCRIPTS: Script[] = [
  {
    id: "1",
    title: "A value-first introduction",
    category: "Email • Outreach",
    subject: "A small idea for [Company]'s lead follow-up",
    body: "Hi [Name],\n\nI noticed [relevant_observation] about [Company]. It made me think about how your team handles new property enquiries.\n\nAt BEPROMPTER, we help real estate teams turn more enquiries into conversations with a smart WhatsApp bot and a streamlined follow-up process.\n\nI put together two ideas that could help [Company] respond faster without adding more work to the team.\n\nWould you be open to a 10-minute conversation next week? I can walk you through the ideas, and you can decide if they're useful.\n\nBest,\n[Sender Name] - BEPROMPTER"
  },
  {
    id: "2",
    title: "Follow-up after proposal",
    category: "Email • Follow-up",
    subject: "Thoughts on the BEPROMPTER proposal?",
    body: "Hi [Name],\n\nHope you're having a great week.\n\nI wanted to circle back on the proposal I sent over for [Company]. Are there any questions I can answer for you about the implementation timeline or the CRM integration?\n\nLet me know if you'd like to jump on a quick call to review it.\n\nBest,\n[Sender Name]"
  }
];

export function ScriptsTab() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [activeScriptId, setActiveScriptId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Variables for personalization
  const [varName, setVarName] = useState("");
  const [varCompany, setVarCompany] = useState("");
  const [varObservation, setVarObservation] = useState("");
  const [varSender, setVarSender] = useState("Alex Morgan");

  // Edit states
  const [editTitle, setEditTitle] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("crm_sales_scripts");
    if (saved) {
      const parsed = JSON.parse(saved);
      setScripts(parsed);
      if (parsed.length > 0) setActiveScriptId(parsed[0].id);
    } else {
      setScripts(DEFAULT_SCRIPTS);
      setActiveScriptId(DEFAULT_SCRIPTS[0].id);
      localStorage.setItem("crm_sales_scripts", JSON.stringify(DEFAULT_SCRIPTS));
    }
  }, []);

  const saveScripts = (newScripts: Script[]) => {
    setScripts(newScripts);
    localStorage.setItem("crm_sales_scripts", JSON.stringify(newScripts));
  };

  const handleNewScript = () => {
    const newScript: Script = {
      id: Date.now().toString(),
      title: "New Untitled Script",
      category: "Email • Custom",
      subject: "Subject line...",
      body: "Hi [Name],\n\nWrite your script here...\n\nBest,\n[Sender Name]"
    };
    saveScripts([...scripts, newScript]);
    setActiveScriptId(newScript.id);
    startEditing(newScript);
  };

  const startEditing = (script: Script) => {
    setEditTitle(script.title);
    setEditSubject(script.subject);
    setEditBody(script.body);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const updated = scripts.map(s => {
      if (s.id === activeScriptId) {
        return { ...s, title: editTitle, subject: editSubject, body: editBody };
      }
      return s;
    });
    saveScripts(updated);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this script?")) {
      const updated = scripts.filter(s => s.id !== activeScriptId);
      saveScripts(updated);
      setIsEditing(false);
      setActiveScriptId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const activeScript = scripts.find(s => s.id === activeScriptId);

  // Helper to replace variables dynamically
  const applyVariables = (text: string) => {
    if (!text) return "";
    let result = text;
    if (varName) result = result.replace(/\[Name\]/gi, varName);
    if (varCompany) result = result.replace(/\[Company\]/gi, varCompany);
    if (varObservation) result = result.replace(/\[relevant_observation\]/gi, varObservation);
    if (varSender) result = result.replace(/\[Sender Name\]/gi, varSender);
    return result;
  };

  const handleCopy = () => {
    if (!activeScript) return;
    const finalSubject = applyVariables(activeScript.subject);
    const finalBody = applyVariables(activeScript.body);
    navigator.clipboard.writeText(`Subject: ${finalSubject}\n\n${finalBody}`);
    alert("Copied to clipboard!");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let importedScripts: Script[] = [];
        
        if (file.name.endsWith('.json')) {
          importedScripts = JSON.parse(content);
          if (!Array.isArray(importedScripts)) throw new Error("Invalid format");
        } else {
          // Fallback for text files: create a single script
          importedScripts = [{
            id: Date.now().toString(),
            title: file.name.replace(/\.[^/.]+$/, ""), // remove extension
            category: "Imported",
            subject: "Imported Script",
            body: content
          }];
        }
        
        const merged = [...scripts, ...importedScripts];
        saveScripts(merged);
        alert(`Successfully imported ${importedScripts.length} script(s)!`);
      } catch (err) {
        alert("Failed to parse the imported file. Please upload a valid JSON or text file.");
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light tracking-tight text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
          The right words. At the right moment.
        </h1>
        <div className="flex gap-3">
            <input 
              type="file" 
              accept=".json,.txt" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImport}
            />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-transparent border border-white/20 text-white rounded hover:bg-white/5 transition-colors">
              <Download size={14} /> Import scripts
            </button>
            <button onClick={handleNewScript} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white text-black rounded hover:bg-white/90 transition-colors">
              <Plus size={14} /> New script
            </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
        <div className="flex gap-6 text-xs font-medium">
            <span className="text-white border-b-2 border-white pb-4 -mb-[17px]">All scripts ({scripts.length})</span>
            <span className="text-white/50 hover:text-white cursor-pointer pb-4 -mb-[17px]">Favorites (0)</span>
            <span className="text-white/50 hover:text-white cursor-pointer pb-4 -mb-[17px]">My scripts (0)</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-6 min-h-0 pb-8">
        <div className="col-span-1 border border-white/10 rounded-lg bg-white/[0.02] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10">
              <h3 className="text-sm font-medium text-white/80">Your library</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {scripts.map(script => (
               <div 
                 key={script.id}
                 onClick={() => { setActiveScriptId(script.id); setIsEditing(false); }}
                 className={`p-3 rounded text-sm cursor-pointer transition-colors ${activeScriptId === script.id ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'}`}
               >
                 {script.title}
               </div>
             ))}
          </div>
        </div>
        
        <div className="col-span-2 border border-white/10 rounded-lg bg-white/[0.02] flex flex-col overflow-hidden relative">
          {activeScript ? (
            isEditing ? (
              // Edit Mode
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-white/10 flex justify-between items-start">
                  <div className="w-full mr-4">
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Edit Title</p>
                      <input 
                        value={editTitle} onChange={e => setEditTitle(e.target.value)}
                        className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-lg text-white outline-none"
                      />
                  </div>
                  <button onClick={handleDelete} className="text-xs text-[#f87171] hover:bg-[#f87171]/10 border border-[#f87171]/20 px-3 py-2 rounded flex items-center gap-1">
                    <Trash2 size={12}/> Delete
                  </button>
                </div>
                
                <div className="p-6 flex-1 overflow-y-auto space-y-4">
                    <div>
                      <p className="text-xs text-white/40 mb-2">SUBJECT LINE</p>
                      <input 
                        value={editSubject} onChange={e => setEditSubject(e.target.value)}
                        className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div className="h-64 flex flex-col">
                      <p className="text-xs text-white/40 mb-2">BODY</p>
                      <textarea 
                        value={editBody} onChange={e => setEditBody(e.target.value)}
                        className="flex-1 w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-sm text-white outline-none resize-none"
                      />
                    </div>
                </div>
                
                <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-black/20">
                  <button onClick={() => setIsEditing(false)} className="text-xs text-white/60 hover:text-white px-3 py-2">Cancel</button>
                  <button onClick={handleSaveEdit} className="px-4 py-2 text-xs bg-white text-black font-medium rounded hover:bg-white/90 flex items-center gap-2">
                    <Save size={12}/> Save changes
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-white/10 flex justify-between items-start">
                  <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">{activeScript.category}</p>
                      <h2 className="text-xl font-medium text-white">{activeScript.title}</h2>
                  </div>
                  <button onClick={() => startEditing(activeScript)} className="text-xs text-white/50 hover:text-white border border-white/20 px-3 py-1.5 rounded flex items-center gap-2 transition-colors">
                    <Edit3 size={12}/> Edit script
                  </button>
                </div>
                
                <div className="p-6 flex-1 overflow-y-auto">
                    <p className="text-xs text-white/40 mb-2">SUBJECT LINE</p>
                    <p className="text-sm text-white mb-8 border border-white/10 bg-black/50 p-3 rounded">
                      {applyVariables(activeScript.subject)}
                    </p>
                    
                    <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                      {applyVariables(activeScript.body)}
                    </div>
                </div>
                
                <div className="p-4 border-t border-white/10 flex justify-between items-center bg-black/20">
                  <button onClick={handleCopy} className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors">
                      <Copy size={14}/> Copy script
                  </button>
                  <div className="flex gap-3">
                      <button onClick={handleCopy} className="px-4 py-2 text-xs bg-white text-black font-medium rounded hover:bg-white/90">Use in outreach</button>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center flex-1 h-full text-white/30 text-sm">
              No script selected.
            </div>
          )}
        </div>
        
        <div className="col-span-1 space-y-6 overflow-y-auto pr-2">
           <div className="border border-white/10 rounded-lg bg-white/[0.02] p-5">
             <h3 className="text-sm font-medium text-white/80 mb-4">Make it personal</h3>
             <div className="space-y-4">
               <div>
                 <label className="text-[10px] text-white/50 uppercase tracking-widest block mb-1">Name</label>
                 <input value={varName} onChange={e => setVarName(e.target.value)} type="text" className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-white/30 outline-none transition-colors" placeholder="e.g. Sarah" />
               </div>
               <div>
                 <label className="text-[10px] text-white/50 uppercase tracking-widest block mb-1">Company</label>
                 <input value={varCompany} onChange={e => setVarCompany(e.target.value)} type="text" className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-white/30 outline-none transition-colors" placeholder="e.g. Acme Corp" />
               </div>
               <div>
                 <label className="text-[10px] text-white/50 uppercase tracking-widest block mb-1">Relevant observation</label>
                 <textarea value={varObservation} onChange={e => setVarObservation(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-xs text-white h-20 focus:border-white/30 outline-none transition-colors" placeholder="e.g. your recent expansion into..." />
               </div>
               <div>
                 <label className="text-[10px] text-white/50 uppercase tracking-widest block mb-1">Sender Name</label>
                 <input value={varSender} onChange={e => setVarSender(e.target.value)} type="text" className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-white/30 outline-none transition-colors" placeholder="Alex Morgan" />
               </div>
             </div>
           </div>

           <div className="border border-white/10 rounded-lg bg-white/[0.02] p-5">
             <h3 className="text-sm font-medium text-white/80 mb-4">Before you send</h3>
             <div className="space-y-3">
               <label className="flex items-start gap-3 cursor-pointer group">
                 <div className="w-4 h-4 rounded border border-white/20 mt-0.5 group-hover:border-white/50 flex items-center justify-center">
                   <div className="w-2 h-2 rounded-sm bg-transparent group-active:bg-white/20"></div>
                 </div>
                 <span className="text-xs text-white/60 group-hover:text-white transition-colors leading-tight">Check the prospect's name is spelled correctly</span>
               </label>
               <label className="flex items-start gap-3 cursor-pointer group">
                 <div className="w-4 h-4 rounded border border-white/20 mt-0.5 group-hover:border-white/50 flex items-center justify-center">
                   <div className="w-2 h-2 rounded-sm bg-transparent group-active:bg-white/20"></div>
                 </div>
                 <span className="text-xs text-white/60 group-hover:text-white transition-colors leading-tight">Make a genuine, researched observation</span>
               </label>
               <label className="flex items-start gap-3 cursor-pointer group">
                 <div className="w-4 h-4 rounded border border-white/20 mt-0.5 group-hover:border-white/50 flex items-center justify-center">
                   <div className="w-2 h-2 rounded-sm bg-transparent group-active:bg-white/20"></div>
                 </div>
                 <span className="text-xs text-white/60 group-hover:text-white transition-colors leading-tight">Include a clear call to action</span>
               </label>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
