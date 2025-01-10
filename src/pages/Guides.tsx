import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Book, Search, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { GuidesSkeleton } from '../components/guides/GuidesSkeleton';
import { GuideEditor } from '../components/guides/GuideEditor';
import { useGuidesStore } from '../stores/guidesStore';
import { GlobalNavigation } from '../components/navigation/GlobalNavigation';

const LazyGuideContent = React.lazy(() => import('../components/guides/GuideContent'));

export const Guides = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedGuide, setSelectedGuide] = React.useState<string | null>(null);
  const { guides, isAdmin } = useGuidesStore();

  const filteredGuides = guides.filter(guide => 
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[rgb(var(--color-obsidian))] relative">
      <GlobalNavigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[rgb(var(--color-gold))] mb-4">
            Guias do Jogo
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar guias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[rgba(var(--color-gold),0.1)] border border-[rgba(var(--color-gold),0.3)]
                       rounded-lg py-3 pl-12 pr-4 text-[rgb(var(--color-gold))]
                       placeholder-[rgba(var(--color-gold),0.5)]
                       focus:outline-none focus:border-[rgb(var(--color-gold))]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgb(var(--color-gold))]" size={20} />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Guides Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-4 lg:col-span-3"
          >
            <Card className="p-4 sticky top-24">
              <h2 className="text-xl font-bold text-[rgb(var(--color-gold))] mb-4">
                Categorias
              </h2>
              <nav className="space-y-2">
                {filteredGuides.map((guide) => (
                  <button
                    key={guide.id}
                    onClick={() => setSelectedGuide(guide.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg
                             text-left transition-colors
                             ${selectedGuide === guide.id
                               ? 'bg-[rgba(var(--color-gold),0.2)] text-[rgb(var(--color-gold))]'
                               : 'text-[rgba(var(--color-gold),0.8)] hover:bg-[rgba(var(--color-gold),0.1)]'
                             }`}
                  >
                    <div className="flex items-center gap-3">
                      <Book size={20} />
                      <span>{guide.title}</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </nav>
            </Card>
          </motion.div>

          {/* Guide Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-8 lg:col-span-9"
          >
            <Card className="p-6">
              <Suspense fallback={<GuidesSkeleton />}>
                {selectedGuide ? (
                  isAdmin ? (
                    <GuideEditor guideId={selectedGuide} />
                  ) : (
                    <LazyGuideContent guideId={selectedGuide} />
                  )
                ) : (
                  <div className="text-center text-[rgb(var(--color-gold))]">
                    <Book size={48} className="mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">
                      Selecione um guia
                    </h3>
                    <p className="text-[rgba(var(--color-gold),0.7)]">
                      Escolha um guia da lista para começar
                    </p>
                  </div>
                )}
              </Suspense>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
