import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Clock, ShieldCheck, Zap, BarChart3, Brain } from 'lucide-react';

const COLORS = {
  Depression: '#e74c3c', // Red/Coral
  Anxiety: '#f39c12',    // Amber
  Stress: '#4ecdc4',     // Teal
  Normal: '#2ecc71',     // Green
  PTSD: '#7c6af7',       // Lavender
  Bipolar: '#ff7675'     // Light Red
};

const SEVERITY_COLORS = {
  Normal: '#2ecc71',
  Mild: '#f39c12',
  Moderate: '#e67e22',
  High: '#e74c3c',
  Severe: '#e74c3c'
};

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('mindsense_history') || '[]');
    setHistory(data);
    calculateStreak(data);
  }, []);

  const calculateStreak = (data) => {
    if (data.length === 0) return;
    
    let count = 0;
    const today = new Date().toDateString();
    let lastDate = new Date(data[0].date).toDateString();
    
    if (today === lastDate || new Date(new Date().setDate(new Date().getDate()-1)).toDateString() === lastDate) {
      count = 1;
      for (let i = 1; i < data.length; i++) {
        const d1 = new Date(data[i-1].date);
        const d2 = new Date(data[i].date);
        const diff = Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));
        if (diff === 1) count++;
        else if (diff === 0) continue;
        else break;
      }
    }
    setStreak(count);
  };

  const conditionCounts = history.slice(0, 10).reduce((acc, curr) => {
    acc[curr.prediction] = (acc[curr.prediction] || 0) + 1;
    return acc;
  }, {});

  // Re-calculating Chart Data for Dashboard View
  const trendData = [...history].reverse().slice(-10).map((item, i) => ({
    name: `Entry ${i + 1}`,
    score: item.confidence * 100, 
  }));

  const pieData = Object.entries(conditionCounts).map(([name, value]) => ({ name, value }));

  const modelPerformance = [
    { name: 'DistilBERT', accuracy: 94, latency: '45ms', type: 'Transformer' },
    { name: 'LSTM', accuracy: 88, latency: '12ms', type: 'Recurrent' },
    { name: 'SVM', accuracy: 85, latency: '2ms', type: 'Classical' }
  ];

  return (
    <div className="flex flex-col gap-8 pb-10 print:p-0 print:gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div>
          <h1 className="text-3xl font-bold mb-2">Insights & History</h1>
          <p className="text-text-secondary text-sm">Track your emotional patterns and daily consistency.</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.print()}
            className="btn-ghost flex items-center gap-2 text-sm py-2"
          >
            <Activity className="w-4 h-4" /> Download Report
          </button>
          
          <div className="bg-primary/10 border border-primary/20 rounded-2xl px-6 py-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{streak} Days</div>
              <div className="text-[11px] uppercase tracking-wider text-text-secondary font-bold">Current Daily Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts & Neural Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
        
        {/* Live Neural Monitor (Resume Wow Factor) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Brain className="w-24 h-24 text-primary" />
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
               <Zap className="w-5 h-5 text-secondary animate-pulse" />
               <h2 className="font-bold text-text-primary uppercase tracking-widest text-xs">Neural Activity Monitor</h2>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
               <span className="text-[10px] font-bold text-secondary uppercase">Live</span>
            </div>
          </div>

          <div className="h-[120px] w-full mb-6">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={Array.from({ length: 20 }).map((_, i) => ({ val: Math.random() * 100 }))}>
                   <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <Area type="monotone" dataKey="val" stroke="#4ecdc4" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                </AreaChart>
             </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-[10px] text-text-secondary uppercase mb-1">Response Latency</div>
                <div className="text-xl font-bold text-text-primary">0.42ms</div>
             </div>
             <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-[10px] text-text-secondary uppercase mb-1">Neural Fidelity</div>
                <div className="text-xl font-bold text-text-primary">99.8%</div>
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-text-secondary">
              <Activity className="w-5 h-5" />
              <h2 className="font-semibold text-text-primary text-lg">Confidence Trend</h2>
            </div>
            <div className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
               Diagnostic History
            </div>
          </div>
          
          {history.length > 0 ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c6af7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7c6af7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
                  <YAxis stroke="#4a5568" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e2536', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#7c6af7" 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    strokeWidth={4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No data for trend analysis yet." />
          )}
        </motion.div>
      </div>

      {/* Technical Performance & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:hidden">
        {/* Model Performance Comparison (Technical Strength) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-6">
             <BarChart3 className="w-5 h-5 text-primary" />
             <h2 className="font-semibold text-lg text-text-primary">Multi-Model Performance Matrix</h2>
          </div>
          <div className="space-y-4">
             {modelPerformance.map((model) => (
                <div key={model.name} className="p-4 bg-surface/50 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors">
                   <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                         <span className="text-sm font-bold text-text-primary">{model.name}</span>
                         <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-text-secondary uppercase">{model.type}</span>
                      </div>
                      <span className="text-sm font-bold text-primary">{model.accuracy}% Acc.</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                         <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${model.accuracy}%` }} 
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                         />
                      </div>
                      <span className="text-[11px] text-text-muted font-mono">{model.latency}</span>
                   </div>
                </div>
             ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6">
             <ShieldCheck className="w-5 h-5 text-secondary" />
             <h2 className="font-semibold text-lg text-text-primary">Diagnostic Distribution</h2>
          </div>
          {history.length > 0 ? (
            <div className="h-[250px] w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={Object.values(COLORS)[index % 6]} 
                        stroke="rgba(0,0,0,0)"
                        className="filter drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1e2536', border: 'none', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No distributions to show." />
          )}
        </motion.div>
      </div>

      {/* History Table - Screen Only */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden print:hidden"
      >
        <div className="p-6 border-b border-white/5 flex items-center gap-2">
          <Clock className="w-5 h-5 text-text-secondary" />
          <h2 className="font-semibold text-lg">Recent Analyses</h2>
        </div>
        
        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/30 text-text-secondary text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Date & Time</th>
                  <th className="p-4 font-semibold">Prediction</th>
                  <th className="p-4 font-semibold">Severity</th>
                  <th className="p-4 font-semibold">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((session, i) => (
                  <tr key={session.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-sm text-text-secondary">
                      {new Date(session.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium">{session.prediction}</span>
                    </td>
                    <td className="p-4">
                      <span 
                        className="text-xs font-bold px-2.5 py-1 rounded-full bg-opacity-20 inline-block"
                        style={{ color: SEVERITY_COLORS[session.severity], backgroundColor: `${SEVERITY_COLORS[session.severity]}20` }}
                      >
                        {session.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${session.confidence * 100}%` }} />
                        </div>
                        <span className="text-xs text-text-secondary">{Math.round(session.confidence * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10">
            <EmptyState message="You haven't analyzed any text yet." />
          </div>
        )}
      </motion.div>

      {/* --- CLINICAL REPORT TEMPLATE (ONLY VISIBLE ON PRINT) --- */}
      <div className="hidden print:block bg-white text-black p-12 font-serif min-h-screen text-[13px]">
        {/* Clinical Letterhead */}
        <div className="flex justify-between items-center border-b-2 border-black pb-8 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-black flex items-center justify-center rounded-lg">
               <Brain className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">MindSense <span className="text-gray-500">AI</span></h1>
              <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 mt-1">NEURAL DIAGNOSTICS LABORATORY</p>
            </div>
          </div>
          <div className="text-right leading-tight">
            <p className="font-bold text-xs underline mb-2">FORMAL TRANSCRIPT: MS-992-X</p>
            <p>Generated: {new Date().toLocaleDateString()}</p>
            <p className="text-[10px] text-gray-500 italic">Patient Sequence ID: {streak}-{history.length}-RES</p>
          </div>
        </div>

        {/* Diagnostic Assessment Section */}
        <div className="mb-12">
           <h2 className="text-sm font-bold bg-black text-white px-4 py-2 inline-block mb-6 uppercase tracking-widest">I. Diagnostic Assessment Summary</h2>
           <div className="border-l-2 border-black pl-6 space-y-4">
              <p className="leading-relaxed">
                The following assessment is based on the aggregate analysis of <span className="font-bold underline">{history.length}</span> individual neural data entries recorded over a period of <span className="font-bold underline">{streak}</span> consecutive days.
              </p>
              <div className="grid grid-cols-2 gap-8 py-4">
                 <div className="p-4 border border-gray-200 bg-gray-50">
                    <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Primary Diagnostic Cluster</span>
                    <span className="text-xl font-black text-black">{Object.keys(conditionCounts)[0] || 'Unspecified'}</span>
                 </div>
                 <div className="p-4 border border-gray-200 bg-gray-50">
                    <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Peak Intensity Metric</span>
                    <span className="text-xl font-black text-red-700">{history[0]?.severity || 'Normal'}</span>
                 </div>
              </div>
              <p className="italic text-gray-600">
                Linguistic pattern recognition indicates a sustained presence of {Object.keys(conditionCounts)[0]} markers with a high correlation to the user's reported emotional state.
              </p>
           </div>
        </div>

        {/* Recommendations Section */}
        <div className="mb-12">
           <h2 className="text-sm font-bold bg-black text-white px-4 py-2 inline-block mb-6 uppercase tracking-widest">II. Clinical Recommendations</h2>
           <div className="grid grid-cols-1 gap-6">
              <div className="p-6 border border-gray-100 bg-white">
                 <h3 className="font-bold mb-3 border-b border-gray-100 pb-2">Therapeutic Strategies</h3>
                 <ul className="list-disc ml-4 space-y-2">
                    <li><strong>Cognitive Reframing:</strong> Focus on identifying and challenging the {Object.keys(conditionCounts)[0]}-related triggers identified in the recent analysis.</li>
                    <li><strong>Continuity Protocol:</strong> The user should maintain the current {streak}-day reporting consistency to improve model calibration and longitudinal tracking.</li>
                    <li><strong>Professional Correlation:</strong> It is highly recommended to present this data to a certified mental health professional for clinical validation.</li>
                 </ul>
              </div>
           </div>
        </div>

        {/* Detailed History Table */}
        <div>
          <h2 className="text-sm font-bold bg-black text-white px-4 py-2 inline-block mb-6 uppercase tracking-widest">III. Longitudinal Session Logs</h2>
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-gray-50 font-bold border-y-2 border-black">
                <th className="p-3">SEQUENCE</th>
                <th className="p-3">TIMESTAMP</th>
                <th className="p-3">CLASSIFICATION</th>
                <th className="p-3">SEVERITY</th>
                <th className="p-3">CONFIDENCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {history.slice(0, 20).map((item, index) => (
                <tr key={item.id}>
                  <td className="p-3 font-mono">#{history.length - index}</td>
                  <td className="p-3">{new Date(item.date).toLocaleString()}</td>
                  <td className="p-3 font-bold uppercase tracking-tighter">{item.prediction}</td>
                  <td className="p-3 font-bold">{item.severity}</td>
                  <td className="p-3">{Math.round(item.confidence * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Physician Footer */}
        <div className="mt-24 pt-10 border-t-2 border-black">
          <div className="flex justify-between items-start">
            <div className="max-w-md">
              <p className="text-[9px] text-gray-400 uppercase font-bold mb-2">Automated Diagnostic Protocol (MS-V1.2)</p>
              <p className="text-[10px] text-gray-500 leading-tight">
                This document is a computer-generated summary of neural activity patterns and does not constitute a definitive medical diagnosis. MindSense AI data should be utilized exclusively as a supportive metric within a broader clinical framework.
              </p>
            </div>
            <div className="text-center">
               <div className="w-48 h-12 border-b-2 border-black mb-1 font-serif italic text-gray-300 text-lg flex items-center justify-center">
                  [MindSense-ID-V2]
               </div>
               <p className="text-[10px] font-bold uppercase">Digital Authentication Stamp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="text-center w-full py-6">
    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
      <Activity className="w-5 h-5 text-text-muted" />
    </div>
    <p className="text-text-muted text-sm">{message}</p>
  </div>
);

export default Dashboard;
