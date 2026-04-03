import type { QuizFormData, Question } from "./constants";
import { GRADIENTS } from "./constants";

export interface QuizTemplate {
  name: string;
  description: string;
  icon: string;
  formData: QuizFormData;
  questions: Question[];
}

export const QUIZ_TEMPLATES: QuizTemplate[] = [
  {
    name: "Blank",
    description: "Start from scratch",
    icon: "FileText",
    formData: {
      title: "", description: "", category: "", difficulty: "medium",
      cover_gradient: "", time_limit: null, shuffle_questions: false,
      show_answers: true, is_public: true,
    },
    questions: [],
  },
  {
    name: "Tech Trivia",
    description: "10 programming questions",
    icon: "Code",
    formData: {
      title: "Tech Trivia Challenge",
      description: "Test your programming and technology knowledge!",
      category: "Technology", difficulty: "medium",
      cover_gradient: GRADIENTS[0], time_limit: 30,
      shuffle_questions: true, show_answers: true, is_public: true,
    },
    questions: [
      { id: crypto.randomUUID(), question_text: "What does HTML stand for?", question_type: "multiple_choice", options: [{ text: "Hyper Text Markup Language", is_correct: true }, { text: "High Tech Modern Language", is_correct: false }, { text: "Home Tool Markup Language", is_correct: false }, { text: "Hyper Transfer Markup Language", is_correct: false }], explanation: "HTML stands for HyperText Markup Language, the standard markup language for web pages.", order_index: 0 },
      { id: crypto.randomUUID(), question_text: "Which language is used for styling web pages?", question_type: "multiple_choice", options: [{ text: "HTML", is_correct: false }, { text: "CSS", is_correct: true }, { text: "Python", is_correct: false }, { text: "Java", is_correct: false }], explanation: "CSS (Cascading Style Sheets) is used for describing the presentation of web pages.", order_index: 1 },
      { id: crypto.randomUUID(), question_text: "JavaScript is a compiled language.", question_type: "true_false", options: [{ text: "True", is_correct: false }, { text: "False", is_correct: true }], explanation: "JavaScript is an interpreted (or JIT-compiled) language, not a traditionally compiled one.", order_index: 2 },
      { id: crypto.randomUUID(), question_text: "What does API stand for?", question_type: "multiple_choice", options: [{ text: "Application Programming Interface", is_correct: true }, { text: "Advanced Program Installation", is_correct: false }, { text: "Application Process Integration", is_correct: false }, { text: "Automated Programming Instruction", is_correct: false }], explanation: "API stands for Application Programming Interface — a way for software to communicate.", order_index: 3 },
      { id: crypto.randomUUID(), question_text: "Which company developed TypeScript?", question_type: "multiple_choice", options: [{ text: "Google", is_correct: false }, { text: "Apple", is_correct: false }, { text: "Microsoft", is_correct: true }, { text: "Facebook", is_correct: false }], explanation: "TypeScript was developed by Microsoft and first released in 2012.", order_index: 4 },
      { id: crypto.randomUUID(), question_text: "What does SQL stand for?", question_type: "multiple_choice", options: [{ text: "Structured Query Language", is_correct: true }, { text: "Simple Question Language", is_correct: false }, { text: "Standard Query Logic", is_correct: false }, { text: "System Query Language", is_correct: false }], explanation: "SQL stands for Structured Query Language, used to manage relational databases.", order_index: 5 },
      { id: crypto.randomUUID(), question_text: "React was created by Facebook.", question_type: "true_false", options: [{ text: "True", is_correct: true }, { text: "False", is_correct: false }], explanation: "React was created by Jordan Walke at Facebook and released in 2013.", order_index: 6 },
      { id: crypto.randomUUID(), question_text: "What is the main purpose of Git?", question_type: "multiple_choice", options: [{ text: "Web hosting", is_correct: false }, { text: "Version control", is_correct: true }, { text: "Database management", is_correct: false }, { text: "Code compilation", is_correct: false }], explanation: "Git is a distributed version control system for tracking changes in source code.", order_index: 7 },
      { id: crypto.randomUUID(), question_text: "Which of these is NOT a programming language?", question_type: "multiple_choice", options: [{ text: "Python", is_correct: false }, { text: "Ruby", is_correct: false }, { text: "Photoshop", is_correct: true }, { text: "Go", is_correct: false }], explanation: "Photoshop is an image editing software by Adobe, not a programming language.", order_index: 8 },
      { id: crypto.randomUUID(), question_text: "What does JSON stand for?", question_type: "multiple_choice", options: [{ text: "JavaScript Object Notation", is_correct: true }, { text: "Java Standard Object Network", is_correct: false }, { text: "JavaScript Organized Numbers", is_correct: false }, { text: "Java Source Open Network", is_correct: false }], explanation: "JSON is JavaScript Object Notation — a lightweight data-interchange format.", order_index: 9 },
    ],
  },
  {
    name: "Anime Challenge",
    description: "10 classic anime questions",
    icon: "Sparkles",
    formData: {
      title: "Anime Challenge",
      description: "How well do you know classic and modern anime?",
      category: "Anime & Manga", difficulty: "medium",
      cover_gradient: GRADIENTS[3], time_limit: null,
      shuffle_questions: true, show_answers: true, is_public: true,
    },
    questions: [
      { id: crypto.randomUUID(), question_text: "Who is the main protagonist of Naruto?", question_type: "multiple_choice", options: [{ text: "Sasuke Uchiha", is_correct: false }, { text: "Naruto Uzumaki", is_correct: true }, { text: "Kakashi Hatake", is_correct: false }, { text: "Itachi Uchiha", is_correct: false }], explanation: "Naruto Uzumaki is the titular character and main protagonist of the series.", order_index: 0 },
      { id: crypto.randomUUID(), question_text: "What is the name of Goku's signature attack?", question_type: "multiple_choice", options: [{ text: "Rasengan", is_correct: false }, { text: "Kamehameha", is_correct: true }, { text: "Spirit Bomb", is_correct: false }, { text: "Final Flash", is_correct: false }], explanation: "The Kamehameha is Goku's signature energy wave, learned from Master Roshi.", order_index: 1 },
      { id: crypto.randomUUID(), question_text: "One Piece is the best-selling manga of all time.", question_type: "true_false", options: [{ text: "True", is_correct: true }, { text: "False", is_correct: false }], explanation: "One Piece holds the Guinness World Record for most copies published for the same comic book series.", order_index: 2 },
      { id: crypto.randomUUID(), question_text: "Who created Death Note?", question_type: "multiple_choice", options: [{ text: "Eiichiro Oda", is_correct: false }, { text: "Tsugumi Ohba & Takeshi Obata", is_correct: true }, { text: "Akira Toriyama", is_correct: false }, { text: "Masashi Kishimoto", is_correct: false }], explanation: "Death Note was written by Tsugumi Ohba and illustrated by Takeshi Obata.", order_index: 3 },
      { id: crypto.randomUUID(), question_text: "What is Luffy's Devil Fruit power?", question_type: "multiple_choice", options: [{ text: "Fire manipulation", is_correct: false }, { text: "Rubber body", is_correct: true }, { text: "Ice creation", is_correct: false }, { text: "Teleportation", is_correct: false }], explanation: "Luffy ate the Gomu Gomu no Mi (Rubber-Rubber Fruit), giving his body rubber properties.", order_index: 4 },
      { id: crypto.randomUUID(), question_text: "In Attack on Titan, what are the walls named after?", question_type: "multiple_choice", options: [{ text: "Greek gods", is_correct: false }, { text: "Roman emperors", is_correct: false }, { text: "Biblical figures (Maria, Rose, Sina)", is_correct: true }, { text: "Japanese cities", is_correct: false }], explanation: "The three walls are named Maria, Rose, and Sina after the three daughters of the Founder.", order_index: 5 },
      { id: crypto.randomUUID(), question_text: "Studio Ghibli was founded by Hayao Miyazaki.", question_type: "true_false", options: [{ text: "True", is_correct: true }, { text: "False", is_correct: false }], explanation: "Studio Ghibli was co-founded by Hayao Miyazaki and Isao Takahata in 1985.", order_index: 6 },
      { id: crypto.randomUUID(), question_text: "What is Pikachu's type in Pokémon?", question_type: "multiple_choice", options: [{ text: "Fire", is_correct: false }, { text: "Water", is_correct: false }, { text: "Electric", is_correct: true }, { text: "Normal", is_correct: false }], explanation: "Pikachu is an Electric-type Pokémon, the mascot of the franchise.", order_index: 7 },
      { id: crypto.randomUUID(), question_text: "In My Hero Academia, what is Deku's quirk called?", question_type: "multiple_choice", options: [{ text: "All For One", is_correct: false }, { text: "One For All", is_correct: true }, { text: "Full Cowling", is_correct: false }, { text: "Detroit Smash", is_correct: false }], explanation: "Deku inherited 'One For All' from All Might, a stockpiling power quirk.", order_index: 8 },
      { id: crypto.randomUUID(), question_text: "Spirited Away won the Academy Award for Best Animated Feature.", question_type: "true_false", options: [{ text: "True", is_correct: true }, { text: "False", is_correct: false }], explanation: "Spirited Away (2001) won the Oscar for Best Animated Feature Film in 2003.", order_index: 9 },
    ],
  },
  {
    name: "World Capitals",
    description: "10 geography questions",
    icon: "Globe",
    formData: {
      title: "World Capitals Quiz",
      description: "Can you match countries with their capital cities?",
      category: "Geography", difficulty: "easy",
      cover_gradient: GRADIENTS[5], time_limit: 20,
      shuffle_questions: true, show_answers: true, is_public: true,
    },
    questions: [
      { id: crypto.randomUUID(), question_text: "What is the capital of Japan?", question_type: "multiple_choice", options: [{ text: "Osaka", is_correct: false }, { text: "Tokyo", is_correct: true }, { text: "Kyoto", is_correct: false }, { text: "Yokohama", is_correct: false }], explanation: "Tokyo has been the capital of Japan since 1868.", order_index: 0 },
      { id: crypto.randomUUID(), question_text: "What is the capital of Australia?", question_type: "multiple_choice", options: [{ text: "Sydney", is_correct: false }, { text: "Melbourne", is_correct: false }, { text: "Canberra", is_correct: true }, { text: "Brisbane", is_correct: false }], explanation: "Canberra is the capital, chosen as a compromise between Sydney and Melbourne.", order_index: 1 },
      { id: crypto.randomUUID(), question_text: "What is the capital of Brazil?", question_type: "multiple_choice", options: [{ text: "São Paulo", is_correct: false }, { text: "Rio de Janeiro", is_correct: false }, { text: "Brasília", is_correct: true }, { text: "Salvador", is_correct: false }], explanation: "Brasília was purpose-built as the capital and inaugurated in 1960.", order_index: 2 },
      { id: crypto.randomUUID(), question_text: "Paris is the capital of France.", question_type: "true_false", options: [{ text: "True", is_correct: true }, { text: "False", is_correct: false }], explanation: "Paris has been the capital of France since the late 10th century.", order_index: 3 },
      { id: crypto.randomUUID(), question_text: "What is the capital of Canada?", question_type: "multiple_choice", options: [{ text: "Toronto", is_correct: false }, { text: "Vancouver", is_correct: false }, { text: "Montreal", is_correct: false }, { text: "Ottawa", is_correct: true }], explanation: "Ottawa was chosen as the capital by Queen Victoria in 1857.", order_index: 4 },
      { id: crypto.randomUUID(), question_text: "What is the capital of Egypt?", question_type: "multiple_choice", options: [{ text: "Alexandria", is_correct: false }, { text: "Cairo", is_correct: true }, { text: "Luxor", is_correct: false }, { text: "Giza", is_correct: false }], explanation: "Cairo is the capital and largest city of Egypt.", order_index: 5 },
      { id: crypto.randomUUID(), question_text: "The capital of Switzerland is Zurich.", question_type: "true_false", options: [{ text: "True", is_correct: false }, { text: "False", is_correct: true }], explanation: "Bern is the de facto capital (federal city) of Switzerland, not Zurich.", order_index: 6 },
      { id: crypto.randomUUID(), question_text: "What is the capital of South Korea?", question_type: "multiple_choice", options: [{ text: "Busan", is_correct: false }, { text: "Incheon", is_correct: false }, { text: "Seoul", is_correct: true }, { text: "Daegu", is_correct: false }], explanation: "Seoul has been the capital of Korea for over 600 years.", order_index: 7 },
      { id: crypto.randomUUID(), question_text: "What is the capital of Turkey?", question_type: "multiple_choice", options: [{ text: "Istanbul", is_correct: false }, { text: "Ankara", is_correct: true }, { text: "Izmir", is_correct: false }, { text: "Antalya", is_correct: false }], explanation: "Ankara has been the capital since 1923 when the Republic of Turkey was founded.", order_index: 8 },
      { id: crypto.randomUUID(), question_text: "What is the capital of New Zealand?", question_type: "multiple_choice", options: [{ text: "Auckland", is_correct: false }, { text: "Christchurch", is_correct: false }, { text: "Wellington", is_correct: true }, { text: "Queenstown", is_correct: false }], explanation: "Wellington has been the capital of New Zealand since 1865.", order_index: 9 },
    ],
  },
  {
    name: "Science Basics",
    description: "10 general science questions",
    icon: "FlaskConical",
    formData: {
      title: "Science Basics",
      description: "Test your fundamental science knowledge!",
      category: "Science", difficulty: "easy",
      cover_gradient: GRADIENTS[1], time_limit: null,
      shuffle_questions: false, show_answers: true, is_public: true,
    },
    questions: [
      { id: crypto.randomUUID(), question_text: "What is the chemical symbol for water?", question_type: "multiple_choice", options: [{ text: "HO", is_correct: false }, { text: "H2O", is_correct: true }, { text: "OH2", is_correct: false }, { text: "H2O2", is_correct: false }], explanation: "Water is composed of two hydrogen atoms and one oxygen atom: H₂O.", order_index: 0 },
      { id: crypto.randomUUID(), question_text: "What planet is closest to the Sun?", question_type: "multiple_choice", options: [{ text: "Venus", is_correct: false }, { text: "Earth", is_correct: false }, { text: "Mercury", is_correct: true }, { text: "Mars", is_correct: false }], explanation: "Mercury orbits closest to the Sun at an average distance of 57.9 million km.", order_index: 1 },
      { id: crypto.randomUUID(), question_text: "Humans have 206 bones in their body.", question_type: "true_false", options: [{ text: "True", is_correct: true }, { text: "False", is_correct: false }], explanation: "An adult human body has 206 bones (babies are born with about 270).", order_index: 2 },
      { id: crypto.randomUUID(), question_text: "What gas do plants absorb from the atmosphere?", question_type: "multiple_choice", options: [{ text: "Oxygen", is_correct: false }, { text: "Nitrogen", is_correct: false }, { text: "Carbon Dioxide", is_correct: true }, { text: "Hydrogen", is_correct: false }], explanation: "Plants absorb CO₂ during photosynthesis and release oxygen.", order_index: 3 },
      { id: crypto.randomUUID(), question_text: "What is the speed of light approximately?", question_type: "multiple_choice", options: [{ text: "300,000 km/s", is_correct: true }, { text: "150,000 km/s", is_correct: false }, { text: "500,000 km/s", is_correct: false }, { text: "1,000,000 km/s", is_correct: false }], explanation: "Light travels at approximately 299,792 km/s in a vacuum.", order_index: 4 },
      { id: crypto.randomUUID(), question_text: "Diamonds are made of carbon.", question_type: "true_false", options: [{ text: "True", is_correct: true }, { text: "False", is_correct: false }], explanation: "Diamonds are a crystalline form of pure carbon, formed under extreme pressure and heat.", order_index: 5 },
      { id: crypto.randomUUID(), question_text: "What is the largest organ in the human body?", question_type: "multiple_choice", options: [{ text: "Liver", is_correct: false }, { text: "Brain", is_correct: false }, { text: "Skin", is_correct: true }, { text: "Heart", is_correct: false }], explanation: "The skin is the largest organ, covering about 1.5-2 square meters in adults.", order_index: 6 },
      { id: crypto.randomUUID(), question_text: "What force keeps us on the ground?", question_type: "multiple_choice", options: [{ text: "Magnetism", is_correct: false }, { text: "Gravity", is_correct: true }, { text: "Friction", is_correct: false }, { text: "Inertia", is_correct: false }], explanation: "Gravity is the force of attraction between objects with mass.", order_index: 7 },
      { id: crypto.randomUUID(), question_text: "Sound travels faster in water than in air.", question_type: "true_false", options: [{ text: "True", is_correct: true }, { text: "False", is_correct: false }], explanation: "Sound travels about 4.3 times faster in water (~1,480 m/s) than in air (~343 m/s).", order_index: 8 },
      { id: crypto.randomUUID(), question_text: "What is the atomic number of Hydrogen?", question_type: "multiple_choice", options: [{ text: "0", is_correct: false }, { text: "1", is_correct: true }, { text: "2", is_correct: false }, { text: "8", is_correct: false }], explanation: "Hydrogen has atomic number 1, meaning it has one proton in its nucleus.", order_index: 9 },
    ],
  },
];
