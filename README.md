# QuizCraft 🧠

Plataforma interativa para criar, jogar e compartilhar quizzes. Construída com React, TypeScript e Tailwind CSS.

## ✨ Funcionalidades

- **Criar Quizzes** — Editor completo com múltipla escolha e verdadeiro/falso, drag-and-drop para reordenar, explicações por pergunta
- **Jogar Quizzes** — Experiência gamificada com timer, animações, feedback visual e atalhos de teclado (A-F, 1-6, Enter)
- **Compartilhar** — Código de 6 caracteres para acesso rápido, links para WhatsApp/Twitter, QR Code
- **Explorar** — Busca com debounce, filtros por categoria/dificuldade, ordenação, Quick Play por código
- **Resultados** — Arco SVG animado com porcentagem, leaderboard, revisão de respostas, avaliação por estrelas
- **Meus Quizzes** — Gerenciamento de rascunhos e publicados, estatísticas com gráficos (Recharts), duplicar/editar/excluir
- **Estatísticas** — Página de stats pessoais do jogador
- **Modo Desafio** — Desafie amigos via link com comparação de scores
- **Temas** — Light/Dark mode + 8 paletas de cor (Purple, Blue, Green, Amber, Red, Cyan, Pink, Mono)
- **Idiomas** — Inglês e Português (troca instantânea via botão no header)
- **PWA-ready** — Manifest.json configurado para instalação na home screen
- **Responsivo** — Mobile-first com menu hambúrguer e layouts adaptativos

## 🛠️ Stack

| Tecnologia | Uso |
|---|---|
| React 18 | UI framework |
| TypeScript 5 | Tipagem estática |
| Vite 5 | Build tool |
| Tailwind CSS v3 | Estilização |
| shadcn/ui | Componentes base |
| Recharts | Gráficos e estatísticas |
| @dnd-kit | Drag and drop nas perguntas |
| Lucide React | Ícones |
| Framer Motion | Animações |
| Sonner | Toast notifications |

## 📁 Estrutura

```
src/
├── components/
│   ├── create/        # StepInfo, StepQuestions, StepPreview
│   ├── my-quizzes/    # CreatorSetup, ShareModal, DeleteConfirmModal, QuizStatsModal
│   ├── play/          # QuizGame, ResultsScreen, TimerCircle, StarRating, Confetti
│   └── ui/            # shadcn/ui components
├── lib/
│   ├── constants.ts   # Tipos, categorias, gradientes, mock quizzes
│   ├── mock-quizzes.ts # Quizzes completos com perguntas
│   ├── quiz-store.ts  # Persistência via localStorage
│   ├── theme.tsx      # ThemeProvider (light/dark + paletas)
│   ├── i18n.tsx        # Sistema de internacionalização (EN/PT)
│   └── utils.ts       # Utilitários
├── pages/
│   ├── Index.tsx      # Landing page
│   ├── Explore.tsx    # Busca e filtros
│   ├── Create.tsx     # Criador de quiz (3 steps)
│   ├── Play.tsx       # Jogar quiz por share_code
│   ├── MyQuizzes.tsx  # Gerenciamento do criador
│   ├── Stats.tsx      # Estatísticas pessoais
│   └── NotFound.tsx   # 404
└── App.tsx            # Router + providers
```

## 🚀 Como Rodar

```bash
npm install
npm run dev
```

## 🔮 Melhorias Futuras

- **Autenticação** — Login com email/OAuth para substituir identificação por `creator_name`
- **Backend real** — Supabase/Lovable Cloud para persistência de dados
- **SSR/Pre-rendering** — Meta tags dinâmicas para Open Graph
- **Modo multiplayer real-time** — WebSocket para competições simultâneas
- **Export/Import** — Exportar quizzes como JSON para backup
- **Analytics avançados** — Heatmap de atividade, gráfico radar por categoria

## 📝 Licença

MIT
