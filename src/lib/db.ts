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
  // Always prime / seed and get local storage projects
  seedLocalStorage();
  const rawLocal = localStorage.getItem('kayetan_projects');
  const localProjects: Project[] = rawLocal ? JSON.parse(rawLocal) : INITIAL_PROJECTS;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        const supabaseProjects = data as Project[];
        
        // Merge Supabase and Local Storage projects to prevent data loss
        // We match by ID to ensure any locally edited or offline-created projects are preserved
        const merged = [...supabaseProjects];
        for (const localProj of localProjects) {
          if (!merged.some(p => p.id === localProj.id)) {
            merged.push(localProj);
          } else {
            // If it exists in both, update local storage with the Supabase version to keep in sync
            const localIdx = localProjects.findIndex(p => p.id === localProj.id);
            const supaProj = supabaseProjects.find(p => p.id === localProj.id);
            if (localIdx !== -1 && supaProj) {
              localProjects[localIdx] = supaProj;
            }
          }
        }
        
        // Persist the synced state back to local storage
        localStorage.setItem('kayetan_projects', JSON.stringify(localProjects));

        // Sort by created_at desc
        merged.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });

        return merged;
      }
    } catch (err) {
      console.error('Supabase query failed, returning local storage backup:', err);
    }
  }

  return localProjects;
};

export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  const newProject: Project = {
    ...project,
    id: `proj-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  // 1. First, secure local backup instantly so user never loses their progress
  seedLocalStorage();
  const projects = JSON.parse(localStorage.getItem('kayetan_projects') || '[]');
  projects.unshift(newProject);
  localStorage.setItem('kayetan_projects', JSON.stringify(projects));

  // 2. Effort to synchronize with Supabase Cloud
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select();
      
      if (error) throw error;
      if (data && data[0]) {
        // Update local with the official cloud record is ideal
        const updatedLocal = projects.map((p: Project) => p.id === newProject.id ? (data[0] as Project) : p);
        localStorage.setItem('kayetan_projects', JSON.stringify(updatedLocal));
        return data[0] as Project;
      }
    } catch (err) {
      console.error('Supabase insert failed, local storage backup is active:', err);
    }
  }

  return newProject;
};

export const updateProject = async (project: Project): Promise<Project> => {
  // 1. Update local storage immediately for real-time interactive safety
  seedLocalStorage();
  const projects: Project[] = JSON.parse(localStorage.getItem('kayetan_projects') || '[]');
  const idx = projects.findIndex(p => p.id === project.id);
  if (idx !== -1) {
    projects[idx] = project;
    localStorage.setItem('kayetan_projects', JSON.stringify(projects));
  }

  // 2. Synchronize to Supabase Cloud
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', project.id)
        .select();
      
      if (error) throw error;
      if (data && data[0]) {
        // Sync local record if cloud responds with updated details
        if (idx !== -1) {
          projects[idx] = data[0] as Project;
          localStorage.setItem('kayetan_projects', JSON.stringify(projects));
        }
        return data[0] as Project;
      }
    } catch (err) {
      console.error('Supabase update failed, local storage changes preserved:', err);
    }
  }

  return project;
};

export const deleteProject = async (id: string): Promise<boolean> => {
  // 1. Remove from local storage immediately so UI feels instantaneous
  seedLocalStorage();
  const projects: Project[] = JSON.parse(localStorage.getItem('kayetan_projects') || '[]');
  const filtered = projects.filter(p => p.id !== id);
  localStorage.setItem('kayetan_projects', JSON.stringify(filtered));

  // 2. Synchronize deletion with Supabase Cloud
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (!error) return true;
      throw error;
    } catch (err) {
      console.error('Supabase delete failed, local storage delete completed:', err);
    }
  }

  return true;
};

export const getMessages = async (): Promise<ContactMessage[]> => {
  seedLocalStorage();
  const rawLocal = localStorage.getItem('kayetan_messages');
  const localMessages: ContactMessage[] = rawLocal ? JSON.parse(rawLocal) : [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        const supabaseMessages = data as ContactMessage[];
        
        // Merge Supabase and Local Messages to prevent lose of form inquiries
        const merged = [...supabaseMessages];
        for (const localMsg of localMessages) {
          if (!merged.some(m => m.id === localMsg.id)) {
            merged.push(localMsg);
          }
        }

        // Persist synced data Locally
        localStorage.setItem('kayetan_messages', JSON.stringify(merged));

        merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return merged;
      }
    } catch (err) {
      console.error('Supabase fetch messages failed, returning local storage backup:', err);
    }
  }

  return localMessages;
};

export const createMessage = async (msg: Omit<ContactMessage, 'id' | 'created_at'>): Promise<ContactMessage> => {
  const newMessage: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  // 1. Save to local storage right away
  seedLocalStorage();
  const messages = JSON.parse(localStorage.getItem('kayetan_messages') || '[]');
  messages.unshift(newMessage);
  localStorage.setItem('kayetan_messages', JSON.stringify(messages));

  // 2. Attempt sync to Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select();
      
      if (error) throw error;
      if (data && data[0]) {
        const updatedLocal = messages.map((m: ContactMessage) => m.id === newMessage.id ? (data[0] as ContactMessage) : m);
        localStorage.setItem('kayetan_messages', JSON.stringify(updatedLocal));
        return data[0] as ContactMessage;
      }
    } catch (err) {
      console.error('Supabase message insert failed, local storage backup active:', err);
    }
  }

  return newMessage;
};

export const deleteMessage = async (id: string): Promise<boolean> => {
  // 1. Delete from local storage instantly
  seedLocalStorage();
  const messages: ContactMessage[] = JSON.parse(localStorage.getItem('kayetan_messages') || '[]');
  const filtered = messages.filter(m => m.id !== id);
  localStorage.setItem('kayetan_messages', JSON.stringify(filtered));

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
      
      if (!error) return true;
      throw error;
    } catch (err) {
      console.error('Supabase delete message failed, local storage action completed:', err);
    }
  }

  return true;
};
