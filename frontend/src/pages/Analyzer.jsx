import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, ShieldAlert, Loader2 } from 'lucide-react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MODELS = ['DistilBERT', 'SVM', 'LSTM'];

const SEVERITY_COLORS = {
  Normal: { bg: '#1a3c2e', text: '#2ecc71', border: 'rgba(46,204,113,0.25)' },
  Mild: { bg: '#3b2f10', text: '#f39c12', border: 'rgba(243,156,18,0.25)' },
  Moderate: { bg: '#3b2218', text: '#e67e22', border: 'rgba(230,126,34,0.25)' },
  High: { bg: '#3b1515', text: '#e74c3c', border: 'rgba(231,76,60,0.25)' },
  Severe: { bg: '#3b1515', text: '#e74c3c', border: 'rgba(231,76,60,0.25)' }
};

const Analyzer = () => {
  const [text, setText] = useState('');
  const [selectedModel, setSelectedModel] = useState('DistilBERT');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dismissBanner, setDismissBanner] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setDismissBanner(false);
    
    try {
      const response = await axios.post('http://localhost:8000/predict', {
        text,
        model: selectedModel.toLowerCase()
      });
      setResult(response.data);
      
      // Save to local storage for Dashboard
      const history = JSON.parse(localStorage.getItem('mindsense_history') || '[]');
      history.unshift({
        id: Date.now(),
        date: new Date().toISOString(),
        prediction: response.data.prediction,
        severity: response.data.severity,
        confidence: response.data.confidence
      });
      localStorage.setItem('mindsense_history', JSON.stringify(history.slice(0, 50)));
      
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to connect to ML backend. Ensure FastAPI is running.');
    } finally {
      setLoading(false);
    }
  };

  const showBanner = result && ['High', 'Severe'].includes(result.severity) && !dismissBanner;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10">
      
      {/* Input Section */}
      <motion.div className="glass-card flex flex-col overflow-hidden">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share how you're feeling..."
          className="w-full bg-transparent border-none resize-none outline-none text-lg p-8 min-h-[180px] text-text-primary placeholder:text-text-muted"
        />
        
        <div className="h-[1px] bg-white/5 w-full" />
        
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-surface/50">
          
          <div className="flex bg-[rgba(255,255,255,0.05)] p-1 rounded-2xl w-full sm:w-auto">
            {MODELS.map(model => (
              <button
                key={model}
                onClick={() => setSelectedModel(model)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedModel === model 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {model}
              </button>
            ))}
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={!text.trim() || loading}
            className="w-full sm:w-auto btn-gradient min-w-[140px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</>
            ) : 'Analyze'}
          </button>
        </div>
        
        {/* Loading Indicator dots */}
        {loading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
            <motion.div animate={{ scale: [1,1.5,1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 rounded-full bg-primary" />
            <motion.div animate={{ scale: [1,1.5,1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-3 h-3 rounded-full bg-secondary" />
            <motion.div animate={{ scale: [1,1.5,1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-3 h-3 rounded-full bg-primary" />
          </div>
        )}
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            className="glass-card p-6 sm:p-8"
          >
            <div className="flex items-start justify-between flex-wrap gap-6 mb-10">
              <div>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase border mb-4"
                  style={{
                    backgroundColor: SEVERITY_COLORS[result.severity]?.bg,
                    color: SEVERITY_COLORS[result.severity]?.text,
                    borderColor: SEVERITY_COLORS[result.severity]?.border
                  }}
                >
                  {result.prediction} — {result.severity}
                </motion.div>
                <div className="text-sm text-text-secondary mt-1">
                  Confidence Score: <span className="text-text-primary font-semibold">{Math.round(result.confidence * 100)}%</span>
                </div>
              </div>

              <div className="w-full sm:w-[200px]">
                <div className="flex text-xs justify-between mb-2 text-text-secondary">
                  <span>Confidence</span>
                  <span>{Math.round(result.confidence * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${result.confidence * 100}%` }} 
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* LIME Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b border-white/5 pb-2">Analysis Breakdown</h3>
                <p className="text-text-secondary mb-4 text-sm">Key words influencing the model's prediction:</p>
                <div className="bg-surface p-4 rounded-xl font-mono text-[15px] leading-relaxed border border-white/5 mb-8">
                  {text.split(' ').map((word, i) => {
                    const isTrigger = result.lime_explanation.some(w => word.toLowerCase().includes(w.toLowerCase()));
                    return (
                      <span key={i} className={isTrigger ? "bg-danger/20 text-danger px-1 rounded mx-[1px]" : "mx-[2px]"}>
                        {word}
                      </span>
                    );
                  })}
                </div>

                {/* AI Feedback & Solutions */}
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                  <h4 className="text-primary font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Empathetic Support
                  </h4>
                  <p className="text-text-primary text-lg mb-4 italic leading-relaxed">
                    "{result.feedback}"
                  </p>
                  <div className="space-y-2">
                    {result.recommendations?.map((tip, i) => (
                      <div key={i} className="flex gap-2 text-sm text-text-secondary">
                        <span className="text-primary">•</span>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Probabilities Chart */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b border-white/5 pb-2">Probabilities</h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={Object.entries(result.probabilities).map(([name, val]) => ({ name, value: Math.round(val * 100) })).sort((a,b)=>b.value - a.value)}
                      margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13 }} width={80} />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#1e2536', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                        {Object.entries(result.probabilities).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#7c6af7' : '#4ecdc4'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Severity Meter */}
            <div className="mt-10 pt-6 border-t border-white/5">
              <h3 className="text-sm font-semibold mb-4 text-center text-text-secondary uppercase tracking-widest">Severity Indicator</h3>
              <div className="flex gap-2 w-full max-w-2xl mx-auto">
                {Object.keys(SEVERITY_COLORS).map((level, i) => {
                  const isActive = result.severity === level;
                  const pastLevels = Object.keys(SEVERITY_COLORS).indexOf(result.severity) >= i;
                  return (
                    <div key={level} className="flex-1 flex flex-col items-center gap-2">
                      <div className={`h-2 w-full rounded-full transition-all ${pastLevels ? 'opacity-100' : 'opacity-20 bg-white/20'}`} 
                           style={{ backgroundColor: pastLevels ? SEVERITY_COLORS[level].text : undefined }} 
                      />
                      <span className={`text-[11px] uppercase tracking-wide font-bold ${isActive ? 'opacity-100' : 'opacity-40'}`} 
                            style={{ color: isActive ? SEVERITY_COLORS[level].text : '#94a3b8' }}>
                        {level}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Crisis Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed bottom-0 left-0 w-full z-50 bg-gradient-to-r from-[#3b1515] to-[#1a0a0a] border-t border-danger/20 shadow-[0_-10px_40px_rgba(231,76,60,0.15)]"
          >
            <div className="max-w-[1100px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center text-danger shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <p className="text-sm md:text-base font-medium text-white max-w-xl">
                  We care about you. If you're in distress, please reach out to professional help immediately.
                </p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <a href="tel:9152987821" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-danger hover:bg-red-600 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-colors">
                  <Phone className="w-4 h-4" /> iCall India: 9152987821
                </a>
                <button onClick={() => setDismissBanner(true)} className="text-white/50 hover:text-white p-2 shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analyzer;
