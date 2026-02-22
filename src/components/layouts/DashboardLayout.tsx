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
  Coins
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  role: "user" | "anchor" | "agency" | "admin";
}

export function DashboardLayout({ children, navItems, role }: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const roleColors = {
    user: "from-blue-600 to-cyan-600",
    anchor: "from-purple-600 to-pink-600",
    agency: "from-pink-600 to-red-600",
    admin: "from-green-600 to-teal-600"
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleColors[role]} flex items-center justify-center`}>
            <Coins className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">Pukaarly</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-200 dark:border-gray-800">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleColors[role]} flex items-center justify-center`}>
            <Coins className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">Pukaarly</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && `bg-gradient-to-r ${roleColors[role]} text-white hover:opacity-90`
                  )}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}