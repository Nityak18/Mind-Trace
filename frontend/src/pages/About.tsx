import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, BookOpen, Database, AlertCircle, PhoneCall } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-[720px] mx-auto pb-20">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold mb-4">About MindSense</h1>
        <p className="text-text-secondary text-lg">Understanding mental health through the lens of artificial intelligence.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-12"
      >
        
        {/* Warning Section */}
        <div className="glass-card border-l-4 border-l-tertiary p-6 flex gap-4">
          <AlertCircle className="w-6 h-6 text-tertiary shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg text-white mb-2">Important Disclaimer</h3>
            <p className="text-text-secondary italic text-sm leading-relaxed">
              MindSense is an experimental AI tool designed for educational and supportive purposes. 
              <strong> It is not a diagnostic tool and cannot substitute for professional medical advice, diagnosis, or treatment. </strong>
              If you or someone else is in distress, please seek immediate help from a healthcare professional or helpline.
            </p>
          </div>
        </div>

        {/* System Architecture (Resume Showcase) */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <ShieldAlert className="w-6 h-6 text-secondary" />
            <h2 className="text-2xl font-bold">System Architecture</h2>
          </div>
          
          <div className="relative p-8 bg-surface/30 border border-white/5 rounded-3xl overflow-hidden">
             {/* Simple Visual Flow */}
             <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex-1 text-center p-4 bg-primary/10 rounded-2xl border border-primary/20">
                   <div className="text-[10px] uppercase font-bold text-primary mb-1">Frontend</div>
                   <div className="text-sm font-bold">React 19 / TS</div>
                </div>
                <div className="w-8 h-[2px] bg-white/10 hidden md:block" />
                <div className="flex-1 text-center p-4 bg-secondary/10 rounded-2xl border border-secondary/20">
                   <div className="text-[10px] uppercase font-bold text-secondary mb-1">API Layer</div>
                   <div className="text-sm font-bold">FastAPI / Uvicorn</div>
                </div>
                <div className="w-8 h-[2px] bg-white/10 hidden md:block" />
                <div className="flex-1 text-center p-4 bg-tertiary/10 rounded-2xl border border-tertiary/20">
                   <div className="text-[10px] uppercase font-bold text-tertiary mb-1">ML Engine</div>
                   <div className="text-sm font-bold">Scikit-Learn / Transformers</div>
                </div>
             </div>
             
             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl text-xs leading-relaxed">
                   <span className="text-primary font-bold">NLP Pipeline:</span> Text is preprocessed using TF-IDF and specialized tokenizers before being passed to the ensemble of models for multi-dimensional classification.
                </div>
                <div className="p-4 bg-white/5 rounded-2xl text-xs leading-relaxed">
                   <span className="text-secondary font-bold">Explainability:</span> Using LIME (Local Interpretable Model-agnostic Explanations) to map feature influence back to specific linguistic tokens.
                </div>
             </div>
          </div>
        </section>

        <div className="h-[1px] bg-white/5 w-full" />

        {/* How it works */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">The Model Stack</h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            MindSense utilizes Natural Language Processing (NLP) to detect linguistic patterns associated with various mental health conditions. 
            When you input text, it is tokenized and passed through state-of-the-art machine learning models:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2 ml-2">
            <li><strong>DistilBERT:</strong> A transformer-based model fine-tuned to capture complex emotional context in sentences.</li>
            <li><strong>SVM (Support Vector Machine):</strong> A classical ML approach using TF-IDF feature extraction for reliable baseline predictions.</li>
            <li><strong>LSTM:</strong> Neural networks focused on understanding sequence and flow of thoughts.</li>
          </ul>
        </section>

        <div className="h-[1px] bg-white/5 w-full" />

        {/* Datasets */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Training Data Sources</h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            Our models have been trained on robust, anonymized datasets curated from various public spheres to ensure accuracy and generalization:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {[
              "Depression and Anxiety Reddit Dataset (Kaggle)",
              "Mental Health Corpus Labelled Dataset",
              "Sentiment140 / Twitter Mental Health",
              "Suicide Watch Protection Data"
            ].map((dataset, i) => (
              <div key={i} className="bg-surface p-4 rounded-xl border border-white/5 text-sm text-text-secondary flex items-center">
                <span className="w-2 h-2 rounded-full bg-secondary mr-3 shrink-0" />
                {dataset}
              </div>
            ))}
          </div>
        </section>

        <div className="h-[1px] bg-white/5 w-full" />

        {/* Crisis Resources */}
        <section className="bg-danger/10 border border-danger/20 rounded-2xl p-8 text-center">
          <PhoneCall className="w-10 h-10 text-danger mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Need Immediate Help?</h2>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            You are not alone. Free, confidential support is available 24/7. Reach out to the helpline below.
          </p>
          <a href="tel:9152987821" className="inline-flex items-center justify-center gap-2 bg-danger hover:bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-danger/20">
            iCall India: 9152987821
          </a>
        </section>

      </motion.div>
    </div>
  );
};

export default About;
