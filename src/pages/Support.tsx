import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { FAQSection } from '../components/support/FAQSection';
import { GlobalNavigation } from '../components/navigation/GlobalNavigation';

const faqCategories = [
  {
    title: 'Começando',
    questions: [
      {
        question: 'Como faço para começar a jogar?',
        answer: 'Para começar, basta criar uma conta gratuita e fazer o download do jogo. Após a instalação, você poderá escolher seu primeiro dinossauro e começar sua aventura.'
      },
      {
        question: 'O jogo é gratuito?',
        answer: 'Sim, o jogo é gratuito para jogar (free-to-play). Existem itens cosméticos opcionais disponíveis para compra na loja do jogo.'
      }
    ]
  },
  {
    title: 'Requisitos Técnicos',
    questions: [
      {
        question: 'Quais são os requisitos mínimos?',
        answer: 'O jogo roda em PCs modernos com Windows 10/11, 8GB de RAM, processador Intel i5 ou equivalente, e placa de vídeo com 2GB de memória.'
      },
      {
        question: 'Em quais plataformas o jogo está disponível?',
        answer: 'Atualmente o jogo está disponível para PC (Windows) e Mac. Versões para consoles estão em desenvolvimento.'
      }
    ]
  },
  {
    title: 'Conta e Perfil',
    questions: [
      {
        question: 'Como altero minha senha?',
        answer: 'Você pode alterar sua senha através das configurações do seu perfil. Acesse seu perfil, clique em "Segurança" e selecione "Alterar Senha".'
      },
      {
        question: 'Perdi acesso à minha conta, o que faço?',
        answer: 'Use a opção "Esqueci minha senha" na tela de login ou entre em contato com nossa equipe através do Discord.'
      }
    ]
  }
];

export const Support = () => {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-obsidian))] relative">
      <GlobalNavigation />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[rgb(var(--color-gold))] mb-4">
            Central de Ajuda
          </h1>
          <p className="text-[rgba(var(--color-gold),0.8)] max-w-2xl mx-auto">
            Encontre respostas para suas dúvidas ou junte-se à nossa comunidade no Discord
            para suporte em tempo real.
          </p>
        </motion.div>

        {/* Discord Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="p-6 bg-[#5865F2] border-none">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <MessageCircle size={32} className="text-white" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Junte-se ao nosso Discord
                  </h3>
                  <p className="text-white/80">
                    Obtenha suporte em tempo real e conecte-se com outros jogadores
                  </p>
                </div>
              </div>
              <a
                href="https://discord.gg/6RbJhq9DWg"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-[#5865F2] rounded-lg font-bold
                         hover:bg-opacity-90 transition-colors"
              >
                Entrar no Discord
              </a>
            </div>
          </Card>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-[rgb(var(--color-gold))] mb-6 flex items-center gap-2">
                  <HelpCircle size={24} />
                  {category.title}
                </h2>
                <FAQSection questions={category.questions} />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
