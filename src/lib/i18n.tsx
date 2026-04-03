import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "pt";

const translations = {
  // Navbar
  "nav.explore": { en: "Explore", pt: "Explorar" },
  "nav.create": { en: "Create", pt: "Criar" },
  "nav.myQuizzes": { en: "My Quizzes", pt: "Meus Quizzes" },
  "nav.stats": { en: "Stats", pt: "Estatísticas" },

  // Index
  "index.badge": { en: "Free & Open to Everyone", pt: "Grátis e Aberto para Todos" },
  "index.title1": { en: "Create, play & share", pt: "Crie, jogue e compartilhe" },
  "index.title2": { en: "quizzes", pt: "quizzes" },
  "index.subtitle": { en: "Build your own quiz in minutes or challenge yourself with quizzes from the community", pt: "Crie seu próprio quiz em minutos ou desafie-se com quizzes da comunidade" },
  "index.createBtn": { en: "Create a Quiz", pt: "Criar um Quiz" },
  "index.exploreBtn": { en: "Explore Quizzes", pt: "Explorar Quizzes" },
  "index.popular": { en: "Popular Quizzes", pt: "Quizzes Populares" },

  // Explore
  "explore.title": { en: "Explore Quizzes", pt: "Explorar Quizzes" },
  "explore.subtitle": { en: "Discover quizzes created by the community", pt: "Descubra quizzes criados pela comunidade" },
  "explore.search": { en: "Search quizzes...", pt: "Buscar quizzes..." },
  "explore.quizCode": { en: "Quiz code", pt: "Código" },
  "explore.category": { en: "Category", pt: "Categoria" },
  "explore.difficulty": { en: "Difficulty", pt: "Dificuldade" },
  "explore.all": { en: "All", pt: "Todos" },
  "explore.mostPlayed": { en: "Most Played", pt: "Mais Jogados" },
  "explore.highestRated": { en: "Melhor Avaliados", pt: "Melhor Avaliados" },
  "explore.newest": { en: "Newest", pt: "Mais Novos" },
  "explore.mostQuestions": { en: "Most Questions", pt: "Mais Perguntas" },
  "explore.featured": { en: "✨ Featured", pt: "✨ Destaque" },
  "explore.found": { en: "found", pt: "encontrados" },
  "explore.quiz": { en: "quiz", pt: "quiz" },
  "explore.quizzes": { en: "quizzes", pt: "quizzes" },
  "explore.loadMore": { en: "Load More", pt: "Carregar Mais" },
  "explore.noQuizzes": { en: "No quizzes found", pt: "Nenhum quiz encontrado" },
  "explore.beFirst": { en: "Be the first to create one!", pt: "Seja o primeiro a criar um!" },
  "explore.createQuiz": { en: "Create Quiz", pt: "Criar Quiz" },
  "explore.notFound": { en: "Quiz not found. Check the code and try again.", pt: "Quiz não encontrado. Verifique o código e tente novamente." },

  // Sort options (for highestRated fix)
  "sort.mostPlayed": { en: "Most Played", pt: "Mais Jogados" },
  "sort.highestRated": { en: "Highest Rated", pt: "Melhor Avaliados" },
  "sort.newest": { en: "Newest", pt: "Mais Novos" },
  "sort.mostQuestions": { en: "Most Questions", pt: "Mais Perguntas" },

  // Difficulties
  "diff.easy": { en: "Easy", pt: "Fácil" },
  "diff.medium": { en: "Medium", pt: "Médio" },
  "diff.hard": { en: "Hard", pt: "Difícil" },

  // QuizCard
  "card.play": { en: "Play", pt: "Jogar" },

  // Create
  "create.quizInfo": { en: "Quiz Info", pt: "Info do Quiz" },
  "create.addQuestions": { en: "Add Questions", pt: "Adicionar Perguntas" },
  "create.previewPublish": { en: "Preview & Publish", pt: "Visualizar e Publicar" },
  "create.quizInformation": { en: "Quiz Information", pt: "Informações do Quiz" },
  "create.setupBasics": { en: "Set up the basics for your quiz", pt: "Configure o básico do seu quiz" },
  "create.title": { en: "Title", pt: "Título" },
  "create.description": { en: "Description", pt: "Descrição" },
  "create.category": { en: "Category", pt: "Categoria" },
  "create.selectCategory": { en: "Select category", pt: "Selecionar categoria" },
  "create.coverGradient": { en: "Cover Gradient", pt: "Gradiente da Capa" },
  "create.timeLimit": { en: "Time limit per question", pt: "Tempo limite por pergunta" },
  "create.timeLimitDesc": { en: "Set a countdown for each question", pt: "Defina uma contagem regressiva para cada pergunta" },
  "create.timeLimitLabel": { en: "Time limit", pt: "Tempo limite" },
  "create.shuffle": { en: "Shuffle questions", pt: "Embaralhar perguntas" },
  "create.shuffleDesc": { en: "Randomize question order", pt: "Aleatorizar a ordem das perguntas" },
  "create.showAnswers": { en: "Show correct answer after each question", pt: "Mostrar resposta correta após cada pergunta" },
  "create.showAnswersDesc": { en: "Reveal the answer immediately", pt: "Revelar a resposta imediatamente" },
  "create.publicQuiz": { en: "Public quiz", pt: "Quiz público" },
  "create.publicQuizDesc": { en: "Visible in Explore page", pt: "Visível na página Explorar" },
  "create.nextAddQuestions": { en: "Next: Add Questions", pt: "Próximo: Adicionar Perguntas" },
  "create.titleRequired": { en: "Title is required", pt: "Título é obrigatório" },
  "create.categoryRequired": { en: "Please select a category", pt: "Selecione uma categoria" },

  // StepQuestions
  "questions.title": { en: "Add Questions", pt: "Adicionar Perguntas" },
  "questions.added": { en: "added (min 3)", pt: "adicionadas (mín 3)" },
  "questions.question": { en: "question", pt: "pergunta" },
  "questions.questions": { en: "questions", pt: "perguntas" },
  "questions.addQuestion": { en: "Add Question", pt: "Adicionar Pergunta" },
  "questions.questionText": { en: "Question text", pt: "Texto da pergunta" },
  "questions.type": { en: "Type", pt: "Tipo" },
  "questions.multipleChoice": { en: "Multiple Choice", pt: "Múltipla Escolha" },
  "questions.trueFalse": { en: "True/False", pt: "Verdadeiro/Falso" },
  "questions.options": { en: "Options (select the correct answer)", pt: "Opções (selecione a resposta correta)" },
  "questions.correctAnswer": { en: "Correct answer", pt: "Resposta correta" },
  "questions.explanation": { en: "Explanation (optional)", pt: "Explicação (opcional)" },
  "questions.explainPlaceholder": { en: "Explain the correct answer...", pt: "Explique a resposta correta..." },
  "questions.duplicate": { en: "Duplicate", pt: "Duplicar" },
  "questions.delete": { en: "Delete", pt: "Excluir" },
  "questions.addOption": { en: "Add Option", pt: "Adicionar Opção" },
  "questions.untitled": { en: "Untitled question", pt: "Pergunta sem título" },
  "questions.noQuestions": { en: 'No questions yet. Click "Add Question" to get started!', pt: 'Nenhuma pergunta ainda. Clique em "Adicionar Pergunta" para começar!' },
  "questions.back": { en: "Back", pt: "Voltar" },
  "questions.previewPublish": { en: "Preview & Publish", pt: "Visualizar e Publicar" },
  "questions.min3": { en: "Add at least 3 questions", pt: "Adicione pelo menos 3 perguntas" },
  "questions.needsText": { en: "needs text", pt: "precisa de texto" },
  "questions.needs2Options": { en: "needs at least 2 options", pt: "precisa de pelo menos 2 opções" },

  // StepPreview
  "preview.title": { en: "Preview & Publish", pt: "Visualizar e Publicar" },
  "preview.subtitle": { en: "Review your quiz before publishing", pt: "Revise seu quiz antes de publicar" },
  "preview.uncategorized": { en: "Uncategorized", pt: "Sem Categoria" },
  "preview.untitled": { en: "Untitled Quiz", pt: "Quiz sem Título" },
  "preview.perQuestion": { en: "per question", pt: "por pergunta" },
  "preview.public": { en: "Public", pt: "Público" },
  "preview.private": { en: "Private", pt: "Privado" },
  "preview.questionPreview": { en: "Question preview", pt: "Visualização da pergunta" },
  "preview.saveDraft": { en: "Save as Draft", pt: "Salvar como Rascunho" },
  "preview.publishQuiz": { en: "Publish Quiz", pt: "Publicar Quiz" },
  "preview.updateQuiz": { en: "Update Quiz", pt: "Atualizar Quiz" },
  "preview.draftSaved": { en: "Draft saved!", pt: "Rascunho salvo!" },
  "preview.published": { en: "Quiz published! Share code:", pt: "Quiz publicado! Código de compartilhamento:" },
  "preview.updated": { en: "Quiz updated!", pt: "Quiz atualizado!" },
  "preview.setCreatorFirst": { en: "Please set a creator name first in My Quizzes", pt: "Defina um nome de criador em Meus Quizzes primeiro" },

  // Create page
  "create.editing": { en: "Editing", pt: "Editando" },
  "create.draft": { en: "Draft", pt: "Rascunho" },
  "create.editWarning": { en: "Editing a published quiz will affect future players. Existing results will be preserved.", pt: "Editar um quiz publicado afetará futuros jogadores. Resultados existentes serão preservados." },
  "create.editingDraft": { en: "Editing draft", pt: "Editando rascunho" },

  // My Quizzes
  "myQuizzes.title": { en: "My Quizzes", pt: "Meus Quizzes" },
  "myQuizzes.creatingAs": { en: "Creating as", pt: "Criando como" },
  "myQuizzes.newQuiz": { en: "New Quiz", pt: "Novo Quiz" },
  "myQuizzes.noQuizzes": { en: "No quizzes yet", pt: "Nenhum quiz ainda" },
  "myQuizzes.createFirst": { en: "Create your first quiz and share it with the world!", pt: "Crie seu primeiro quiz e compartilhe com o mundo!" },
  "myQuizzes.createFirstBtn": { en: "Create Your First Quiz", pt: "Crie Seu Primeiro Quiz" },
  "myQuizzes.drafts": { en: "Drafts", pt: "Rascunhos" },
  "myQuizzes.published": { en: "Published", pt: "Publicado" },
  "myQuizzes.noDescription": { en: "No description", pt: "Sem descrição" },
  "myQuizzes.edit": { en: "Edit", pt: "Editar" },
  "myQuizzes.publish": { en: "Publish", pt: "Publicar" },
  "myQuizzes.stats": { en: "Stats", pt: "Estatísticas" },
  "myQuizzes.share": { en: "Share", pt: "Compartilhar" },
  "myQuizzes.duplicate": { en: "Duplicate", pt: "Duplicar" },
  "myQuizzes.delete": { en: "Delete", pt: "Excluir" },
  "myQuizzes.plays": { en: "plays", pt: "jogadas" },
  "myQuizzes.publishedSuccess": { en: "Published! Share code:", pt: "Publicado! Código:" },
  "myQuizzes.duplicated": { en: "Quiz duplicated as draft!", pt: "Quiz duplicado como rascunho!" },
  "myQuizzes.deleted": { en: "Quiz deleted", pt: "Quiz excluído" },

  // Creator setup
  "creator.title": { en: "Start creating quizzes!", pt: "Comece a criar quizzes!" },
  "creator.subtitle": { en: "Choose a creator name to get started. This will be shown on your published quizzes.", pt: "Escolha um nome de criador para começar. Ele aparecerá nos seus quizzes publicados." },
  "creator.placeholder": { en: "Your creator name", pt: "Seu nome de criador" },
  "creator.btn": { en: "Create My First Quiz", pt: "Criar Meu Primeiro Quiz" },
  "creator.enterName": { en: "Please enter a creator name", pt: "Digite um nome de criador" },
  "creator.minLength": { en: "Name must be at least 2 characters", pt: "O nome deve ter pelo menos 2 caracteres" },

  // Delete modal
  "delete.title": { en: "Delete Quiz", pt: "Excluir Quiz" },
  "delete.description": { en: "This action cannot be undone. Type", pt: "Esta ação não pode ser desfeita. Digite" },
  "delete.toConfirm": { en: "to confirm.", pt: "para confirmar." },
  "delete.placeholder": { en: "Type quiz title to confirm", pt: "Digite o título do quiz para confirmar" },
  "delete.cancel": { en: "Cancel", pt: "Cancelar" },
  "delete.confirm": { en: "Delete", pt: "Excluir" },

  // Share modal
  "share.title": { en: "Share Quiz", pt: "Compartilhar Quiz" },
  "share.code": { en: "Quiz Code", pt: "Código do Quiz" },
  "share.link": { en: "Share Link", pt: "Link de Compartilhamento" },

  // Quiz stats modal
  "statsModal.statistics": { en: "Statistics", pt: "Estatísticas" },
  "statsModal.totalPlays": { en: "Total Plays", pt: "Total de Jogadas" },
  "statsModal.avgScore": { en: "Avg Score", pt: "Pontuação Média" },
  "statsModal.avgRating": { en: "Avg Rating", pt: "Avaliação Média" },
  "statsModal.bestScore": { en: "Best Score", pt: "Melhor Pontuação" },
  "statsModal.scoreDist": { en: "Score Distribution", pt: "Distribuição de Pontuação" },
  "statsModal.hardest": { en: "Hardest Questions", pt: "Perguntas Mais Difíceis" },
  "statsModal.recentPlayers": { en: "Recent Players", pt: "Jogadores Recentes" },
  "statsModal.player": { en: "Player", pt: "Jogador" },
  "statsModal.score": { en: "Score", pt: "Pontuação" },
  "statsModal.time": { en: "Time", pt: "Tempo" },
  "statsModal.date": { en: "Date", pt: "Data" },
  "statsModal.noPlays": { en: "No one has played this quiz yet. Share it to get results!", pt: "Ninguém jogou este quiz ainda. Compartilhe para obter resultados!" },

  // Play page
  "play.loading": { en: "Loading quiz...", pt: "Carregando quiz..." },
  "play.notFound": { en: "Quiz not found", pt: "Quiz não encontrado" },
  "play.notFoundDesc": { en: "doesn't exist or has been removed.", pt: "não existe ou foi removido." },
  "play.goExplore": { en: "Go to Explore", pt: "Ir para Explorar" },
  "play.played": { en: "Played", pt: "Jogado" },
  "play.times": { en: "times", pt: "vezes" },
  "play.avgScore": { en: "Avg score:", pt: "Pontuação média:" },
  "play.yourName": { en: "Your name", pt: "Seu nome" },
  "play.enterName": { en: "Enter your name", pt: "Digite seu nome" },
  "play.startQuiz": { en: "Start Quiz", pt: "Iniciar Quiz" },
  "play.sPerQuestion": { en: "s/question", pt: "s/pergunta" },

  // Quiz game
  "game.questionOf": { en: "of", pt: "de" },
  "game.question": { en: "Question", pt: "Pergunta" },
  "game.nextQuestion": { en: "Next Question", pt: "Próxima Pergunta" },
  "game.seeResults": { en: "See Results", pt: "Ver Resultados" },
  "game.true": { en: "True", pt: "Verdadeiro" },
  "game.false": { en: "False", pt: "Falso" },

  // Results
  "results.outOf": { en: "out of", pt: "de" },
  "results.correct": { en: "correct", pt: "corretas" },
  "results.perfect": { en: "PERFECT SCORE! You're a genius!", pt: "PONTUAÇÃO PERFEITA! Você é um gênio!" },
  "results.amazing": { en: "Amazing! Almost perfect!", pt: "Incrível! Quase perfeito!" },
  "results.great": { en: "Great score! Impressive knowledge.", pt: "Ótima pontuação! Conhecimento impressionante." },
  "results.good": { en: "Good job! You know your stuff.", pt: "Bom trabalho! Você manja do assunto." },
  "results.nice": { en: "Nice try! Room for improvement.", pt: "Boa tentativa! Há espaço para melhorar." },
  "results.keep": { en: "Keep practicing! You'll get there.", pt: "Continue praticando! Você vai chegar lá." },
  "results.newRecord": { en: "New Record!", pt: "Novo Recorde!" },
  "results.score": { en: "Score", pt: "Pontuação" },
  "results.accuracy": { en: "Accuracy", pt: "Precisão" },
  "results.time": { en: "Time", pt: "Tempo" },
  "results.avgTime": { en: "Avg Time", pt: "Tempo Médio" },
  "results.review": { en: "Review your answers", pt: "Revise suas respostas" },
  "results.yourAnswer": { en: "Your answer", pt: "Sua resposta" },
  "results.leaderboard": { en: "Leaderboard for this quiz", pt: "Ranking deste quiz" },
  "results.you": { en: "You", pt: "Você" },
  "results.rateQuiz": { en: "Rate this quiz", pt: "Avalie este quiz" },
  "results.thanksRating": { en: "Thanks for rating!", pt: "Obrigado pela avaliação!" },
  "results.playAgain": { en: "Play Again", pt: "Jogar Novamente" },
  "results.shareResult": { en: "Share Result", pt: "Compartilhar Resultado" },
  "results.exploreMore": { en: "Explore More", pt: "Explorar Mais" },
  "results.linkCopied": { en: "Link copied to clipboard!", pt: "Link copiado!" },

  // Stats page
  "stats.title": { en: "Statistics", pt: "Estatísticas" },
  "stats.subtitle": { en: "Play some quizzes to see your stats here!", pt: "Jogue alguns quizzes para ver suas estatísticas aqui!" },

  // Not found
  "notFound.title": { en: "404", pt: "404" },
  "notFound.message": { en: "Oops! Page not found", pt: "Ops! Página não encontrada" },
  "notFound.back": { en: "Return to Home", pt: "Voltar para o Início" },

  // Mock quizzes translations
  "mock.js.title": { en: "JavaScript Mastery", pt: "Domínio de JavaScript" },
  "mock.js.desc": { en: "Test your JS knowledge from basics to advanced concepts.", pt: "Teste seu conhecimento de JS do básico ao avançado." },
  "mock.solar.title": { en: "Solar System Explorer", pt: "Explorador do Sistema Solar" },
  "mock.solar.desc": { en: "How much do you know about our cosmic neighborhood?", pt: "Quanto você sabe sobre nossa vizinhança cósmica?" },
  "mock.ww2.title": { en: "World War II Facts", pt: "Fatos da Segunda Guerra Mundial" },
  "mock.ww2.desc": { en: "Challenge your knowledge of WWII history.", pt: "Desafie seu conhecimento da história da WWII." },
  "mock.anime.title": { en: "Anime Characters Quiz", pt: "Quiz de Personagens de Anime" },
  "mock.anime.desc": { en: "Can you name these iconic anime characters?", pt: "Você consegue nomear esses personagens icônicos de anime?" },
  "mock.music.title": { en: "90s Music Hits", pt: "Hits Musicais dos Anos 90" },
  "mock.music.desc": { en: "Test your knowledge of the greatest 90s bangers.", pt: "Teste seu conhecimento dos maiores hits dos anos 90." },
  "mock.capitals.title": { en: "Country Capitals", pt: "Capitais dos Países" },
  "mock.capitals.desc": { en: "Match countries with their capital cities.", pt: "Associe países às suas capitais." },
  "mock.react.title": { en: "React Hooks Deep Dive", pt: "Mergulho nos Hooks do React" },
  "mock.react.desc": { en: "How well do you understand React hooks?", pt: "Quão bem você entende os hooks do React?" },
  "mock.nba.title": { en: "NBA Legends", pt: "Lendas da NBA" },
  "mock.nba.desc": { en: "Test your knowledge of basketball's greatest players.", pt: "Teste seu conhecimento dos maiores jogadores de basquete." },
  "mock.marvel.title": { en: "Marvel vs DC", pt: "Marvel vs DC" },
  "mock.marvel.desc": { en: "Do you know your superheroes?", pt: "Você conhece seus super-heróis?" },
  "mock.python.title": { en: "Python Basics", pt: "Básico de Python" },
  "mock.python.desc": { en: "Are you a Python beginner or expert?", pt: "Você é iniciante ou expert em Python?" },
  "mock.movies.title": { en: "Famous Movie Quotes", pt: "Frases Famosas de Filmes" },
  "mock.movies.desc": { en: "Name the movie from the iconic quote.", pt: "Identifique o filme pela frase icônica." },
  "mock.gaming.title": { en: "Gaming Trivia", pt: "Curiosidades de Games" },
  "mock.gaming.desc": { en: "How much do you know about video games?", pt: "Quanto você sabe sobre videogames?" },
  "mock.math.title": { en: "Basic Math Challenge", pt: "Desafio de Matemática Básica" },
  "mock.math.desc": { en: "Quick math problems to test your speed.", pt: "Problemas rápidos de matemática para testar sua velocidade." },
  "mock.lang.title": { en: "English Idioms", pt: "Expressões em Inglês" },
  "mock.lang.desc": { en: "Do you know what these common idioms mean?", pt: "Você sabe o que essas expressões comuns significam?" },
  "mock.gk.title": { en: "General Knowledge Mix", pt: "Mix de Conhecimentos Gerais" },
  "mock.gk.desc": { en: "A random mix of fun trivia questions.", pt: "Uma mistura aleatória de perguntas de curiosidades." },
  "mock.op.title": { en: "One Piece Trivia", pt: "Curiosidades de One Piece" },
  "mock.op.desc": { en: "Test your knowledge of the Grand Line!", pt: "Teste seu conhecimento sobre a Grand Line!" },

  // Categories translations
  "cat.Technology": { en: "Technology", pt: "Tecnologia" },
  "cat.Science": { en: "Science", pt: "Ciência" },
  "cat.History": { en: "History", pt: "História" },
  "cat.Geography": { en: "Geography", pt: "Geografia" },
  "cat.Sports": { en: "Sports", pt: "Esportes" },
  "cat.Entertainment": { en: "Entertainment", pt: "Entretenimento" },
  "cat.Anime & Manga": { en: "Anime & Manga", pt: "Anime e Mangá" },
  "cat.Gaming": { en: "Gaming", pt: "Games" },
  "cat.Music": { en: "Music", pt: "Música" },
  "cat.Movies & TV": { en: "Movies & TV", pt: "Filmes e TV" },
  "cat.General Knowledge": { en: "General Knowledge", pt: "Conhecimentos Gerais" },
  "cat.Language": { en: "Language", pt: "Idiomas" },
  "cat.Math": { en: "Math", pt: "Matemática" },
  "cat.Custom": { en: "Custom", pt: "Personalizado" },
} as const;

