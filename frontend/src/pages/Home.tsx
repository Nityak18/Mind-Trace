import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, ShieldCheck, BarChart2, CheckCircle2 } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col gap-32 pb-20">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center text-center mt-10 md:mt-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-primary/10 border border-primary/20 text-primary uppercase text-[12px] font-bold tracking-[0.04em] py-1.5 px-4 rounded-full mb-8 inline-block"
        >
          AI-Powered Mental Health Insights
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-[56px] leading-[1.1] font-bold tracking-tight mb-6 max-w-4xl"
        >
          Understand Your Emotional State with <span className="text-gradient">MindSense</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-text-secondary max-w-[520px] mx-auto mb-10 leading-relaxed"
        >
          Detect patterns of depression, anxiety, stress, and more from your daily inputs using state-of-the-art NLP models within seconds.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Link to="/analyzer" className="btn-primary w-full sm:w-auto h-[52px] flex items-center justify-center">
            Analyze Your Text
          </Link>
          <Link to="/about" className="btn-ghost w-full sm:w-auto h-[52px] flex items-center justify-center">
            Learn How It Works
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6 md:gap-10"
        >
          {[
            "3 ML Models", "Instant Analysis", "100% Private"
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-text-secondary font-medium">
              <CheckCircle2 className="w-4 h-4 text-secondary" />
              {feature}
            </div>
          ))}
        </motion.div>
      </section>

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
