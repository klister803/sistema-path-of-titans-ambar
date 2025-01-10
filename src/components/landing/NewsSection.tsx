import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ChevronRight } from 'lucide-react';
import { ImageContainer } from '../brand/ImageContainer';

export const NewsSection = () => {
  const news = [
    {
      id: 1,
      title: 'Nova Região: Vale dos Anciões',
      summary: 'Explore uma área misteriosa repleta de fósseis e segredos ancestrais.',
      image: '/images/background-news.png',
      date: '2024-03-15',
      category: 'Atualizações',
    },
    {
      id: 2,
      title: 'Evento Sazonal: Migração Primitiva',
      summary: 'Participe da grande migração e ganhe recompensas exclusivas.',
      image: '/images/background-news.png',
      date: '2024-03-10',
      category: 'Eventos',
    },
  ];

  return (
    <section className="py-20 px-4 relative" id="noticias">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-amber-400 mb-12 text-center"
        >
          Últimas Notícias
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {news.map((item) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative bg-amber-950/40 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                <ImageContainer
                  src={item.image}
                  alt={item.title}
                  variant="card"
                  className="w-full max-w-[800px] mx-auto"
                />
              </div>

              <div className="p-6 relative z-10">
                <div className="flex items-center gap-4 text-amber-400 text-sm mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag size={16} />
                    {item.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-green-50 mb-2 group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-green-200 mb-4">
                  {item.summary}
                </p>

                <button className="flex items-center gap-2 text-amber-400 group-hover:text-amber-300 transition-colors">
                  Ler mais
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
