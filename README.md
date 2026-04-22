# MindSense - Mental Health Pattern Detection System

MindSense is a robust full-stack ML application for analyzing mental health patterns from user-input text. The system leverages state-of-the-art Natural Language Processing models to determine probabilities for Depression, Anxiety, Stress, PTSD, and Bipolar.

## Tech Stack Overview
- **Frontend:** React.js + Vite, Tailwind CSS, Framer Motion, Recharts
- **Backend:** FastAPI (Python), Uvicorn, Pydantic
- **Machine Learning (Simulated logic + Pipeline boilerplate):** distilbert, Scikit-Learn (TF-IDF + SVM)

## Getting Started

### 1. Start the Backend API
The FastAPI backend acts as a microservice serving predictions locally on port `8000`.

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd "C:\Users\NITYA M K\machine pro\MindSense\backend"
   ```
2. Install the necessary Python packages (Ideally in a virtual environment):
   ```bash
   pip install -r requirements.txt
   ```
3. Run the FastAPI server via Uvicorn:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

### 2. Start the Frontend Website
The React frontend lives in the `/frontend` directory and connects seamlessly to the local backend.

1. Open another terminal and navigate to the frontend directory:
   ```bash
   cd "C:\Users\NITYA M K\machine pro\MindSense\frontend"
   ```
2. Run the Vite development server:
   ```bash
   npm run dev
   ```
3. Visit the URL shown in your terminal (usually `http://localhost:5173`) in your browser.

---

## Implemented Features
* **Stateless Predictive Pipeline:** No conversational data or raw texts are transmitted to or stored in any database. The backend purely parses, predicts, and returns the analysis.
* **Mock Models:** The backend has a lightweight pattern-matching system simulating the DistilBERT / SVM responses out-of-the-box (`backend/main.py`), allowing you to test the UX immediately without waiting for huge model downloads or training.
* **Crisis Help Banner:** Intelligently triggers a sticky banner when Severe conditions are flagged, complying with the safe usage requirement.
* **Glassmorphism Interface:** Uses the specific Plus Jakarta Sans font alongside rich aesthetics combining deep backgrounds (`#0d1117`) and lavender (`#7c6af7`) elements.
* **Local Storage History:** The session memory records locally without sending sensitive history across the network.
* **Framer Motion Animations:** Everything dynamically transitions from the model loaders to the confidence probability bars.
* **Boilerplate ML Code:** Available under `ml/train.py` corresponding to the required sklearn ML pipeline data ingestion and TF Vectorization steps.
