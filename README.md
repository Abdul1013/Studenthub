
# 🎓 StudentHub

A modern **Next.js** web application that allows students to study efficiently for their exams, test with **flashcards** and **quizzes** using **AI**, with **Groq API** for natural language processing and  styled with **Material UI** for a clean, responsive design.



## ✨ Features

* 🤖 **AI-powered Content Generation** using **Groq API**
* 🧠 Create flashcards and quizzes from topics or pasted content
* 🎨 Beautiful, responsive UI using **Material UI (MUI)**
* 📝 User authentication & dashboard 
* 📱 Fully responsive across devices

---

## 🚀 Tech Stack

* **Next.js 15** – Framework for server-side rendering & routing
* **Javascript** – Static typing for safer development
* **Groq API** – AI-generated content (flashcards, quizzes)
* **Paystack** – Payment gateway integration
* **Material UI** – Component-based UI with theme customization
* **Tailwind CSS ** –  used alongside MUI for layout utility

---


## 🛠 Project Structure

```
/
├── components/       # Reusable UI components (e.g., QuizCard, Flashcard)
├── App/      
├── lib/              # Groq API, Paystack utilities
├── styles/           # Global styles and MUI themes
├── public/           # Static assets
├── utils/            # Helper functions
└── README.md
```

---

## 💳 Payments via Paystack

The app uses **Paystack** to unlock premium features (e.g., unlimited generations, export, save to account).
Integration includes:

* Inline checkout via Paystack’s React SDK
* Webhook support (optional for server-side validation)
* User plan or credit-based system (if applicable)

---

## 🧠 Powered by Groq API

AI capabilities include:

* Summarizing text to generate flashcards
* Converting content into multiple-choice or open-ended questions
* Topic-based quiz generation
* Adjustable difficulty levels

---


## 📌 To-Do / Roadmap

* [ ] User performance analytics and monitoring
* [ ] Export to PDF / print format
* [ ] Quiz scoring system with analytics
* [ ] AI difficulty tuning

---


## 📄 License

MIT License © 2025 Your Name

---

## 🔗 Useful Links

* [Groq API Docs](https://console.groq.com/docs)
* [Paystack Docs](https://paystack.com/docs)
* [Material UI](https://mui.com/)
* [Next.js](https://nextjs.org/)

