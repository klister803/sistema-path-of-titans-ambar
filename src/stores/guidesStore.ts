import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Guide {
  id: string;
  title: string;
  content: string;
  lastModified: string;
}

interface GuidesState {
  guides: Guide[];
  isAdmin: boolean;
  addGuide: (guide: Guide) => void;
  updateGuide: (id: string, guide: Partial<Guide>) => void;
  deleteGuide: (id: string) => void;
}

export const useGuidesStore = create<GuidesState>()(
  persist(
    (set) => ({
      guides: [
        {
          id: '1',
          title: 'Primeiros Passos',
          content: '<h2>Bem-vindo ao Planeta Âmbar</h2><p>Este guia irá ajudá-lo a começar sua jornada...</p>',
          lastModified: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Combate Básico',
          content: '<h2>Sistema de Combate</h2><p>Aprenda as mecânicas básicas de combate...</p>',
          lastModified: new Date().toISOString(),
        },
      ],
      isAdmin: false,
      addGuide: (guide) => set((state) => ({
        guides: [...state.guides, guide],
      })),
      updateGuide: (id, updatedGuide) => set((state) => ({
        guides: state.guides.map((guide) =>
          guide.id === id ? { ...guide, ...updatedGuide } : guide
        ),
      })),
      deleteGuide: (id) => set((state) => ({
        guides: state.guides.filter((guide) => guide.id !== id),
      })),
    }),
    {
      name: 'guides-storage',
    }
  )
);
