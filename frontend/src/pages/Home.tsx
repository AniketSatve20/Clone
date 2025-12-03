import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Lock,
  Sparkles,
  TrendingUp,
  Workflow,
  Wallet,
  Smartphone,
  Bitcoin,
  LogOut,
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate('/dashboard');
    return null;
  }

  const features = [
    {
      icon: Lock,
      title: 'Trustless & Secure',
      description: 'Smart contracts handle escrow. No middleman control. Full transparency on-chain.',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Disputes',
      description: 'Machine learning analyzes disputes fairly. Instant resolution without bias.',
    },
    {
      icon: Globe,
      title: 'Decentralized Storage',
      description: 'IPFS + Filecoin. Your files stored permanently. Censorship-resistant.',
    },
    {
      icon: Wallet,
      title: 'Multi-Chain Support',
      description: 'Ethereum, Polygon, Arbitrum & more. Choose your preferred blockchain.',
    },
    {
      icon: TrendingUp,
      title: 'Reputation Tokens',
      description: 'Build on-chain reputation. Portable across protocols. Transferable & tradeable.',
    },
    {
      icon: Zap,
      title: 'Zero Platform Fees',
      description: 'No middleman taking cuts. All earnings go directly to you.',
    },
  ];

  const stats = [
    { value: '$0', label: 'Platform Fees' },
    { value: '∞', label: 'Decentralized Storage' },
    { value: 'AI', label: 'Dispute Resolution' },
    { value: '15+', label: 'Blockchains' },
  ];

  return (
    <div className="min-h-screen bg-gradient-crypto overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl opacity-50 animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-blockchain-card/10 backdrop-blur-xl z-50 border-b border-blockchain-border">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-neon rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-neon bg-clip-text text-transparent">HumanWork</h1>
              <p className="text-xs text-gray-400">Decentralized Freelancing Protocol</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/auth')}
            className="relative z-10 bg-gradient-neon hover:shadow-neon-purple text-white font-semibold px-6 py-2 rounded-lg transition-all transform hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-neon-purple/10 border border-neon-purple/30 rounded-full px-4 py-2">
                  <Sparkles className="w-4 h-4 text-neon-purple" />
                  <span className="text-sm text-neon-purple font-semibold">Next-Gen Freelancing Protocol</span>
                </div>

                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-neon bg-clip-text text-transparent">Decentralized</span>
                  <br />
                  <span className="text-white">Freelancing</span>
                  <br />
                  <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green bg-clip-text text-transparent">Made Trustless</span>
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                  Connect with verified professionals globally. Build projects with AI-powered dispute resolution. Earn reputation on-chain. Zero platform fees. Your data, your control.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-neon hover:shadow-neon-purple text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 text-lg"
                >
                  Start Building <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-neon-cyan/30 hover:border-neon-cyan hover:bg-neon-cyan/5 text-white font-bold px-8 py-4 rounded-xl transition-all">
                  Explore Docs
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-blockchain-card/30 border border-blockchain-border rounded-lg p-4">
                    <p className="text-2xl font-bold bg-gradient-neon bg-clip-text text-transparent">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full h-[500px]">
                {/* Floating card 1 */}
                <div className="absolute top-0 right-0 w-80 bg-gradient-to-br from-blockchain-card to-blockchain-hover border border-blockchain-border rounded-2xl p-6 shadow-2xl animate-float transform hover:scale-105 transition-transform">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-6 h-6 text-neon-cyan" />
                    <h3 className="font-bold text-white">Trustless Escrow</h3>
                  </div>
                  <p className="text-sm text-gray-300">Smart contracts secure your funds until project completion.</p>
                </div>

                {/* Floating card 2 */}
                <div
                  className="absolute bottom-20 left-0 w-80 bg-gradient-to-br from-blockchain-card to-blockchain-hover border border-blockchain-border rounded-2xl p-6 shadow-2xl animate-float transform hover:scale-105 transition-transform"
                  style={{ animationDelay: '2s' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-6 h-6 text-neon-purple" />
                    <h3 className="font-bold text-white">AI Disputes</h3>
                  </div>
                  <p className="text-sm text-gray-300">Machine learning ensures fair resolution in seconds.</p>
                </div>

                {/* Floating card 3 */}
                <div
                  className="absolute top-1/2 right-10 w-80 bg-gradient-to-br from-blockchain-card to-blockchain-hover border border-blockchain-border rounded-2xl p-6 shadow-2xl animate-float transform hover:scale-105 transition-transform"
                  style={{ animationDelay: '4s' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6 text-neon-green" />
                    <h3 className="font-bold text-white">IPFS Storage</h3>
                  </div>
                  <p className="text-sm text-gray-300">Permanently store files on decentralized networks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why HumanWork?</h2>
            <p className="text-xl text-gray-400">Built for Web3. Built for everyone.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group bg-gradient-to-br from-blockchain-card to-blockchain-hover border border-blockchain-border rounded-2xl p-8 hover:border-neon-cyan/50 transition-all transform hover:scale-105 hover:shadow-2xl"
                >
                  <div className="w-12 h-12 bg-gradient-neon rounded-lg flex items-center justify-center mb-4 group-hover:shadow-neon-cyan transition-shadow">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-neon-purple/10 via-neon-cyan/10 to-neon-green/10 border border-blockchain-border rounded-3xl p-12 relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Earn On-Chain?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of freelancers and clients building the future of work on blockchain. Zero fees. Full control. Your reputation, permanently on-chain.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-gradient-neon hover:shadow-neon-purple text-white font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 text-lg inline-flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-blockchain-border mt-20 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">Protocol</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Docs</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Contracts</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Audit</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Forum</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blockchain-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-400">© 2025 HumanWork Protocol. Built with ❤️ for Web3.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">
                <Bitcoin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">
                <Shield className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