export type TranslationKey = keyof typeof translations;

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
  tCat: (category: string) => string;
  tDiff: (difficulty: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
  tCat: (c) => c,
  tDiff: (d) => d,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("quizcraft-lang") as Lang) || "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("quizcraft-lang", l);
  };

  const t = (key: TranslationKey): string => {
    return translations[key]?.[lang] ?? key;
  };

  const tCat = (category: string): string => {
    const key = `cat.${category}` as TranslationKey;
    return translations[key]?.[lang] ?? category;
  };

  const tDiff = (difficulty: string): string => {
    const key = `diff.${difficulty}` as TranslationKey;
    return translations[key]?.[lang] ?? difficulty;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, tCat, tDiff }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);

// Mock quiz title/desc translation map by ID
const mockQuizTranslations: Record<string, { title: TranslationKey; desc: TranslationKey }> = {
  "1": { title: "mock.js.title", desc: "mock.js.desc" },
  "2": { title: "mock.solar.title", desc: "mock.solar.desc" },
  "3": { title: "mock.ww2.title", desc: "mock.ww2.desc" },
  "4": { title: "mock.anime.title", desc: "mock.anime.desc" },
  "5": { title: "mock.music.title", desc: "mock.music.desc" },
  "6": { title: "mock.capitals.title", desc: "mock.capitals.desc" },
  "7": { title: "mock.react.title", desc: "mock.react.desc" },
  "8": { title: "mock.nba.title", desc: "mock.nba.desc" },
  "9": { title: "mock.marvel.title", desc: "mock.marvel.desc" },
  "10": { title: "mock.python.title", desc: "mock.python.desc" },
  "11": { title: "mock.movies.title", desc: "mock.movies.desc" },
  "12": { title: "mock.gaming.title", desc: "mock.gaming.desc" },
  "13": { title: "mock.math.title", desc: "mock.math.desc" },
  "14": { title: "mock.lang.title", desc: "mock.lang.desc" },
  "15": { title: "mock.gk.title", desc: "mock.gk.desc" },
  "16": { title: "mock.op.title", desc: "mock.op.desc" },
};

export function getQuizTranslationKeys(id: string) {
  return mockQuizTranslations[id] ?? null;
}
