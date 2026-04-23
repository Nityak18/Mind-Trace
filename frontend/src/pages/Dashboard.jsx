import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Clock } from 'lucide-react';

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

  // Prepare Chart Data
  const trendData = [...history].reverse().slice(-10).map((item, i) => ({
    name: `Entry ${i + 1}`,
    score: item.confidence * 100, 
  }));

  const conditionCounts = history.slice(0, 10).reduce((acc, curr) => {
    acc[curr.prediction] = (acc[curr.prediction] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(conditionCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="flex flex-col gap-8 pb-10 print:p-0 print:gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 print:text-black print:text-4xl">Insights & History</h1>
          <p className="text-text-secondary text-sm print:text-gray-600">Confidential Mental Health Pattern Summary — MindSense AI</p>
        </div>

        <div className="flex items-center gap-4 print:hidden">
          <button 
            onClick={() => window.print()}
            className="btn-ghost flex items-center gap-2 text-sm py-2"
          >
            <Activity className="w-4 h-4" /> Download Report
          </button>
          
          {/* Streak Counter */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Line Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-2 mb-6 text-text-secondary">
            <Activity className="w-5 h-5" />
            <h2 className="font-semibold text-text-primary text-lg">Confidence Trend</h2>
          </div>
          
          {history.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c6af7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7c6af7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
                  <YAxis stroke="#4a5568" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e2536', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#7c6af7" 
                    strokeWidth={3}
                    dot={{ fill: '#1e2536', stroke: '#7c6af7', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#4ecdc4', stroke: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No data for trend analysis yet." />
          )}
        </motion.div>

        {/* Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 flex flex-col items-center justify-center"
        >
          <h2 className="font-semibold text-lg mb-6 self-start w-full text-left">Condition Distribution</h2>
          {history.length > 0 ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94a3b8'} stroke="rgba(255,255,255,0.05)" />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e2536', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[entry.name] || '#94a3b8' }} />
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center w-full">
              <EmptyState message="No distributions to show." />
            </div>
          )}
        </motion.div>
      </div>

      {/* History Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
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
