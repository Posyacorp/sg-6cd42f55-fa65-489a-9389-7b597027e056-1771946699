import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { pkService } from "@/services/pkService";
import { Swords, Trophy, Timer, Flame, Crown } from "lucide-react";

interface PKBattleInterfaceProps {
  streamId: string;
  anchorId: string;
  isAnchor?: boolean;
}

export function PKBattleInterface({ streamId, anchorId, isAnchor = false }: PKBattleInterfaceProps) {
  const [activeBattle, setActiveBattle] = useState<any>(null);
  const [availableAnchors, setAvailableAnchors] = useState<any[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    loadActiveBattle();
    if (isAnchor) {
      loadAvailableAnchors();
    }
  }, [streamId]);

  useEffect(() => {
    if (!activeBattle) return;

    // Subscribe to real-time score updates
    const subscription = pkService.subscribeToPKBattle(activeBattle.id, {
      onScoreUpdate: (battle) => {
        setActiveBattle(battle);
      },
      onBattleEnd: (winnerId) => {
        setActiveBattle((prev: any) => ({ ...prev, winner_id: winnerId, status: "ended" }));
      },
    });

    return () => {
      pkService.unsubscribeFromPKBattle(subscription);
    };
  }, [activeBattle?.id]);

  useEffect(() => {
    if (!activeBattle || activeBattle.status !== "active") return;

    const startTime = new Date(activeBattle.start_time).getTime();
    const duration = activeBattle.duration_minutes * 60 * 1000;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(0, duration - elapsed);

      setTimeRemaining(Math.floor(remaining / 1000));

      if (remaining === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeBattle]);

  const loadActiveBattle = async () => {
    const { data } = await pkService.getActiveBattle(streamId);
    if (data) {
      setActiveBattle(data);
    }
  };

  const loadAvailableAnchors = async () => {
    // Mock data - replace with actual API call to get live anchors
    setAvailableAnchors([
      { id: "anchor-1", full_name: "Alex Chen", avatar_url: null, viewer_count: 245 },
      { id: "anchor-2", full_name: "Sarah Johnson", avatar_url: null, viewer_count: 189 },
      { id: "anchor-3", full_name: "Mike Rodriguez", avatar_url: null, viewer_count: 432 },
    ]);
  };

  const handleSendInvite = async (inviteeId: string) => {
    const result = await pkService.createPKBattle({
      inviter_id: anchorId,
      invitee_id: inviteeId,
      stream_id: streamId,
      duration_minutes: 5
    });
    if (result.success) {
      setShowInviteModal(false);
      await loadActiveBattle();
    }
  };

  const handleAcceptInvite = async () => {
    if (!activeBattle) return;
    const result = await pkService.acceptBattle(activeBattle.id);
    if (result.success) {
      await loadActiveBattle();
    }
  };

  const handleRejectInvite = async () => {
    if (!activeBattle) return;
    const result = await pkService.rejectBattle(activeBattle.id);
    if (result.success) {
      setActiveBattle(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScorePercentage = (score1: number, score2: number, isFirst: boolean) => {
    const total = score1 + score2;
    if (total === 0) return 50;
    return isFirst ? (score1 / total) * 100 : (score2 / total) * 100;
  };

  // No active battle - show challenge button for anchors
  if (!activeBattle && isAnchor) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardContent className="p-6 text-center">
          <Swords className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          <h3 className="text-xl font-bold mb-2">Ready for Battle?</h3>
          <p className="text-gray-400 mb-4">Challenge another anchor to a 1v1 PK Battle!</p>
          <Button
            onClick={() => setShowInviteModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Swords className="w-4 h-4 mr-2" />
            Start PK Battle
          </Button>

          {/* Invite Modal */}
          {showInviteModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Challenge Anchor</h3>
                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    {availableAnchors.map((anchor) => (
                      <div
                        key={anchor.id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={anchor.avatar_url} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600">
                              {anchor.full_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{anchor.full_name}</p>
                            <p className="text-sm text-gray-400">{anchor.viewer_count} viewers</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleSendInvite(anchor.id)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Challenge
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowInviteModal(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Pending invitation
  if (activeBattle?.status === "pending") {
    const isInviter = activeBattle.inviter_id === anchorId;

    return (
      <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/30">
        <CardContent className="p-6 text-center">
          <Timer className="w-12 h-12 mx-auto mb-4 text-orange-400 animate-pulse" />
          <h3 className="text-xl font-bold mb-2">
            {isInviter ? "Battle Invitation Sent!" : "Battle Challenge Received!"}
          </h3>
          <p className="text-gray-400 mb-4">
            {isInviter
              ? "Waiting for opponent to accept..."
              : "You've been challenged to a PK Battle!"}
          </p>
          {!isInviter && (
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleAcceptInvite}
                className="bg-green-600 hover:bg-green-700"
              >
                Accept Battle
              </Button>
              <Button
                variant="outline"
                onClick={handleRejectInvite}
                className="border-red-500 text-red-500 hover:bg-red-500/10"
              >
                Decline
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Active battle
  if (activeBattle?.status === "active") {
    const inviterPercentage = getScorePercentage(
      activeBattle.inviter_score,
      activeBattle.invitee_score,
      true
    );
    const inviteePercentage = getScorePercentage(
      activeBattle.inviter_score,
      activeBattle.invitee_score,
      false
    );

    return (
      <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/50">
        <CardContent className="p-6">
          {/* Battle Header */}
          <div className="flex items-center justify-between mb-6">
            <Badge className="bg-red-600 text-white animate-pulse">
              <Flame className="w-3 h-3 mr-1" />
              LIVE BATTLE
            </Badge>
            <div className="flex items-center gap-2 text-orange-400 font-bold text-xl">
              <Timer className="w-5 h-5" />
              {formatTime(timeRemaining)}
            </div>
          </div>

          {/* Competitors */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Inviter */}
            <div className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-2 ring-4 ring-purple-500">
                <AvatarImage src={activeBattle.inviter?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-2xl">
                  {activeBattle.inviter?.full_name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <p className="font-bold">{activeBattle.inviter?.full_name || "Anchor 1"}</p>
              <p className="text-2xl font-bold text-purple-400">{activeBattle.inviter_score}</p>
            </div>

            {/* VS Divider */}
            <div className="flex items-center justify-center">
              <Swords className="w-8 h-8 text-pink-500" />
            </div>

            {/* Invitee */}
            <div className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-2 ring-4 ring-pink-500">
                <AvatarImage src={activeBattle.invitee?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-pink-600 to-purple-600 text-2xl">
                  {activeBattle.invitee?.full_name?.charAt(0) || "B"}
                </AvatarFallback>
              </Avatar>
              <p className="font-bold">{activeBattle.invitee?.full_name || "Anchor 2"}</p>
              <p className="text-2xl font-bold text-pink-400">{activeBattle.invitee_score}</p>
            </div>
          </div>

          {/* Score Progress Bar */}
          <div className="relative h-8 bg-gray-700 rounded-full overflow-hidden mb-4">
            <div
              className="absolute left-0 h-full bg-gradient-to-r from-purple-600 to-purple-500 transition-all duration-500"
              style={{ width: `${inviterPercentage}%` }}
            />
            <div
              className="absolute right-0 h-full bg-gradient-to-l from-pink-600 to-pink-500 transition-all duration-500"
              style={{ width: `${inviteePercentage}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {activeBattle.inviter_score} : {activeBattle.invitee_score}
            </div>
          </div>

          {/* Battle Info */}
          <div className="text-center text-sm text-gray-400">
            <p>Send gifts to support your favorite anchor!</p>
            <p>The anchor with the most coins wins! 🏆</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Battle ended
  if (activeBattle?.status === "ended") {
    const winner =
      activeBattle.winner_id === activeBattle.inviter_id
        ? activeBattle.inviter
        : activeBattle.invitee;

    return (
      <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/50">
        <CardContent className="p-6 text-center">
          <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h3 className="text-2xl font-bold mb-2">Battle Complete!</h3>
          <div className="mb-4">
            <Avatar className="w-24 h-24 mx-auto mb-3 ring-4 ring-yellow-500">
              <AvatarImage src={winner?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-yellow-600 to-orange-600 text-3xl">
                {winner?.full_name?.charAt(0) || "W"}
              </AvatarFallback>
            </Avatar>
            <p className="text-xl font-bold text-yellow-400">{winner?.full_name || "Winner"}</p>
            <Badge className="bg-yellow-600 mt-2">
              <Trophy className="w-3 h-3 mr-1" />
              CHAMPION
            </Badge>
          </div>
          <div className="flex justify-between text-sm bg-gray-800 p-4 rounded-lg">
            <div>
              <p className="text-gray-400">Final Score</p>
              <p className="font-bold text-lg">
                {activeBattle.inviter_score} : {activeBattle.invitee_score}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Total Coins</p>
              <p className="font-bold text-lg">{activeBattle.total_coins_received || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}