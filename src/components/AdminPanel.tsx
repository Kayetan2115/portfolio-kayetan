import { useState, useEffect, FormEvent, DragEvent, ChangeEvent, ClipboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, ContactMessage } from '../types';
import { 
  X, 
  Plus, 
  Trash, 
  Edit, 
  ShieldAlert, 
  KeyRound, 
  Check, 
  Database, 
  Settings, 
  Mail, 
  Sparkles, 
  FileText, 
  Code2, 
  CheckSquare, 
  RefreshCw, 
  AlertCircle,
  Upload
} from 'lucide-react';
import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject, 
  getMessages, 
  deleteMessage, 
  getDbSource 
} from '../lib/db';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshMainPage: () => void;
}

export default function AdminPanel({ isOpen, onClose, onRefreshMainPage }: AdminPanelProps) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Contents
  const [activeTab, setActiveTab] = useState<'projects' | 'messages' | 'config'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [dbSource, setDbSource] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Editor modal state
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Editor form fields
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [github, setGithub] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [featured, setFeatured] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Copy helpers
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const projs = await getProjects();
      const msgs = await getMessages();
      setProjects(projs);
      setMessages(msgs);
      setDbSource(getDbSource());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (passphrase === 'kontaktcwlxd') {
      setIsAuthenticated(true);
      setPassphrase('');
    } else {
      setAuthError('Błędne hasło administratora. Spróbuj ponownie.');
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setTitle('');
    setDescription('');
    setTagsInput('React, TypeScript, Tailwind');
    setLink('https://');
    setGithub('https://github.com/');
    setImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop');
    setFeatured(false);
    setIsEditorOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setDescription(proj.description);
    setTagsInput(proj.tags.join(', '));
    setLink(proj.link || '');
    setGithub(proj.github || '');
    setImageUrl(proj.image_url || '');
    setFeatured(proj.featured || false);
    setIsEditorOpen(true);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    const file = e.clipboardData.files?.[0];
    if (file && file.type.startsWith('image/')) {
      e.preventDefault();
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64Str = reader.result;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 450;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
            setImageUrl(compressedBase64);
          } else {
            setImageUrl(base64Str);
          }
        };
        img.src = base64Str;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      tags: parsedTags,
      link: link.trim(),
      github: github.trim(),
      image_url: imageUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      featured,
    };

    try {
      if (editingProject) {
        await updateProject({ ...editingProject, ...payload });
      } else {
        await createProject(payload);
      }
      setIsEditorOpen(false);
      loadData();
      onRefreshMainPage();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProj = async (id: string) => {
    await deleteProject(id);
    loadData();
    onRefreshMainPage();
  };

  const handleDeleteMsg = async (id: string) => {
    await deleteMessage(id);
    loadData();
  };

  const sqlCode = `-- TABELA PROJEKTÓW
CREATE TABLE IF NOT EXISTS projects (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  tags text[] NOT NULL,
  link text,
  github text,
  image_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- TABELA FORMULARZA KONTAKTOWEGO
CREATE TABLE IF NOT EXISTS messages (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  consent_rodo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- WYŁĄCZENIE LUB SKONFIGUROWANIE RLS (Row Level Security)
-- 1. SZYBKA I PROSTA OPCJA (Dedykowana do celów testowych/deweloperskich):
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- 2. BEZPIECZNA OPCJA PRODUKCYJNA (Zalecana, chroni bazę przed modyfikacją przez osoby trzecie):
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- 
-- -- Wszyscy mogą przeglądać projekty (SELECT), ale nikt nie może ich modyfikować z poziomu kodu klient-side:
-- CREATE POLICY "Zezwalaj na publiczny odczyt projektów" ON projects FOR SELECT USING (true);
-- 
-- -- Każdy może wysłać wiadomość przez formularz (INSERT), ale nikt nie może ich czytać ani usuwać przez API (SELECT/DELETE):
-- CREATE POLICY "Zezwalaj tylko na wysyłanie wiadomości" ON messages FOR INSERT WITH CHECK (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" key="admin-panel-overlay-wrap">
          <motion.div
            id="admin-panel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          <motion.div
            id="admin-panel-modal"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-slate-950 border border-slate-800 rounded-3xl p-6 z-10 flex flex-col text-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <Settings className="w-5.5 h-5.5 text-indigo-400 animate-spin" style={{ animationDuration: '10s' }} />
                <div>
                  <h3 className="text-white font-bold text-lg tracking-tight">Console Admin Panel</h3>
                  <p className="text-[10px] text-slate-500 font-mono tracking-wider">SECURE CLIENT STATE SYSTEM</p>
                </div>
              </div>
              <button
                id="btn-admin-close"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Auth Barrier */}
            {!isAuthenticated ? (
              <form onSubmit={handleLogin} className="flex-1 flex flex-col items-center justify-center py-12 max-w-sm mx-auto w-full">
                <div className="p-4 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl mb-4">
                  <KeyRound className="w-8 h-8" />
                </div>
                <h4 className="text-white font-bold text-center text-sm mb-6">Dostęp zabezpieczony hasłem</h4>

                <div className="w-full space-y-3">
                  <input
                    id="admin-pass-input"
                    type="password"
                    required
                    placeholder="Wprowadź hasło admina..."
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 text-center text-slate-100 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />

                  {authError && (
                    <div className="flex items-center gap-1.5 justify-center p-2.5 bg-red-950/25 border border-red-900/30 text-red-400 text-xs rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    id="btn-admin-login-submit"
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition"
                  >
                    Uwierzytelnij dostęp
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex-1 overflow-hidden flex flex-col pt-4">
                {/* Mode Selector and State Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-900 pb-2 shrink-0">
                  <div className="flex gap-2">
                    <button
                      id="tab-admin-projects"
                      onClick={() => setActiveTab('projects')}
                      className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold transition cursor-pointer ${
                        activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Projekty ({projects.length})
                    </button>
                    <button
                      id="tab-admin-messages"
                      onClick={() => setActiveTab('messages')}
                      className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold transition cursor-pointer ${
                        activeTab === 'messages' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Wiadomości RODO ({messages.length})
                    </button>
                    <button
                      id="tab-admin-config"
                      onClick={() => setActiveTab('config')}
                      className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold transition cursor-pointer ${
                        activeTab === 'config' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Baza SQL i Integracja
                    </button>
                  </div>

                  {/* Sync information */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <Database className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-slate-400 text-[11px] bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      Silnik: <strong className="text-white font-bold">{dbSource}</strong>
                    </span>
                    <button
                      id="btn-admin-refresh"
                      onClick={loadData}
                      className="p-1 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg transition"
                      title="Odśwież bazę"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Tab content wrappers */}
                <div className="flex-1 overflow-y-auto pr-1">
                  
                  {/* TAB 1: Projects Catalog */}
                  {activeTab === 'projects' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                        <span className="text-slate-400 text-xs">Dodaj lub modyfikuj bento i portfolio projektów</span>
                        <button
                          id="btn-admin-add-project"
                          onClick={openAddModal}
                          className="flex items-center gap-1 px-3 py-1.5 bg-sky-500 hover:bg-sky-450 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Dodaj nowy projekt
                        </button>
                      </div>

                      {isLoading ? (
                        <div className="py-12 text-center text-slate-500 animate-pulse">Ładowanie portfolio...</div>
                      ) : projects.length === 0 ? (
                        <div className="text-center py-10 border border-dashed border-slate-900 text-slate-500 text-xs">
                          Brak projektów w bazie. Możesz dodać pierwszy projekt u góry!
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-2.5">
                          {projects.map((proj, idx) => (
                            <div
                              key={`${proj.id}-${idx}`}
                              className="flex items-center justify-between p-3.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-850 rounded-xl transition"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={proj.image_url}
                                  alt=""
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 object-cover rounded-lg shrink-0 border border-slate-800"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-white truncate block">{proj.title}</span>
                                    {proj.featured && (
                                      <span className="px-1 text-[8px] font-bold text-amber-400 bg-amber-950/40 border border-amber-500/10 rounded">★</span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-500 font-mono truncate block">
                                    Tagi: {proj.tags.join(', ')}
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-1.5 shrink-0 ml-3">
                                <button
                                  id={`btn-admin-edit-${proj.id}`}
                                  onClick={() => openEditModal(proj)}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 rounded-lg transition"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  id={`btn-admin-delete-${proj.id}`}
                                  onClick={() => handleDeleteProj(proj.id)}
                                  className="p-1.5 bg-slate-850 hover:bg-red-950/20 text-slate-500 hover:text-red-400 rounded-lg transition"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: Contact Form Submissions */}
                  {activeTab === 'messages' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-950/10 border border-emerald-900/20 rounded-2xl text-slate-300 text-xs flex gap-2">
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        <p>
                          Każda wiadomość poniżej posiada oficjalne potwierdzenie akceptacji warunków prawnych RODO podane przez użytkownika podczas wypełniania pól kontaktu.
                        </p>
                      </div>

                      {isLoading ? (
                        <div className="py-12 text-center text-slate-500 animate-pulse">Ładowanie skrzynki...</div>
                      ) : messages.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-slate-900 text-slate-500 text-xs">
                          Skrzynka wiadomości RODO jest czysta. Brak zapytań o współpracę.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {messages.map((msg, idx) => (
                            <div
                              key={`${msg.id}-${idx}`}
                              className="p-4 bg-slate-900/60 border border-slate-850 rounded-2xl relative"
                            >
                              <div className="flex justify-between items-start gap-3 mb-2">
                                <div>
                                  <span className="text-white font-bold text-xs block">{msg.name}</span>
                                  <a href={`mailto:${msg.email}`} className="text-sky-400 hover:underline text-[10.5px] font-mono leading-none">
                                    {msg.email}
                                  </a>
                                </div>
                                <div className="flex items-center gap-1 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-[8px] font-mono px-2 py-0.5 rounded-lg shrink-0">
                                  <span>Zgoda RODO: TAK</span>
                                </div>
                              </div>

                              <p className="text-slate-305 text-xs bg-slate-950/80 p-2.5 rounded-lg border border-slate-900/80 whitespace-pre-wrap leading-relaxed">
                                {msg.message}
                              </p>

                              <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono mt-2.5 pt-2.5 border-t border-slate-900/40">
                                <span>Otrzymano: {new Date(msg.created_at).toLocaleString('pl-PL')}</span>
                                <button
                                  id={`btn-admin-delmsg-${msg.id}`}
                                  onClick={() => handleDeleteMsg(msg.id)}
                                  className="flex items-center gap-1 px-2 py-1 text-slate-500 hover:text-red-400 font-semibold uppercase hover:bg-slate-900/45 rounded transition"
                                >
                                  <Trash className="w-3 h-3" />
                                  USUŃ WIADOMOŚĆ
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: Supabase Seeding / Config */}
                  {activeTab === 'config' && (
                    <div className="space-y-5 text-xs text-slate-300 leading-relaxed">
                      <div className="p-4 bg-slate-905 border border-slate-850 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-5 h-5 text-indigo-400" />
                          <h4 className="text-white font-bold">Wdróż własną bazę Supabase w 1 minutę</h4>
                        </div>
                        <p>
                          Portfolio wspiera podwójne zasoby bazy danych. Aby podłączyć własny, stabilny serwer Supabase, zaloguj się do serwisu Supabase, stwórz nowy projekt i skonfiguruj poniższe zmienne środowiskowe w panelu ustawień workspace (lub pliku <code className="text-sky-400">.env</code>):
                        </p>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 space-y-1 font-mono text-[10px] text-zinc-400 select-all">
                          <div>VITE_SUPABASE_URL="https://twoj-projekt.supabase.co"</div>
                          <div>VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."</div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-905 border border-slate-850 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4.5 h-4.5 text-sky-450" />
                            <h4 className="text-white font-bold">Skrypt SQL Seeding</h4>
                          </div>
                          <button
                            id="btn-admin-copy-sql"
                            onClick={handleCopySql}
                            className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 font-mono text-[10px] text-sky-400 rounded-lg transition"
                          >
                            {copiedSql ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                Skopiowano SQL
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                Kopiuj SQL
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-slate-400">
                          Skopiuj poniższe zapytanie, otwórz zakładkę <strong>SQL Editor</strong> w Supabase Dashboard, wklej strukturę i kliknij <strong>Run</strong>:
                        </p>

                        <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 text-[10px] font-mono text-indigo-300 overflow-x-auto whitespace-pre leading-normal max-h-56">
                          {sqlCode}
                        </pre>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Embedded Project Editor Form Dialog (Nested) */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" key="admin-editor-overlay-wrap">
            <motion.div
              id="admin-editor-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditorOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            <motion.div
              id="admin-editor-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl p-6 z-10 text-slate-100"
            >
              <div className="flex justify-between items-center mb-4 border-b border-slate-900 pb-3">
                <h4 className="font-bold text-white text-sm">
                  {editingProject ? 'Modyfikuj projekt' : 'Dodaj nowy projekt do portfolio'}
                </h4>
                <button
                  id="btn-admin-editor-close"
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-3 font-sans">
                {/* Title */}
                <div>
                  <label className="text-slate-400 font-mono text-[9px] uppercase block mb-1">Nazwa projektu *</label>
                  <input
                    id="editor-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-100 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-slate-400 font-mono text-[9px] uppercase block mb-1">Opis techniczny *</label>
                  <textarea
                    id="editor-desc"
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-100 rounded-lg text-xs resize-none focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-mono text-[9px] uppercase block mb-1">Adres URL projektu</label>
                    <input
                      id="editor-link"
                      type="text"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-100 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-mono text-[9px] uppercase block mb-1">Adres URL GitHub (Kod źródłowy)</label>
                    <input
                      id="editor-github"
                      type="text"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-100 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-slate-400 font-mono text-[9px] uppercase block mb-1">Tagi technologii (rozdzielone przecinkami) *</label>
                  <input
                    id="editor-tags"
                    type="text"
                    required
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="React, TypeScript, Tailwind"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-100 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Cover Image Upload (Screenshot uploader / Drag & Drop / Click / Paste) */}
                <div>
                  <label className="text-slate-400 font-mono text-[9px] uppercase block mb-1">Obrazek okładki (wklej skrinszot, przeciągnij lub kliknij, aby wybrać)</label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onPaste={handlePaste}
                    className={`relative flex flex-col items-center justify-center border border-dashed rounded-xl p-4 transition-colors cursor-pointer text-center outline-none ${
                      isDragging
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : imageUrl
                        ? 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/20'
                    }`}
                    onClick={() => document.getElementById('file-upload-input')?.click()}
                  >
                    <input
                      id="file-upload-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    
                    {imageUrl ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-900 group">
                        <img
                          src={imageUrl}
                          alt="Okładka"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity gap-1">
                          <Upload className="w-5 h-5 text-indigo-400 animate-bounce" />
                          <span className="text-white text-[11px] font-semibold">Zmień obrazek</span>
                          <span className="text-slate-400 text-[9px]">Możesz też upuścić plik lub wkleić skrinszot</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 flex flex-col items-center justify-center gap-2">
                        <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-slate-500">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-300 font-semibold">Kliknij lub przeciągnij obrazek tutaj</p>
                          <p className="text-[10px] text-slate-500 mt-1">Możesz też wkleić skrinszot bezpośrednio (Ctrl + V)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="editor-featured"
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-500 bg-slate-900 border-slate-800"
                  />
                  <label htmlFor="editor-featured" className="text-xs text-slate-400 select-none cursor-pointer">
                    Oznacz projekt jako wyróżniony (Featured Badge)
                  </label>
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-slate-900">
                  <button
                    id="btn-editor-cancel"
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-3 py-1.5 text-slate-400 hover:text-white text-xs"
                  >
                    Anuluj
                  </button>
                  <button
                    id="btn-editor-save"
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow cursor-pointer transition"
                  >
                    Zatwierdź i zapisz
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
