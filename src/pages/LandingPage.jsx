import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, TrendingUp, MessageSquare, Shield,
  ChevronRight, Star, Zap, BarChart3, ArrowRight
} from 'lucide-react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const features = [
  {
    icon: Brain,
    title: 'AI Business Analysis',
    description: 'Get deep insights into your hardware business powered by Groq Llama 3.3 — the fastest AI model available.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    icon: TrendingUp,
    title: 'Revenue Forecasting',
    description: 'Understand your monthly revenue potential with data-driven estimates tailored to Lagos market conditions.',
    color: 'text-brand-400',
    bg: 'bg-brand-500/10 border-brand-500/20',
  },
  {
    icon: MessageSquare,
    title: 'SMS Alerts',
    description: 'Receive your top business recommendation directly on your phone via SMS — even without internet.',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
  },
  {
    icon: BarChart3,
    title: 'Actionable Insights',
    description: 'Get specific strengths, weaknesses, and market opportunities — not generic advice.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Analysis generated in under 5 seconds. No waiting, no delays — just fast, accurate business intelligence.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your business data is encrypted and never shared. Built with enterprise-grade security from day one.',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
  },
];

const testimonials = [
  {
    name: 'Adewale Okafor',
    role: 'Hardware Merchant, Ikeja',
    avatar: 'A',
    text: 'HardwareAI helped me identify I was underpricing my PVC pipes by 15%. That single insight increased my monthly revenue by ₦180,000.',
    rating: 5,
  },
  {
    name: 'Chioma Nwosu',
    role: 'Building Materials, Surulere',
    avatar: 'C',
    text: 'The SMS alerts are a game changer. I get my top recommendation on my phone every week without even opening the app.',
    rating: 5,
  },
  {
    name: 'Emeka Eze',
    role: 'Electrical Supplies, Apapa',
    avatar: 'E',
    text: 'Finally an AI tool built for Nigerian merchants. The recommendations actually make sense for our market.',
    rating: 5,
  },
];

const stats = [
  { value: '500+', label: 'Active Merchants'    },
  { value: '₦2B+', label: 'Revenue Analyzed'   },
  { value: '98%',  label: 'Satisfaction Rate'  },
  { value: '< 5s', label: 'Analysis Speed'     },
];

