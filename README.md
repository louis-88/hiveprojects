# 🐝 Hive Projects Directory

A world-class, high-performance directory of projects, apps, and tools built on the **Hive blockchain**. This application serves as a central hub for the Hive ecosystem, enabling discovery through advanced filtering, search, and detailed project profiles.

![Hive Projects](https://hive.io/images/hive-logo.svg)

## ✨ Features

- **📂 Categorized Discovery**: Browse the ecosystem through specialized sectors (DeFi, Games, Social, DEX, etc.).
- **🔍 Advanced Search**: Real-time filtering with a classic "I'm Feeling Lucky" random discovery mode.
- **🖼️ Flexible Layouts**: Toggle between a detailed **List View** and a visual **Grid View**.
- **👤 Developer Profiles**: Explore the builders behind the apps, featuring contribution histories and blockchain-synced avatars.
- **❤️ Favorites Management**: Save up to 10 of your favorite projects locally for quick access.
- **📝 Engineering Submission Form**: A powerful tool for project owners to generate `custom_json` payloads for the directory, including:
  - Real-time Hive blockchain synchronization for team members.
  - Interactive project timeline builder.
  - Visual asset management and JSON preview.
- **🌓 Dark Mode**: Full system-aware dark and light mode support with smooth transitions.
- **📱 Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: React Hooks (State, Memo, Callback, Effect)

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/hiveprojects.git
   cd hiveprojects
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

To create a production-ready build:
```bash
npm run build
```
The output will be in the `dist/` directory.

## 📁 Project Structure

- `App.tsx`: Main application logic and view routing.
- `components/`: Reusable UI components (Header, ProjectCard, Sidebar).
- `projects/`: Modular project data files.
- `types.ts`: TypeScript interfaces for Projects, Team Members, and Timeline events.
- `data.ts`: Central registry for categories and project indexing.

## 🤝 Contributing

We welcome contributions to the directory! 

1. Use the **"Add Project"** feature in the app to generate your project's JSON.
2. Create a new file in `projects/[project-id].ts`.
3. Export your project constant and add it to `projects/index.ts`.
4. Submit a Pull Request.

## 📜 Credits & License

Proudly presented by [@louis88](https://peakd.com/@louis88).
Consider supporting development by voting for the [louis.witness](https://hivesigner.com/sign/account-witness-vote?witness=louis.witness&approve=1) on the Hive blockchain.

Distributed under the MIT License. See `LICENSE` for more information.
