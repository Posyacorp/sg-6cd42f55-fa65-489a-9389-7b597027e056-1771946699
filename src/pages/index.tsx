import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Coins, Users, TrendingUp, Shield, Gift, Wallet } from "lucide-react";

export default function Home() {
  return (
    <>
      <SEO 
        title="Pukaarly - Social Earnings Platform"
        description="Connect, earn, and grow with Pukaarly's innovative reward ecosystem"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-900">
        {/* Header */}
        <header className="border-b border-purple-200/50 dark:border-purple-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Pukaarly
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                How It Works
              </Link>
              <Link href="#roles" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Roles
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Earn Rewards
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Every Time You Engage
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join Pukaarly's revolutionary platform where every interaction creates value. Connect with anchors, earn tokens, and grow your wealth.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8">
                  Start Earning Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-purple-600">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-pink-600">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Anchors</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">$2M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Distributed</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white dark:bg-gray-900 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Choose <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Pukaarly</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                A complete ecosystem designed for creators and users alike
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Coins className="w-8 h-8" />}
                title="Earn Tokens"
                description="Get rewarded with tokens for every interaction. 40 tokens minted per $1 USDT equivalent spent."
                gradient="from-purple-600 to-pink-600"
              />
              <FeatureCard
                icon={<Users className="w-8 h-8" />}
                title="Referral System"
                description="Earn up to 10% through our multi-level referral program across 10 levels."
                gradient="from-pink-600 to-red-600"
              />
              <FeatureCard
                icon={<TrendingUp className="w-8 h-8" />}
                title="Multiple Income Streams"
                description="Users, anchors, and agencies all benefit from our fair revenue distribution model."
                gradient="from-blue-600 to-purple-600"
              />
              <FeatureCard
                icon={<Shield className="w-8 h-8" />}
                title="Secure Platform"
                description="Enterprise-grade security with JWT authentication and role-based access control."
                gradient="from-green-600 to-teal-600"
              />
              <FeatureCard
                icon={<Gift className="w-8 h-8" />}
                title="Digital Gifts"
                description="Send and receive virtual gifts that convert into real earnings for anchors."
                gradient="from-orange-600 to-yellow-600"
              />
              <FeatureCard
                icon={<Wallet className="w-8 h-8" />}
                title="Easy Withdrawals"
                description="Simple withdrawal process with transparent tracking and quick approvals."
                gradient="from-indigo-600 to-blue-600"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                How It <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Works</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <StepCard number="1" title="Sign Up" description="Create your account and choose your role" />
              <StepCard number="2" title="Engage" description="Connect with anchors or start hosting" />
              <StepCard number="3" title="Earn" description="Accumulate tokens and rewards automatically" />
              <StepCard number="4" title="Withdraw" description="Request payouts and grow your wealth" />
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section id="roles" className="bg-white dark:bg-gray-900 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Choose Your <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Path</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <RoleCard
                title="User"
                description="Explore, connect, and earn rewards for every interaction"
                features={["Earn 20% rewards", "Referral bonuses", "Gift sending"]}
                gradient="from-blue-600 to-cyan-600"
              />
              <RoleCard
                title="Anchor"
                description="Host engaging sessions and build your audience"
                features={["Earn 50% rewards", "Direct income", "Level progression"]}
                gradient="from-purple-600 to-pink-600"
              />
              <RoleCard
                title="Agency"
                description="Manage anchors and grow your network"
                features={["10% commission", "Team management", "Analytics dashboard"]}
                gradient="from-pink-600 to-red-600"
              />
              <RoleCard
                title="Admin"
                description="Oversee platform operations and economy"
                features={["10% platform fee", "Full control", "Treasury management"]}
                gradient="from-green-600 to-teal-600"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-12 md:p-20 text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Start Earning?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of users already earning rewards on Pukaarly. Your journey to financial growth starts here.
              </p>
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8">
                  Create Free Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Coins className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">Pukaarly</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Empowering creators and users through fair rewards distribution.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><Link href="#features" className="hover:text-purple-600">Features</Link></li>
                  <li><Link href="#how-it-works" className="hover:text-purple-600">How It Works</Link></li>
                  <li><Link href="#roles" className="hover:text-purple-600">Roles</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><Link href="#" className="hover:text-purple-600">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-purple-600">Terms of Service</Link></li>
                  <li><Link href="#" className="hover:text-purple-600">Privacy Policy</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Connect</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><Link href="#" className="hover:text-purple-600">Twitter</Link></li>
                  <li><Link href="#" className="hover:text-purple-600">Discord</Link></li>
                  <li><Link href="#" className="hover:text-purple-600">Telegram</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              © 2026 Pukaarly. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) {
  return (
    <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800/50">
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

function RoleCard({ title, description, features, gradient }: { title: string; description: string; features: string[]; gradient: string }) {
  return (
    <div className="p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/50">
      <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${gradient} text-white font-semibold mb-4`}>
        {title}
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}