const plans = [
  {
    name: 'Basic',
    price: '₦2,000',
    period: '/month',
    features: ['AI Business Analysis', 'Business Profile', 'Analysis History', 'Email Support'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '₦5,000',
    period: '/month',
    features: ['Everything in Basic', 'SMS Alerts', 'Priority AI Analysis', 'Advanced Insights', 'Priority Support'],
    cta: 'Get Premium',
    highlight: true,
  },
];

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 
      backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center 
            justify-center shadow-lg shadow-brand-500/30">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
              <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
            </svg>
          </div>
          <span className="font-bold text-white text-lg">HardwareAI</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Pricing', 'Testimonials'].map((label) => (
            <a key={label} href={`#${label.toLowerCase()}`}
              className="text-sm text-gray-400 hover:text-white transition">
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login"
            className="text-sm text-gray-300 hover:text-white font-medium transition">
            Sign In
          </Link>
          <Link to="/register"
            className="bg-brand-500 hover:bg-brand-600 text-white text-sm 
              font-semibold px-4 py-2 rounded-xl transition shadow-lg 
              shadow-brand-500/30">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center 
        overflow-hidden px-6 pt-16">
        {/* Background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
          bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96
          bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative max-w-4xl mx-auto text-center"
        >
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 bg-brand-500/15 
              text-brand-400 text-xs font-semibold px-4 py-2 rounded-full 
              border border-brand-500/25 mb-6">
              <Zap className="w-3 h-3" />
              Powered by Groq Llama 3.3 70B
            </span>
          </motion.div>

          <motion.h1 variants={item}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            AI Business Intelligence<br />
            <span className="text-brand-400">for Lagos Merchants</span>
          </motion.h1>

          <motion.p variants={item}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Get personalized AI analysis, revenue forecasts, and actionable 
            recommendations for your hardware store — in under 5 seconds.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row 
            items-center justify-center gap-4">
            <Link to="/register"
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 
                text-white font-semibold px-8 py-4 rounded-xl transition-all 
                shadow-xl shadow-brand-500/30 text-base w-full sm:w-auto 
                justify-center">
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 
                border border-white/10 text-white font-semibold px-8 py-4 
                rounded-xl transition-all text-base w-full sm:w-auto justify-center">
              Sign In
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div variants={item}
            className="mt-12 flex items-center justify-center gap-6 flex-wrap">
            <div className="flex -space-x-2">
              {['A', 'C', 'E', 'B', 'D'].map((l, i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-brand-500 
                  border-2 border-gray-950 flex items-center justify-center 
                  text-white text-xs font-bold">
                  {l}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-0.5">Trusted by 500+ Lagos merchants</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-4xl font-bold text-white mb-1">{value}</p>
                <p className="text-gray-400 text-sm">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-brand-400 text-sm font-semibold uppercase 
              tracking-widest">Features</span>
            <h2 className="text-4xl font-bold text-white mt-3 mb-4">
              Everything you need to grow
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Built specifically for hardware merchants in Lagos with deep 
              understanding of the local market.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, color, bg }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/3 border border-white/8 rounded-2xl p-6 
                  hover:border-white/20 hover:bg-white/5 transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-xl border flex items-center 
                  justify-center mb-4 ${bg}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 px-6 bg-white/2">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-brand-400 text-sm font-semibold uppercase 
              tracking-widest">Testimonials</span>
            <h2 className="text-4xl font-bold text-white mt-3 mb-4">
              Merchants love HardwareAI
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Real results from real Lagos hardware merchants.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, avatar, text, rating }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/4 border border-white/8 rounded-2xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                  "{text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-500 rounded-full flex 
                    items-center justify-center font-bold text-white">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{name}</p>
                    <p className="text-gray-400 text-xs">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-brand-400 text-sm font-semibold uppercase 
              tracking-widest">Pricing</span>
            <h2 className="text-4xl font-bold text-white mt-3 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              No hidden fees. Cancel anytime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map(({ name, price, period, features, cta, highlight }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-8 border flex flex-col
                  ${highlight
                    ? 'bg-brand-500/10 border-brand-500/50'
                    : 'bg-white/4 border-white/10'}`}
              >
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-500 text-white text-xs font-bold 
                      px-4 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">{name}</h3>
                  <div className="flex items-end gap-1 mt-2">
                    <span className="text-4xl font-bold text-white">{price}</span>
                    <span className="text-gray-400 mb-1">{period}</span>
                  </div>
                </div>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="text-green-400 font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register"
                  className={`w-full py-3 rounded-xl font-semibold text-sm 
                    text-center transition
                    ${highlight
                      ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                      : 'bg-white/10 hover:bg-white/20 text-white'}`}
                >
                  {cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-brand-500/20 to-brand-600/10 
              border border-brand-500/30 rounded-3xl p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 
                bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            </div>
            <div className="relative">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to grow your business?
              </h2>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                Join 500+ Lagos hardware merchants already using AI to make 
                smarter decisions every day.
              </p>
              <Link to="/register"
                className="inline-flex items-center gap-2 bg-brand-500 
                  hover:bg-brand-600 text-white font-semibold px-8 py-4 
                  rounded-xl transition-all shadow-xl shadow-brand-500/30 text-base">
                Start Free Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between 
          flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center 
              justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
              </svg>
            </div>
            <span className="text-white font-bold">HardwareAI</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 HardwareAI. Built for Lagos merchants.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-gray-400 hover:text-white text-sm transition">
              Sign In
            </Link>
            <Link to="/register" className="text-gray-400 hover:text-white text-sm transition">
              Get Started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}