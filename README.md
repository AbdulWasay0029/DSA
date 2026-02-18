# AlgoStream 🚀

**AlgoStream** is a premium, community-driven platform for mastering Data Structures and Algorithms. Built as a sleek, modern alternative to traditional note-taking apps, it features a glassmorphic UI, progress tracking, and a curated curriculum.

![AlgoStream Preview](https://via.placeholder.com/800x400?text=AlgoStream+Dashboard)

## ✨ Features

- **Curated Curriculum**: Structured path from Arrays to Dynamic Programming.
- **Premium Notes**: Detailed problem breakdowns with intuition, complexity analysis, and solution code blocks.
- **Syntax Highlighting**: VS Code-style code snippets for easy reading.
- **Progress Tracking**: Visualize your mastery with status indicators and difficulty badges.
- **Resource Library**: A searchable collection of best external links (LeetCode, GFG, YouTube).
- **Secure Auth**: Google Sign-In with Role-Based Access Control (Admin/Visitor).

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules with Glassmorphism
- **Database**: MongoDB (via Mongoose)
- **Auth**: NextAuth.js (Google Provider)
- **Deployment**: Vercel

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/DSA.git
    cd DSA
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_nextauth_secret_key
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ADMIN_EMAILS=admin@example.com
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🤝 Contributing

This project is currently for personal study and small group collaboration. Suggestions are welcome via the "Suggest Improvement" feature on any note page.

## 📄 License

Private / Personal Use.


