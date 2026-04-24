import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, ShieldCheck, BarChart2, CheckCircle2 } from 'lucide-react';
import { BrainHero } from '../components/ui/BrainHero';

const Home = () => {
  return (
    <div className="flex flex-col gap-32 pb-20">
      {/* Hero Section */}
      <BrainHero />

      {/* Features Section */}
      <section>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Core Capabilities</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">MindSense combines classical machine learning and advanced deep learning to give you precise, multi-dimensional emotional insights.</p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {}
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <FeatureCard 
            icon={<Brain className="w-6 h-6 text-primary" />}
            title="Transformer NLP"
            description="Powered by a fine-tuned DistilBERT model. Highly accurate contextual understanding of language nuances."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-primary" />}
            title="Utmost Privacy"
            description="Your text is analyzed entirely statelessly. No permanent records of your inputs are ever stored on our servers."
          />
          <FeatureCard 
            icon={<BarChart2 className="w-6 h-6 text-primary" />}
            title="Rich Analytics"
            description="Visual dashboards with probabilities, historical tracking, and AI explanations highlighting critical trigger words."
          />
        </motion.div>
      </section>

      {/* Tech Stack Section (Resume Oriented) */}
      <section className="bg-surface/30 border border-white/5 rounded-[40px] p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Brain className="w-64 h-64 text-primary" />
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
           <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">The Diagnostic Stack</h2>
              <p className="text-text-secondary leading-relaxed mb-8">
                 Built with production-grade technologies to ensure scalability, precision, and privacy-first clinical analysis.
              </p>
              <div className="grid grid-cols-2 gap-4">
                 {[
                    { name: 'React 19 / TS', desc: 'Type-safe UI' },
                    { name: 'FastAPI', desc: 'High-perf API' },
                    { name: 'Framer Motion', desc: 'Immersive UX' },
                    { name: 'Recharts', desc: 'Data Vis' }
                 ].map(tech => (
                    <div key={tech.name} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                       <div className="text-sm font-bold text-text-primary">{tech.name}</div>
                       <div className="text-[10px] text-text-muted uppercase tracking-widest">{tech.desc}</div>
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="flex-1 flex justify-center">
              <div className="relative group">
                 <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/30 transition-all" />
                 <div className="relative z-10 glass-card p-8 flex flex-col items-center gap-4 text-center max-w-[280px]">
                    <ShieldCheck className="w-12 h-12 text-secondary" />
                    <h3 className="font-bold">Production Ready</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                       Architected for hospital environments with stateless processing and multi-model ensemble verification.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 15 } }
    }}
    className="glass-card p-8"
  >
    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-[22px] font-semibold mb-3">{title}</h3>
    <p className="text-text-secondary leading-relaxed">{description}</p>
  </motion.div>
);

export default Home;
