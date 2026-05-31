# VectorShift Pipeline Builder 🚀

A modern, highly-scalable, and beautifully designed drag-and-drop pipeline builder built with React Flow, Zustand, and FastAPI.

This repository fulfills the requirements for the VectorShift Technical Assessment, showcasing advanced frontend component abstraction, dynamic React Flow manipulation, premium UI/UX design, and seamless backend graph validation.

---

## ✨ Key Features

### 1. Extensible Node Architecture (`BaseNode`)
Instead of duplicating code across multiple nodes, the UI and connection logic has been completely abstracted into a single `<BaseNode />` component. 
- **Scalability**: Adding a new node (like a Chart or Filter node) requires practically zero boilerplate. Simply import `BaseNode` and pass it your inputs, outputs, and custom fields.
- **Dynamic Handles**: The abstraction automatically maps and perfectly positions all React Flow `<Handle />` components.

### 2. Premium UI & Shadcn Integration
The default, plain aesthetics have been replaced with a premium, SaaS-quality design.
- **Canvas Design**: A custom dotted canvas with soft, glowing borders and micro-interactions (hover states, animations) inspired by modern tools like n8n.
- **Pipeline Analysis Modal**: Integrated **Tailwind CSS**, **Framer Motion**, and **Radix UI** to build a stunning, glass-morphism popup modal when submitting the pipeline. (Note: Tailwind was configured specifically to *not* conflict with the global React Flow CSS).

### 3. Smart Text Node (Dynamic Resizing & Regex Parsing)
The Text Node isn't just a static box. It is a fully reactive component:
- **Auto-resizing**: As you type, the `textarea` dynamically calculates its `scrollHeight` and text width, expanding seamlessly up to a max-width limit.
- **Live Variable Parsing**: By using Regex (`/\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g`), the node detects when you type a variable wrapped in double brackets (e.g. `{{input_data}}`). It instantly parses the variable and spawns a new input handle on the node.
- **React Flow Syncing**: Utilizes `useUpdateNodeInternals` to ensure edge-routing doesn't break when handles are dynamically added/removed.

### 4. Backend Graph Validation (FastAPI)
- **Zustand State**: The frontend utilizes Zustand to ensure the UI and global node/edge state are always in perfect sync.
- **DAG Detection**: When the pipeline is run, the JSON payload of nodes and edges is sent to the FastAPI backend (`/pipelines/parse`).
- **DFS Algorithm**: The backend constructs an adjacency list and runs a Depth-First Search algorithm with recursion tracking to determine if the pipeline is a valid Directed Acyclic Graph (DAG) or if it contains infinite cycles.

---

## 🛠 Tech Stack
- **Frontend**: React, React Flow, Zustand, Tailwind CSS v3, Framer Motion, Radix UI, Lucide-React
- **Backend**: FastAPI, Python
- **Styling**: Vanilla CSS (Canvas & Nodes) + Tailwind CSS (Modals)

---

## 🚀 Getting Started

### Prerequisites
- Node.js & pnpm (or npm)
- Python 3.9+ 

### 1. Start the Backend
The backend runs a FastAPI server on port 8000.
```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
```

### 2. Start the Frontend
The frontend runs a React development server on port 3000.
```bash
cd frontend
pnpm install
pnpm start
```

### 3. Usage
1. Open your browser to `http://localhost:3000`.
2. Drag and drop nodes from the left toolbar onto the canvas.
3. Type `{{variable_name}}` in the Text Node to see dynamic handles appear.
4. Wire the nodes together. Try creating a loop/cycle!
5. Click **Run Pipeline** to validate the graph structure via the backend.

---

## 📁 Project Structure

```text
├── backend/
│   └── main.py                  # FastAPI server & DAG DFS validation logic
└── frontend/
    ├── src/
    │   ├── nodes/
    │   │   ├── BaseNode.js      # The core abstraction component
    │   │   ├── textNode.js      # Regex variable extraction & auto-resize
    │   │   └── ...              # Input, Output, LLM nodes
    │   ├── components/ui/       # Shadcn UI primitives (Dialog, Button)
    │   ├── store.js             # Zustand global state manager
    │   ├── submit.js            # Fetch API integration & Validation Modal
    │   ├── ui.js                # React Flow canvas setup
    │   └── index.css            # Custom CSS & Tailwind directives
    └── tailwind.config.js       # Tailwind setup
```
