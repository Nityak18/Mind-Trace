import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, ShieldAlert, Loader2, Mic, Sparkles, Music, Pause, Waves, Brain, Activity } from 'lucide-react';
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
  const [analyzedText, setAnalyzedText] = useState('');
  const [dismissBanner, setDismissBanner] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isZenPlaying, setIsZenPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const toggleZen = () => {
    if (!audioRef.current) return;
    
    if (isZenPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.load(); // Force reload the source
      audioRef.current.loop = true;
      audioRef.current.volume = 1.0;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsZenPlaying(!isZenPlaying);
  };

  const PROMPTS = [
    "Write about one thing that went better than expected today.",
    "What is something you're looking forward to this week?",
    "Describe a moment today when you felt truly at peace.",
    "If you could talk to your future self, what would you say?",
    "What is a challenge you overcame recently, no matter how small?",
    "List three things you are grateful for right now.",
    "How does your body feel in this exact moment?"
  ];

  const getRandomPrompt = () => {
    const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setText(randomPrompt);
  };

  // Speech Recognition Setup
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setText(transcript);
    };

    recognition.start();
  };

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
      setAnalyzedText(text);
      
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
    <div className={`max-w-4xl mx-auto flex flex-col gap-10 ${showBanner ? 'pb-32' : 'pb-10'}`}>
      <audio 
        ref={audioRef} 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" 
        preload="auto"
      />
      
      <div className="glass-card flex flex-col overflow-hidden relative">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share how you're feeling..."
            className="w-full bg-transparent border-none resize-none outline-none text-lg p-8 pb-16 min-h-[220px] text-text-primary placeholder:text-text-muted"
          />
          
          {/* Voice to Text Button - Improved Positioning */}
          <div className="absolute bottom-6 right-6 flex items-center gap-3 bg-surface/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 shadow-xl">
            <button 
              onClick={getRandomPrompt}
              className="px-4 py-2 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary/20 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
              title="Give me a journaling prompt"
            >
              <Sparkles className="w-3 h-3" /> Try a prompt
            </button>
            <button 
              onClick={toggleZen}
              className={`p-2.5 rounded-xl transition-all duration-300 ${isZenPlaying ? 'bg-secondary text-surface shadow-[0_0_15px_rgba(78,205,196,0.4)]' : 'bg-secondary/10 text-secondary hover:bg-secondary/20'}`}
              title={isZenPlaying ? "Stop Zen Mode" : "Start Zen Mode"}
            >
              {isZenPlaying ? <Pause className="w-4 h-4" /> : <Music className="w-4 h-4" />}
            </button>
            <div className="w-[1px] h-4 bg-white/10" />
            <button 
              onClick={toggleListening}
              className={`p-2.5 rounded-xl transition-all duration-300 ${isListening ? 'bg-danger text-white animate-pulse' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
              title={isListening ? "Stop Listening" : "Speak your mind"}
            >
              {isListening ? <X className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
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
      </div>

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
                  {result?.prediction || 'General Pattern'} — {result?.severity || 'Normal'}
                </motion.div>
                <div className="text-sm text-text-secondary mt-1">
                  Confidence Score: <span className="text-text-primary font-semibold">{Math.round(result.confidence * 100)}%</span>
                </div>
              </div>

              <div className="w-full sm:w-[240px] bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex text-[10px] uppercase font-black tracking-widest justify-between mb-3 text-text-secondary">
                  <span>Probability Metric</span>
                  <span className="text-primary">{Math.round((result?.confidence || 0) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${(result?.confidence || 0) * 100}%` }} 
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Advanced Neural Mapping (Explainability) */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm">
                    🧠
                  </div>
                  Neural Language Mapping
                </h3>
                
                <div className="relative group p-8 rounded-3xl bg-surface/30 border border-white/5 overflow-hidden min-h-[160px]">
                  {/* Neural Scan Line Animation */}
                  <motion.div 
                    initial={{ top: -100 }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent z-0 pointer-events-none shadow-[0_0_20px_rgba(124,106,247,0.5)]"
                  />
                  
                  <div className="relative z-10 flex flex-wrap gap-x-2 gap-y-3 leading-relaxed text-lg">
                    {analyzedText.split(' ').map((word, i) => {
                      const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
                      // Robust null check for lime_explanation
                      const explanation = result?.lime_explanation?.find(w => 
                        typeof w === 'string' && cleanWord.includes(w.toLowerCase())
                      );
                      const isTrigger = !!explanation;
                      
                      return (
                        <motion.span 
                          key={i}
                          initial={{ opacity: 0, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, filter: 'blur(0px)' }}
                          transition={{ delay: i * 0.02 }}
                          className={`px-2 py-0.5 rounded-lg transition-all cursor-default relative group/word ${
                            isTrigger 
                            ? "bg-danger/10 text-danger font-bold border border-danger/20 shadow-[0_0_10px_rgba(231,76,60,0.1)]" 
                            : "text-text-secondary"
                          }`}
                        >
                          {word}
                          {isTrigger && (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-elevated border border-white/10 text-[10px] py-1 px-2 rounded opacity-0 group-hover/word:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl pointer-events-none uppercase tracking-tighter">
                              Model Trigger: High Impact
                            </span>
                          )}
                          {isTrigger && (
                            <motion.span 
                              animate={{ opacity: [0.1, 0.3, 0.1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 bg-danger/20 blur-md rounded-lg -z-10"
                            />
                          )}
                        </motion.span>
                      );
                    })}
                  </div>
                </div>
                <p className="mt-4 text-[11px] text-text-muted uppercase tracking-[0.2em] font-bold">
                  * Highlighted areas represent linguistic patterns with the highest diagnostic influence
                </p>
              </div>

              {/* AI Feedback & Solutions */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b border-white/5 pb-2">Cognitive Insight</h3>
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-primary font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Empathetic Support
                      </h4>
                    </div>
                    <p className="text-text-primary text-lg mb-4 italic leading-relaxed">
                      "{result?.feedback || 'Analysis complete. Review your insights below.'}"
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
                  {isZenPlaying && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.1 }}
                      className="absolute inset-0 z-0 bg-secondary pointer-events-none"
                    />
                  )}
                </div>
              </div>

              {/* Probabilities Matrix */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b border-white/5 pb-2 text-primary uppercase tracking-widest text-xs">Probabilistic Matrix</h3>
                <div className="bg-surface/50 p-6 rounded-3xl border border-white/5">
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={Object.entries(result?.probabilities || {}).map(([name, val]) => ({ 
                          name, 
                          value: Math.round((val as number || 0) * 100),
                          full: 100
                        })).sort((a,b)=>b.value - a.value)}
                        margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
                      >
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#edf2f7', fontSize: 11, fontWeight: 700 }} 
                          width={100} 
                        />
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                          contentStyle={{ backgroundColor: '#161b27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                        />
                        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={12}>
                          {Object.entries(result?.probabilities || {}).map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index === 0 ? '#7c6af7' : 'rgba(124,106,247,0.3)'} 
                              className="filter drop-shadow-[0_0_8px_rgba(124,106,247,0.5)]"
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-between items-center mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted uppercase tracking-widest">Model Fidelity</span>
                        <span className="text-sm font-bold text-text-primary">High Accuracy Mode</span>
                     </div>
                     <span className="text-lg animate-pulse">⚡</span>
                  </div>
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
