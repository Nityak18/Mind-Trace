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
