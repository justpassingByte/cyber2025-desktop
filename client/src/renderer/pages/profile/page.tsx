import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { User, Settings, Clock } from "lucide-react"
import { useTheme } from "../../components/ThemeProvider"

const gameStats = [
  { name: "CS:GO", hours: 156, rank: "Global Elite", winRate: 78 },
  { name: "Valorant", hours: 89, rank: "Immortal", winRate: 65 },
  { name: "League of Legends", hours: 234, rank: "Diamond", winRate: 72 },
  { name: "Fortnite", hours: 45, rank: "Champion", winRate: 58 },
]

const recentActivity = [
  { type: "game", title: "Won CS:GO Match", time: "2 hours ago", points: "+50 XP" },
  { type: "achievement", title: "First Victory", time: "1 day ago", points: "+100 XP" },
  { type: "purchase", title: "Recharged Account", time: "2 days ago", points: "+$25.00" },
  { type: "tournament", title: "Joined Tournament", time: "3 days ago", points: "Entry Fee" },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    birthday: "1995-06-15",
    bio: "Passionate gamer and esports enthusiast. Love competitive gaming and making new friends!",
  })
  const { theme } = useTheme()

  const handleSave = () => {
    setIsEditing(false)
    // Save profile data logic here
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2`}>My Profile</h1>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Manage your account and gaming statistics</p>
      </motion.div>

      {/* Profile Overview */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Card className={`${theme === 'dark'
          ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30'
          : 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20'} 
          backdrop-blur-lg`}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-cyan-500/50">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="bg-cyan-500 text-white text-2xl">JD</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-600 p-0"
                >
                  <User className="w-4 h-4" />
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{profileData.name}</h2>
                  <Badge className={`${theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-500/10 text-cyan-700'} w-fit mx-auto md:mx-0`}>Pro Gamer</Badge>
                </div>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'} mb-4`}>{profileData.bio}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Level 5</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Current Level</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1,250</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Total XP</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>524h</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Total Playtime</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>15</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Achievements</p>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className={`${theme === 'dark' 
                  ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                  : 'border-cyan-600/30 text-cyan-700 hover:bg-cyan-500/10'}`}
              >
                {isEditing ? <User className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className={`${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'} p-1`}>
            <TabsTrigger value="personal" className="data-[state=active]:bg-cyan-500">
              <User className="w-4 h-4 mr-2" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="gaming" className="data-[state=active]:bg-cyan-500">
              <User className="w-4 h-4 mr-2" />
              Gaming Stats
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-cyan-500">
              <Clock className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-cyan-500">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className={`${theme === 'dark' 
              ? 'bg-slate-900/50 border-white/10' 
              : 'bg-white/80 border-slate-200'} 
              backdrop-blur-lg`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Personal Information</CardTitle>
                <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                  {isEditing ? "Edit your personal details" : "Your personal details"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className={`${theme === 'dark' 
                            ? 'bg-white/10 border-white/20 text-white' 
                            : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className={`${theme === 'dark' 
                            ? 'bg-white/10 border-white/20 text-white' 
                            : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className={`${theme === 'dark' 
                            ? 'bg-white/10 border-white/20 text-white' 
                            : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="birthday" className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          Birthday
                        </Label>
                        <Input
                          id="birthday"
                          type="date"
                          value={profileData.birthday}
                          onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                          className={`${theme === 'dark' 
                            ? 'bg-white/10 border-white/20 text-white' 
                            : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio" className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Bio
                      </Label>
                      <textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className={`w-full p-3 rounded-md resize-none ${theme === 'dark' 
                          ? 'bg-white/10 border border-white/20 text-white placeholder:text-gray-400' 
                          : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600">
                      <User className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>Full Name</p>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>{profileData.name}</p>
                      </div>
                      <div>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>Email</p>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>{profileData.email}</p>
                      </div>
                      <div>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>Phone</p>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>{profileData.phone}</p>
                      </div>
                      <div>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>Birthday</p>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>June 15, 1995</p>
                      </div>
                    </div>
                    <div>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>Bio</p>
                      <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>{profileData.bio}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gaming">
            <div className="space-y-6">
              {/* Level Progress */}
              <Card className={`${theme === 'dark' 
                ? 'bg-slate-900/50 border-white/10' 
                : 'bg-white/80 border-slate-200'} 
                backdrop-blur-lg`}>
                <CardHeader>
                  <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                    <User className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                    Level Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>Level 5 → Level 6</span>
                      <span className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`}>1,250 / 2,000 XP</span>
                    </div>
                    <Progress value={62.5} className="h-3" />
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>750 XP needed for next level</p>
                  </div>
                </CardContent>
              </Card>

              {/* Game Statistics */}
              <Card className={`${theme === 'dark' 
                ? 'bg-slate-900/50 border-white/10' 
                : 'bg-white/80 border-slate-200'} 
                backdrop-blur-lg`}>
                <CardHeader>
                  <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                    <User className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                    Game Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {gameStats.map((game, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 ${theme === 'dark'
                          ? 'bg-white/5 rounded-lg hover:bg-white/10' 
                          : 'bg-slate-100 rounded-lg hover:bg-slate-200'} transition-colors`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-500/10'} rounded-lg flex items-center justify-center`}>
                            <User className={`w-6 h-6 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                          </div>
                          <div>
                            <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>{game.name}</p>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>{game.hours} hours played</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'} font-medium`}>{game.rank}</p>
                          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>{game.winRate}% win rate</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className={`${theme === 'dark' 
                ? 'bg-slate-900/50 border-white/10' 
                : 'bg-white/80 border-slate-200'} 
                backdrop-blur-lg`}>
                <CardHeader>
                  <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                    <User className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg`}>
                        <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-500/10'} rounded-full flex items-center justify-center`}>
                          <User className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        </div>
                        <div>
                          <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>Achievement {i}</p>
                          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs`}>
                            Unlocked {i} day{i > 1 ? "s" : ""} ago
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card className={`${theme === 'dark' 
              ? 'bg-slate-900/50 border-white/10' 
              : 'bg-white/80 border-slate-200'} 
              backdrop-blur-lg`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                  <Clock className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                  Recent Activity
                </CardTitle>
                <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Your gaming and account activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 ${theme === 'dark'
                        ? 'bg-white/5 rounded-lg hover:bg-white/10' 
                        : 'bg-slate-100 rounded-lg hover:bg-slate-200'} transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === "game"
                              ? theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/10'
                              : activity.type === "achievement"
                                ? theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-500/10'
                                : activity.type === "purchase"
                                  ? theme === 'dark' ? 'bg-green-500/20' : 'bg-green-500/10'
                                  : theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-500/10'
                          }`}
                        >
                          {activity.type === "game" ? (
                            <User className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                          ) : activity.type === "achievement" ? (
                            <User className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                          ) : activity.type === "purchase" ? (
                            <User className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                          ) : (
                            <User className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                          )}
                        </div>
                        <div>
                          <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>{activity.title}</p>
                          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>{activity.time}</p>
                        </div>
                      </div>
                      <Badge
                        className={
                          activity.type === "game"
                            ? theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-600'
                            : activity.type === "achievement"
                              ? theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-500/10 text-yellow-600'
                              : activity.type === "purchase"
                                ? theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-500/10 text-green-600'
                                : theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-500/10 text-purple-600'
                        }
                      >
                        {activity.points}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className={`${theme === 'dark' 
              ? 'bg-slate-900/50 border-white/10' 
              : 'bg-white/80 border-slate-200'} 
              backdrop-blur-lg`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                  <Settings className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                  Account Settings
                </CardTitle>
                <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Privacy Settings */}
                <div>
                  <h3 className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium mb-3`}>Privacy Settings</h3>
                  <div className="space-y-3">
                    <div className={`flex items-center justify-between p-3 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg`}>
                      <div>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Show online status</p>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>Let others see when you&apos;re online</p>
                      </div>
                      <Button variant="outline" size="sm" className={`${theme === 'dark' 
                        ? 'border-cyan-500/30 text-cyan-400' 
                        : 'border-cyan-600/30 text-cyan-700'}`}>
                        Enabled
                      </Button>
                    </div>
                    <div className={`flex items-center justify-between p-3 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg`}>
                      <div>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Show gaming activity</p>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>Display what games you&apos;re playing</p>
                      </div>
                      <Button variant="outline" size="sm" className={`${theme === 'dark' 
                        ? 'border-cyan-500/30 text-cyan-400' 
                        : 'border-cyan-600/30 text-cyan-700'}`}>
                        Enabled
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div>
                  <h3 className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium mb-3`}>Notifications</h3>
                  <div className="space-y-3">
                    <div className={`flex items-center justify-between p-3 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg`}>
                      <div>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Tournament notifications</p>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>Get notified about tournaments</p>
                      </div>
                      <Button variant="outline" size="sm" className={`${theme === 'dark' 
                        ? 'border-cyan-500/30 text-cyan-400' 
                        : 'border-cyan-600/30 text-cyan-700'}`}>
                        Enabled
                      </Button>
                    </div>
                    <div className={`flex items-center justify-between p-3 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg`}>
                      <div>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Friend requests</p>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>Get notified about friend requests</p>
                      </div>
                      <Button variant="outline" size="sm" className={`${theme === 'dark' 
                        ? 'border-cyan-500/30 text-cyan-400' 
                        : 'border-cyan-600/30 text-cyan-700'}`}>
                        Enabled
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div>
                  <h3 className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium mb-3`}>Account Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className={`w-full ${theme === 'dark' 
                      ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                      : 'border-cyan-600/30 text-cyan-700 hover:bg-cyan-500/10'}`}>
                      Change Password
                    </Button>
                    <Button
                      variant="outline"
                      className={`w-full ${theme === 'dark' 
                        ? 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
                        : 'border-yellow-600/30 text-yellow-600 hover:bg-yellow-500/10'}`}
                    >
                      Download My Data
                    </Button>
                    <Button variant="outline" className={`w-full ${theme === 'dark' 
                      ? 'border-red-500/30 text-red-400 hover:bg-red-500/20'
                      : 'border-red-500/30 text-red-600 hover:bg-red-500/10'}`}>
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
