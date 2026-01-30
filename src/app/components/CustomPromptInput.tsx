import { motion } from 'motion/react';
import { Wand2, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useState } from 'react';

interface CustomPromptInputProps {
  onSubmit: (prompt: string) => void;
}

export function CustomPromptInput({ onSubmit }: CustomPromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  const examplePrompts = [
    "Create a project management solution for remote teams",
    "Build a customer feedback tracking system",
    "Design a product launch workflow with automated tasks",
    "Set up an employee onboarding process with AI assistance"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto px-6"
    >
      {/* Main Input Area */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <div
          className="relative rounded-2xl border-2 backdrop-blur-xl overflow-hidden transition-all duration-300"
          style={{
            background: isFocused 
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(59, 130, 246, 0.12))'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(59, 130, 246, 0.08))',
            borderColor: isFocused 
              ? 'rgba(99, 102, 241, 0.6)' 
              : 'rgba(99, 102, 241, 0.35)',
            boxShadow: isFocused 
              ? '0 12px 40px rgba(99, 102, 241, 0.35), 0 0 0 1px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
              : '0 8px 32px rgba(99, 102, 241, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Animated border glow on focus */}
          {isFocused && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['-200% 0', '200% 0'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>
          )}

          <div className="relative flex items-start gap-4 p-6">
            {/* Icon */}
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mt-1"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(59, 130, 246, 0.15))',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <Zap className="w-6 h-6" style={{ color: 'rgba(99, 102, 241, 1)' }} />
            </div>

            {/* Text Area */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Example: I need a solution to manage my marketing campaigns with automated reporting and AI-powered insights..."
              rows={4}
              className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none resize-none"
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-normal)',
                lineHeight: '1.6',
              }}
            />

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!prompt.trim()}
              whileHover={prompt.trim() ? { scale: 1.05 } : {}}
              whileTap={prompt.trim() ? { scale: 0.95 } : {}}
              className="flex-shrink-0 px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed mt-1"
              style={{
                background: prompt.trim() 
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(59, 130, 246, 0.9))'
                  : 'rgba(99, 102, 241, 0.2)',
                boxShadow: prompt.trim() 
                  ? '0 4px 20px rgba(99, 102, 241, 0.4)' 
                  : 'none',
                fontWeight: 'var(--font-weight-semibold)',
                fontSize: 'var(--text-sm)',
              }}
            >
              <span className="text-white">Generate</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Character count */}
        <div className="flex justify-end mt-2 px-2">
          <span
            className="text-white/40"
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-normal)',
            }}
          >
            {prompt.length} characters
          </span>
        </div>
      </motion.form>

      {/* Example Prompts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <p
          className="text-white/50 mb-4"
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
          }}
        >
          Or try one of these examples:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examplePrompts.map((example, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPrompt(example)}
              className="text-left p-4 rounded-xl border transition-all duration-300 group"
              style={{
                background: 'rgba(99, 102, 241, 0.05)',
                borderColor: 'rgba(99, 102, 241, 0.15)',
              }}
            >
              <div className="flex items-start gap-3">
                <Sparkles 
                  className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity" 
                  style={{ color: 'rgba(99, 102, 241, 1)' }} 
                />
                <span
                  className="text-white/70 group-hover:text-white/90 transition-colors"
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                    lineHeight: '1.5',
                  }}
                >
                  {example}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-3 gap-6 mt-12"
      >
        {[
          {
            icon: <Wand2 className="w-5 h-5" />,
            title: 'AI-Powered',
            description: 'Intelligent workflow generation'
          },
          {
            icon: <Zap className="w-5 h-5" />,
            title: 'Instant Setup',
            description: 'Ready in seconds'
          },
          {
            icon: <Sparkles className="w-5 h-5" />,
            title: 'Fully Customizable',
            description: 'Tailored to your needs'
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            className="text-center p-6 rounded-xl border"
            style={{
              background: 'rgba(99, 102, 241, 0.03)',
              borderColor: 'rgba(99, 102, 241, 0.1)',
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(59, 130, 246, 0.1))',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                color: 'rgba(99, 102, 241, 1)',
              }}
            >
              {feature.icon}
            </div>
            <h4
              className="text-white mb-1"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              {feature.title}
            </h4>
            <p
              className="text-white/50"
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-normal)',
              }}
            >
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}