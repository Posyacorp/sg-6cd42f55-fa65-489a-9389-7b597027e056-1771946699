import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  User, 
  LogOut,
  Menu,
  X,
  Coins,
  MessageSquare,
  Wallet,
  UserCircle,
  UserPlus,
  TrendingDown,
  Compass,
  DollarSign,
  Settings,
  TrendingUp,
  Users,
  UserCheck,
  Building2,
  Gift,
  Vault,
  Video,
  Radio,
  FileText
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface DashboardLayoutProps {
  children: ReactNode;
  role: "user" | "anchor" | "agency" | "admin";
}

const navigationConfig: Record<"user" | "anchor" | "agency" | "admin", NavItem[]> = {
  user: [
    { label: "Dashboard", href: "/user/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Explore", href: "/user/explore", icon: <Compass className="w-5 h-5" /> },
    { label: "Messages", href: "/user/messages", icon: <MessageSquare className="w-5 h-5" /> },
    { label: "Wallet", href: "/user/wallet", icon: <Wallet className="w-5 h-5" /> },
    { label: "Referrals", href: "/user/referrals", icon: <Users className="w-5 h-5" /> },
    { label: "Profile", href: "/user/profile", icon: <User className="w-5 h-5" /> }
  ],
  anchor: [
    { label: "Dashboard", href: "/anchor/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Go Live", href: "/anchor/go-live", icon: <Radio className="w-5 h-5" /> },
    { label: "Income", href: "/anchor/income", icon: <Coins className="w-5 h-5" /> },
    { label: "Call Price", href: "/anchor/call-price", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Level", href: "/anchor/level", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Withdraw", href: "/anchor/withdraw", icon: <Wallet className="w-5 h-5" /> },
    { label: "Profile", href: "/anchor/profile", icon: <User className="w-5 h-5" /> }
  ],
  agency: [
    { label: "Dashboard", href: "/agency/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Anchors", href: "/agency/anchors", icon: <Users className="w-5 h-5" /> },
    { label: "Commission", href: "/agency/commission", icon: <Coins className="w-5 h-5" /> },
    { label: "Withdrawals", href: "/agency/withdrawals", icon: <Wallet className="w-5 h-5" /> },
    { label: "Invite", href: "/agency/invite", icon: <UserPlus className="w-5 h-5" /> },
    { label: "Profile", href: "/agency/profile", icon: <User className="w-5 h-5" /> }
  ],
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Users", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
    { label: "Anchors", href: "/admin/anchors", icon: <UserCheck className="w-5 h-5" /> },
    { label: "Agencies", href: "/admin/agencies", icon: <Building2 className="w-5 h-5" /> },
    { label: "Economy", href: "/admin/economy", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Gifts", href: "/admin/gifts", icon: <Gift className="w-5 h-5" /> },
    { label: "Withdrawals", href: "/admin/withdrawals", icon: <Wallet className="w-5 h-5" /> },
    { label: "Treasury", href: "/admin/treasury", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Logs", href: "/admin/logs", icon: <FileText className="w-5 h-5" /> },
    { label: "Create Users", href: "/admin/create-proxy-users", icon: <UserPlus className="w-5 h-5" /> },
    { label: "Test Video", href: "/admin/test-video", icon: <Video className="w-5 h-5" /> },
    { label: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
    { label: "Profile", href: "/admin/profile", icon: <User className="w-5 h-5" /> }
  ]
};

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = navigationConfig[role];

  const roleColors = {
    user: "from-blue-600 to-cyan-600",
    anchor: "from-purple-600 to-pink-600",
    agency: "from-pink-600 to-red-600",
    admin: "from-green-600 to-teal-600"
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleColors[role]} flex items-center justify-center shadow-lg`}>
            <Coins className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Pukaarly</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-10 w-10"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </header>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 transition-transform duration-300 shadow-xl",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200 dark:border-gray-800">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleColors[role]} flex items-center justify-center shadow-lg`}>
            <Coins className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Pukaarly</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-200px)]">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-12 text-base font-medium",
                    isActive && `bg-gradient-to-r ${roleColors[role]} text-white hover:opacity-90 shadow-md`
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${roleColors[role]} flex items-center justify-center shadow-md`}>
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full h-11 text-base font-medium"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}