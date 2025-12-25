# Swipedia

## A Swipe-First Wikipedia Discovery Experience

**Swipedia** transforms Wikipedia exploration into an addictive, gesture-driven experience. Think Tinder, but for knowledge. Discover fascinating topics you never knew existed, save your favorites, and dive deep into subjects that spark your curiosity.

---

## 🎯 Core Concept

Swipedia reimagines how we interact with the world's largest encyclopedia. Instead of searching for specific topics, you're presented with a continuous stream of random Wikipedia articles. Each card reveals a new piece of human knowledge—from obscure historical figures to cutting-edge scientific discoveries.

**The magic is in the serendipity.** You never know what you'll learn next.

---

## 🎮 How It Works

### The Feed
When you open Swipedia, you're greeted with a beautifully designed card showing a Wikipedia article summary. Each card displays:
- A hero image (when available) or a stylized gradient
- The article title
- A concise summary to help you decide if you want to learn more

### Gestures

| Gesture | Action | Description |
|---------|--------|-------------|
| **Swipe Right** | 👍 Like | Save the article to your library for later reading |
| **Swipe Left** | 👎 Skip | Move on to the next article |
| **Swipe Up** | 📖 Deep Dive | Open the full article with expandable sections |
| **Tap** | 📖 Deep Dive | Quick tap to read more about the topic |

### Visual Feedback
- Swiping right reveals a **green "LIKE"** indicator
- Swiping left reveals a **red "SKIP"** indicator
- Cards rotate and animate smoothly with your finger movement

---

## 📚 Features

### 🏠 Feed (Home)
- Infinite stream of random Wikipedia articles
- Pre-fetches articles for seamless browsing
- Beautiful card-based UI with images
- Satisfying swipe animations

### 📖 Deep Dive
- Full article content from Wikipedia
- **Expandable sections** - tap to reveal content
- **In-app navigation** - clicking Wikipedia links opens them within Swipedia
- Clean, readable typography optimized for long-form reading
- References and citations automatically filtered out for cleaner reading

### 💾 Saved Library
- All your liked articles in one place
- Persisted locally using IndexedDB (works offline!)
- Quick access to revisit interesting topics
- Swipe to remove articles from your library

### ⚙️ Settings
- **Dark/Light Mode** - comfortable reading in any environment
- Theme preference saved locally

---

## 🎨 Design System: "Wiki-Modernist"

Swipedia uses a carefully crafted design system that balances Wikipedia's academic heritage with a modern, gesture-driven mobile experience.

### Color Palette: "The Knowledge Spectrum"

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Primary** | Wiki Blue | `#2563EB` | Buttons, links, active states |
| **Secondary** | Indigo Flow | `#6366F1` | Gradients, hover states |
| **Accent** | Scholar Gold | `#F59E0B` | Saved icons, achievements |
| **Background (Light)** | Slate 50 | `#F8FAFC` | Clean, paper-like feel |
| **Background (Dark)** | Slate 900 | `#0F172A` | Deep, focused reading |

### Typography: "The Editorial Pair"

- **UI & Headings**: [Inter](https://fonts.google.com/specimen/Inter) - Modern sans-serif for exceptional screen legibility
- **Article Body**: [Lora](https://fonts.google.com/specimen/Lora) - Contemporary serif for comfortable long-form reading

### Cards: "The Floating Card"

- **Border Radius**: 24px (1.5rem) - Large, "squircle"-style corners
- **Shadows**: Soft depth that lifts cards off the background
- **Interaction**: Cards appear to "lift" when touched

---

## 🛠️ Technical Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | Gesture handling & animations |
| **Zustand** | Lightweight state management |
| **TanStack Query** | Data fetching & caching |
| **Dexie.js** | IndexedDB wrapper for offline storage |
| **Wikipedia REST API** | Article content & summaries |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Enver-k/Swipedia.git

# Navigate to project
cd Swipedia/swipedia

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to start discovering!

---

## 📱 Mobile-First Design

Swipedia is designed primarily for mobile devices but works beautifully on desktop too:

- **Touch gestures** optimized for one-handed use
- **Safe area** support for notched devices
- **PWA-ready** - can be installed as a home screen app
- **Keyboard shortcuts** for desktop users (← → ↑ keys)

---

## 🔮 Future Ideas

- [ ] **Categories/Topics** - Filter articles by interest areas
- [ ] **Streak system** - Gamify daily learning
- [ ] **Share cards** - Beautiful shareable images
- [ ] **Reading statistics** - Track what you've learned
- [ ] **Multilingual support** - Wikipedia in any language
- [ ] **Offline mode** - Download articles for offline reading
- [ ] **Quiz mode** - Test yourself on saved articles

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- **Wikipedia & Wikimedia Foundation** - For making human knowledge free and accessible
- **The open source community** - For the incredible tools that made this possible

---

*Built with ❤️ for curious minds everywhere.*
