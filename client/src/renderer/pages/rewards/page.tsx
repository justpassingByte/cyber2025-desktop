import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Gift, Calendar, Star, Clock, CheckCircle, ChevronRight, Zap, Trophy, Cpu, Gamepad, User } from "../../components/icons"
import { useTheme } from "../../components/ThemeProvider"

const dailyRewards = [
  { day: 1, reward: "50 XP", claimed: true },
  { day: 2, reward: "$1.00 Credit", claimed: true },
  { day: 3, reward: "100 XP", claimed: true },
  { day: 4, reward: "1 Hour Free", claimed: true },
  { day: 5, reward: "$2.00 Credit", claimed: true },
  { day: 6, reward: "200 XP", claimed: true },
  { day: 7, reward: "Premium Skin", claimed: false, special: true },
]

const achievements = [
  {
    id: 1,
    name: "First Victory",
    description: "Win your first tournament match",
    progress: 100,
    reward: "100 XP",
    completed: true,
    icon: Trophy,
  },
  {
    id: 2,
    name: "Regular Gamer",
    description: "Play for 10 hours total",
    progress: 70,
    reward: "$2.00 Credit",
    completed: false,
    icon: Clock,
  },
  {
    id: 3,
    name: "Social Butterfly",
    description: "Add 5 friends to your network",
    progress: 60,
    reward: "200 XP",
    completed: false,
    icon: Star,
  },
  {
    id: 4,
    name: "Game Master",
    description: "Try 10 different games",
    progress: 40,
    reward: "1 Hour Free",
    completed: false,
    icon: Gamepad,
  },
]

