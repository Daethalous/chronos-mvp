# Reading Steiner (Fate Detection System)

Reading Steiner is an interactive storytelling engine that allows users to explore divergent historical timelines through a card-swiping interface. Powered by Large Language Models (LLM) and Generative AI, it simulates the "Butterfly Effect," where small choices lead to vastly different futures.

The current MVP focuses on the timeline of **Donald Trump**, exploring paths of ambition, power, and alternative history.

## ✨ Features

- **Immersive Storytelling**: Experience historical and fictional events with vivid descriptions and typewriter text effects.
- **AIGC Powered**:
  - **Dynamic Narratives**: Uses OpenAI `gpt-4o-mini` to generate unique story branches in real-time based on your choices.
  - **Generative Art**: Uses DALL-E 3 to create moody, historical-style illustrations for every new scenario.
- **Card Swiping Interface**: Intuitive Tinder-style mechanics—swipe **Left** for radical change/risk, **Right** for conservatism/safety.
- **Worldline Visualization**: An interactive map (using Cytoscape.js) to view your journey through the multiverse and "time travel" back to previous nodes.
- **Butterfly Effect Engine**: Logic that enforces significant time jumps (5-10+ years) to showcase long-term consequences of decisions.
- **Fully Localized**: English UI and content.

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Visualization**: Cytoscape.js
- **Routing**: React Router
- **AI Integration**: OpenAI API (GPT-4o-mini, DALL-E 3)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- Yarn or npm
- An OpenAI API Key (required for dynamic story and image generation)

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory:
    ```bash
    cd chronos-mvp
    ```

2.  **Install dependencies**:
    ```bash
    yarn install
    ```

3.  **Start the development server**:
    ```bash
    yarn dev
    ```

4.  **Open the application**:
    Visit `http://localhost:5173` in your browser.

## 🎮 How to Play

1.  **Landing Page**: Enter a subject (currently optimized for "Donald Trump") or just click "OBSERVE".
2.  **Configuration**:
    - Enter your **OpenAI API Key** to enable dynamic story and image generation.
    - *Note: You can skip this step to play through the pre-defined static demo scenario.*
3.  **Gameplay**:
    - Read the current scenario and swipe the card:
        - **Left**: Radical/Aggressive choice.
        - **Right**: Conservative/Passive choice.
    - Watch as the AI generates the consequences of your actions.
4.  **Navigation**:
    - Click the **Map** icon to view the timeline tree.
    - Click on any visited node in the map to "Time Leap" back to that point.
    - Click the **Home** icon to return to the main menu.

## 📂 Project Structure

- `src/context/GameContext.tsx`: Core game logic, state management, and AI integration.
- `src/services/llm.ts`: OpenAI API service functions and system prompts.
- `src/pages/GamePage.tsx`: Main gameplay interface with card interactions.
- `src/pages/MapPage.tsx`: Timeline visualization.
- `src/data/mockData.ts`: Static fallback data for offline mode.

## ⚠️ Notes

- The MVP version is currently optimized for the "Donald Trump" character preset.
- Image generation may take a few seconds; a loading indicator is provided.
- Ensure your API key has sufficient credits for GPT-4o-mini and DALL-E 3 usage.

---
*El Psy Kongroo.*
