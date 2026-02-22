import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  TrendingUp, 
  UserPlus,
  Copy,
  Share2,
  Mail,
  MessageSquare
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/agency/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Anchors", href: "/agency/anchors", icon: <Users className="w-4 h-4" /> },
  { label: "Commission", href: "/agency/commission", icon: <DollarSign className="w-4 h-4" /> },
  { label: "Withdrawals", href: "/agency/withdrawals", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Invite", href: "/agency/invite", icon: <UserPlus className="w-4 h-4" /> }
];

export default function AgencyInvite() {
  return (
    <>
      <SEO title="Invite Anchors - Pukaarly Agency" />
      <DashboardLayout navItems={navItems} role="agency">
        <div className="space-y-6 max-w-4xl">
          <div>
            <h1 className="text-3xl font-bold">Invite New Anchors</h1>
            <p className="text-gray-600 dark:text-gray-400">Grow your agency by inviting talented hosts</p>
          </div>

          {/* Invitation Link */}
          <Card>
            <CardHeader>
              <CardTitle>Your Agency Invitation Link</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    readOnly 
                    value="https://pukaarly.com/agency/join/MYAGENCY123" 
                    className="font-mono"
                  />
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share this link with potential anchors. You'll earn 10% commission on all their earnings!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Invitation Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Why Join Your Agency?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold mb-2">🎯 Marketing Support</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get featured in agency promotions and campaigns
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h3 className="font-semibold mb-2">📈 Growth Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Access exclusive training and analytics
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="font-semibold mb-2">💰 Better Rates</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Negotiate higher earnings with agency backing
                  </p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h3 className="font-semibold mb-2">🤝 Personal Support</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Dedicated account manager and 24/7 assistance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invite by Email */}
          <Card>
            <CardHeader>
              <CardTitle>Send Direct Invitation</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="anchor@example.com" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Personal Message (Optional)</label>
                  <textarea 
                    className="w-full h-24 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                    placeholder="Add a personal message to your invitation..."
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Pending Invitations */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { email: "sarah@example.com", sent: "2 days ago", status: "pending" },
                  { email: "emma@example.com", sent: "1 week ago", status: "accepted" },
                  { email: "lisa@example.com", sent: "2 weeks ago", status: "pending" }
                ].map((invite, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sent {invite.sent}</p>
                    </div>
                    <Badge variant={invite.status === "accepted" ? "default" : "secondary"}>
                      {invite.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}