# 🧠 MindSense: Clinical-Grade Neural Diagnostics

![Version](https://img.shields.io/badge/Version-1.2.0-blueviolet?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Resume--Ready-success?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-FastAPI%20%7C%20React%20%7C%20NLP-blue?style=for-the-badge)

**MindSense** is a state-of-the-art mental health pattern detection system designed for high-fidelity clinical assessment. It combines advanced Natural Language Processing (NLP) with a "Clinical-Calm" user experience to provide deep insights into psychological markers while maintaining a supportive, empathetic environment.

---

## 🚀 Key Innovation Highlights

### 🔍 Explainable AI (XAI)
Unlike "black-box" models, MindSense features **Neural Language Mapping**. It identifies and highlights specific linguistic trigger words (using simulated LIME logic), showing exactly which tokens influenced the model's categorical classification.

### 📊 Multi-Model Performance Matrix
The platform benches three distinct architectures in real-time:
- **DistilBERT**: Transformer-based context extraction.
- **LSTM**: Recurrent sequences for emotional flow.
- **SVM**: Statistical baseline for reliable verification.

### 🌊 Zen Mode Integration
A unique therapeutic feature that allows users to toggle **high-fidelity ambient rain audio** while they write, reducing stress during the analysis process.

### 📜 Formal Clinical Transcripts
Generate professional, serialized medical reports with one click. The system produces a formatted PDF transcript including diagnostic clusters, peak intensity metrics, and therapeutic recommendations.

---

## 🛠️ Technical Architecture

### **The Frontend (React 19)**
- **Aesthetics**: Glassmorphism UI with a strict "Clinical-Calm" dark mode.
- **Animations**: `Framer Motion` for staggered entrance and neural scan-line effects.
- **Visualization**: `Recharts` for probabilistic matrices and confidence trend-lines.

### **The Backend (FastAPI)**
- **NLP Pipeline**: Pre-processing via TF-IDF vectorization and custom tokenizers.
- **Microservice**: Lightweight and stateless, ensuring user data is never stored outside the local session.

---

## 🏁 Getting Started

### 1. Initialize the ML Engine (Backend)
```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Launch the Neural API
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Launch the Interface (Frontend)
```bash
# Navigate to frontend
cd frontend

# Install & Run
npm install
npm run dev
```
Visit `http://localhost:5173` to start your session.

---

## 🛡️ Ethics & Responsibility
MindSense is built with **Responsible AI** at its core:
- **Crisis Detection**: Automatically triggers immediate help resources if severe markers are detected.
- **Privacy-First**: All text analysis is stateless; no sensitive data is persisted on any server.
- **Disclaimer**: Clearly states its role as a supportive tool, not a medical replacement.

---

## 👨‍💻 Developer Summary
This project was architected to showcase full-stack proficiency, particularly in **Machine Learning Explainability**, **Advanced Data Visualization**, and **Premium Frontend Engineering**. It serves as a comprehensive demonstration of how AI can be integrated into sensitive clinical workflows with empathy and precision.
