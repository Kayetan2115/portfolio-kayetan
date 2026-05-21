import { Project, ContactMessage } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Aethera OS - Spatial Design Platform',
    description: 'Ultra-nowoczesny i przełomowy projekt interfejsu systemu operacyjnego opartego o trójwymiarową przestrzeń oraz fizykę cząsteczek. Posiada zintegrowane środowisko deweloperskie w chmurze.',
    tags: ['React', 'Three.js', 'WebAudio', 'GLSL', 'Vite'],
    link: 'https://github.com/kayetan/aethera-spatial-os',
    github: 'https://github.com/kayetan/aethera-spatial-os',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'proj-2',
    title: 'NerveSync - Synaptyczny Panel Telemetrii AI',
    description: 'Innowacyjne narzędzie wizualizacji danych w czasie rzeczywistym dedykowane dla autonomicznych modeli sieci neuronowych. Mapuje przepływ sygnałów w strukturze Bento Grid.',
    tags: ['Next.js', 'D3.js', 'Tailwind', 'WebSockets', 'Supabase'],
    link: 'https://github.com/kayetan/nervesync-telemetry',
    github: 'https://github.com/kayetan/nervesync-telemetry',
    image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'proj-3',
    title: 'Quantum Ledger - DeFi Portal 3.0',
    description: 'Decentralny agregator płynności kryptowalutowej z wbudowanym systemem oceny ryzyka opartym na sztucznej inteligencji. Wygładzony interfejs minimalizujący barierę wejścia.',
    tags: ['React', 'Ethers.js', 'Framer Motion', 'Tailwind', 'ChartJS'],
    link: 'https://github.com/kayetan/quantum-ledger-defi',
    github: 'https://github.com/kayetan/quantum-ledger-defi',
    image_url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'proj-4',
    title: 'Specter CMS - Headless Engine bez kodu',
    description: 'Intuicyjny i modularny system zarządzania treścią nowej generacji wspierający generowanie statycznych stron internetowych na krawędzi sieci CDN.',
    tags: ['TypeScript', 'Express', 'React', 'Tailwind', 'SQLite'],
    link: 'https://github.com/kayetan/specter-headless-cms',
    github: 'https://github.com/kayetan/specter-headless-cms',
    image_url: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=800&auto=format&fit=crop',
    featured: false
  }
];

// Helper to seed localStorage
const seedLocalStorage = () => {
  if (!localStorage.getItem('kayetan_projects')) {
    localStorage.setItem('kayetan_projects', JSON.stringify(INITIAL_PROJECTS));
  }
  if (!localStorage.getItem('kayetan_messages')) {
    localStorage.setItem('kayetan_messages', JSON.stringify([]));
  }
};

export const getDbSource = (): 'Supabase Cloud DB' | 'Local Secure Storage (Fallback)' => {
  return isSupabaseConfigured ? 'Supabase Cloud DB' : 'Local Secure Storage (Fallback)';
};

export const getProjects = async (): Promise<Project[]> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data && data.length > 0) return data as Project[];
    } catch (err) {
      console.error('Supabase query failed, using localStorage fallback:', err);
    }
  }

  // Fallback to localStorage
  seedLocalStorage();
  const raw = localStorage.getItem('kayetan_projects');
  return raw ? JSON.parse(raw) : INITIAL_PROJECTS;
};

export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  const newProject: Project = {
    ...project,
    id: `proj-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select();
      
      if (error) throw error;
      if (data && data[0]) return data[0] as Project;
    } catch (err) {
      console.error('Supabase insert failed, attempting localStorage:', err);
    }
  }

  // Fallback to localStorage
  seedLocalStorage();
  const projects = JSON.parse(localStorage.getItem('kayetan_projects') || '[]');
  projects.unshift(newProject);
  localStorage.setItem('kayetan_projects', JSON.stringify(projects));
  return newProject;
};

export const updateProject = async (project: Project): Promise<Project> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', project.id)
        .select();
      
      if (error) throw error;
      if (data && data[0]) return data[0] as Project;
    } catch (err) {
      console.error('Supabase update failed, attempting localStorage:', err);
    }
  }

  // Fallback to localStorage
  seedLocalStorage();
  const projects: Project[] = JSON.parse(localStorage.getItem('kayetan_projects') || '[]');
  const idx = projects.findIndex(p => p.id === project.id);
  if (idx !== -1) {
    projects[idx] = project;
    localStorage.setItem('kayetan_projects', JSON.stringify(projects));
  }
  return project;
};

export const deleteProject = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (!error) return true;
      throw error;
    } catch (err) {
      console.error('Supabase delete failed, attempting localStorage:', err);
    }
  }

  // Fallback to localStorage
  seedLocalStorage();
  const projects: Project[] = JSON.parse(localStorage.getItem('kayetan_projects') || '[]');
  const filtered = projects.filter(p => p.id !== id);
  localStorage.setItem('kayetan_projects', JSON.stringify(filtered));
  return true;
};

export const getMessages = async (): Promise<ContactMessage[]> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) return data as ContactMessage[];
    } catch (err) {
      console.error('Supabase fetch messages failed, using localStorage fallback:', err);
    }
  }

  // Fallback to localStorage
  seedLocalStorage();
  const raw = localStorage.getItem('kayetan_messages');
  return raw ? JSON.parse(raw) : [];
};

export const createMessage = async (msg: Omit<ContactMessage, 'id' | 'created_at'>): Promise<ContactMessage> => {
  const newMessage: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select();
      
      if (error) throw error;
      if (data && data[0]) return data[0] as ContactMessage;
    } catch (err) {
      console.error('Supabase message insert failed, attempting localStorage:', err);
    }
  }

  // Fallback to localStorage
  seedLocalStorage();
  const messages = JSON.parse(localStorage.getItem('kayetan_messages') || '[]');
  messages.unshift(newMessage);
  localStorage.setItem('kayetan_messages', JSON.stringify(messages));
  return newMessage;
};

export const deleteMessage = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
      
      if (!error) return true;
      throw error;
    } catch (err) {
      console.error('Supabase delete message failed, attempting localStorage:', err);
    }
  }

  // Fallback to localStorage
  seedLocalStorage();
  const messages: ContactMessage[] = JSON.parse(localStorage.getItem('kayetan_messages') || '[]');
  const filtered = messages.filter(m => m.id !== id);
  localStorage.setItem('kayetan_messages', JSON.stringify(filtered));
  return true;
};