const redeemableRewards = [
  {
    id: 1,
    name: "1 Hour Free Gaming",
    description: "Redeem for a free hour of gaming time",
    cost: "500 XP",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Energy Drink",
    description: "Free energy drink from the cafe",
    cost: "300 XP",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Gaming Peripheral",
    description: "50% off any gaming peripheral",
    cost: "1000 XP",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Tournament Entry",
    description: "Free entry to any tournament",
    cost: "2000 XP",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    name: "Premium Snack",
    description: "Redeem for a premium snack at the cafe",
    cost: "250 XP",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 6,
    name: "Weekend Pass (5 Hours)",
    description: "Get 5 hours of gaming for the weekend",
    cost: "1200 XP",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 7,
    name: "Exclusive Gaming Chair Access",
    description: "Use our premium gaming chair for a session",
    cost: "800 XP",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState("daily")
  const { theme } = useTheme()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2`}>Rewards & Achievements</h1>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Earn rewards and track your progress</p>
      </motion.div>

      {/* XP Progress */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Card className={`${theme === 'dark' 
          ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30' 
          : 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20'} 
          backdrop-blur-lg`}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-cyan-400 text-sm font-medium">Your XP</p>
                <div className="flex items-baseline gap-2">
                  <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1,250</p>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>/ 2,000 for next level</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Level 5</p>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Pro Gamer</p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Progress to Level 6</span>
                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>62%</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Rewards Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'} p-1`}>
            <TabsTrigger value="daily" className="data-[state=active]:bg-cyan-500">
              <Calendar className="w-4 h-4 mr-2" />
              Daily Check-in
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-cyan-500">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="redeem" className="data-[state=active]:bg-cyan-500">
              <Gift className="w-4 h-4 mr-2" />
              Redeem Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-6">
            <Card className={`${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-lg border-white/10' : 'bg-white/80 border-slate-200 backdrop-blur-lg'}`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                  <Calendar className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                  Daily Check-in Rewards
                </CardTitle>
                <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Check in daily to earn rewards. Current streak: 6 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-3">
                  {dailyRewards.map((reward, index) => (
                    <div
                      key={index}
                      className={`relative rounded-lg border ${
                        reward.claimed
                          ? theme === 'dark' ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-500/5 border-cyan-500/20'
                          : reward.special
                            ? theme === 'dark' ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-500/30' : 'bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/20'
                            : theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                      } p-4 text-center`}
                    >
                      <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-1`}>Day {reward.day}</div>
                      <div
                        className={`text-sm ${reward.special ? 'text-yellow-400 font-medium' : theme === 'dark' ? 'text-gray-300' : 'text-slate-500'} mb-2`}
                      >
                        {reward.reward}
                      </div>
                      {reward.claimed ? (
                        <div className={`w-6 h-6 ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-500/10'} rounded-full flex items-center justify-center mx-auto`}>
                          <CheckCircle className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className={
                            reward.special
                              ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 w-full'
                              : theme === 'dark' ? 'bg-cyan-500 hover:bg-cyan-600 w-full' : 'bg-cyan-600 hover:bg-cyan-700 w-full text-white'
                          }
                        >
                          Claim
                        </Button>
                      )}
                      {reward.special && (
                        <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white">Special</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <Card className={`${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-lg border-white/10' : 'bg-white/80 border-slate-200 backdrop-blur-lg'}`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                  <Trophy className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                  Achievements
                </CardTitle>
                <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Complete achievements to earn rewards and XP</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.completed ? theme === 'dark' ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-500/5 border-cyan-500/20' : theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.completed ? theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-500/10' : theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'
                        }`}
                      >
                        <achievement.icon
                          className={`w-6 h-6 ${achievement.completed ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600' : theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>{achievement.name}</h3>
                          <Badge
                            className={
                              achievement.completed ? theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-500/10 text-cyan-600' : theme === 'dark' ? 'bg-white/10 text-gray-300' : 'bg-slate-200 text-slate-500'
                            }
                          >
                            {achievement.reward}
                          </Badge>
                        </div>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>{achievement.description}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Progress</span>
                            <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{achievement.progress}%</span>
                          </div>
                          <Progress value={achievement.progress} className="h-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="redeem" className="mt-6">
            <Card className={`${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-lg border-white/10' : 'bg-white/80 border-slate-200 backdrop-blur-lg'}`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                  <Gift className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                  Redeem Rewards
                </CardTitle>
                <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Use your XP to redeem exclusive rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {redeemableRewards.map((reward) => (
                    <div
                      key={reward.id}
                      className={`flex gap-4 p-4 rounded-lg border ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-slate-100 hover:bg-slate-200'} transition-colors`}
                    >
                      <img
                        src={reward.image || "/placeholder.svg"}
                        alt={reward.name}
                        className="w-16 h-16 object-cover rounded-md"
                        width={64}
                        height={64}
                      />
                      <div className="flex-1">
                        <h3 className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>{reward.name}</h3>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>{reward.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Zap className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                            <span className={`${theme === 'dark' ? 'text-cyan-400 font-medium' : 'text-cyan-700 font-medium'}`}>{reward.cost}</span>
                          </div>
                          <Button size="sm" variant="outline" className={`${theme === 'dark' ? 'border-cyan-500/30 text-cyan-400' : 'border-cyan-600/30 text-cyan-700'}`}>
                            Redeem
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Recent Rewards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className={`${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-lg border-white/10' : 'bg-white/80 border-slate-200 backdrop-blur-lg'}`}>
          <CardHeader>
            <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
              <Clock className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
              Recent Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`${theme === 'dark' ? 'flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10' : 'flex items-center justify-between p-3 bg-slate-100 rounded-lg hover:bg-slate-200'} transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${theme === 'dark' ? 'w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center' : 'w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center'}`}>
                      {i === 1 ? (
                        <Gift className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                      ) : i === 2 ? (
                        <Star className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                      ) : (
                        <Trophy className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                      )}
                    </div>
                    <div>
                      <p className={`${theme === 'dark' ? 'text-white font-medium' : 'text-slate-900 font-medium'}`}>
                        {i === 1 ? "Daily Check-in Reward" : i === 2 ? "Level Up Bonus" : "Achievement Completed"}
                      </p>
                      <p className={`${theme === 'dark' ? 'text-gray-400 text-xs' : 'text-slate-500 text-xs'}`}>
                        {i} day{i > 1 ? "s" : ""} ago
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`${theme === 'dark' ? 'text-cyan-400 font-bold' : 'text-cyan-700 font-bold'}`}>
                      {i === 1 ? "$1.00 Credit" : i === 2 ? "500 XP" : "1 Hour Free"}
                    </p>
                    <Button variant="ghost" size="sm" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white p-0' : 'text-slate-500 hover:text-slate-900 p-0'}`}>
                      Details <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
