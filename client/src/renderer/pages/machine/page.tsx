import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Monitor, User, Settings, Clock } from "lucide-react"
import { useTheme } from "../../components/ThemeProvider"

export default function MachinePage() {
  const [activeTab, setActiveTab] = useState("hardware")
  const [refreshing, setRefreshing] = useState(false)
  const { theme } = useTheme()

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2`}>My Machine</h1>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Station #7 - Gaming Beast</p>
      </motion.div>

      {/* Machine Status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-6"
      >
        {/* Status Card */}
        <Card className={`${theme === 'dark'
            ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30'
            : 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20'} 
            backdrop-blur-lg flex-1`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'} text-sm font-medium`}>Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Online</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Session Time</p>
                <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium text-xl`}>2h 15m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className={`${theme === 'dark' 
            ? 'bg-slate-900/50 border-white/10' 
            : 'bg-white/80 border-slate-200'} 
            backdrop-blur-lg flex-1`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>Quick Actions</p>
              <Button
                size="sm"
                variant="outline"
                className={`${theme === 'dark' 
                  ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                  : 'border-cyan-600/30 text-cyan-700 hover:bg-cyan-500/10'}`}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <User className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className={`${theme === 'dark' 
                ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                : 'border-cyan-600/30 text-cyan-700 hover:bg-cyan-500/10'}`}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" className={`${theme === 'dark' 
                ? 'border-red-500/30 text-red-400 hover:bg-red-500/20'
                : 'border-red-500/30 text-red-600 hover:bg-red-500/10'}`}>
                <User className="w-4 h-4 mr-2" />
                Restart
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs defaultValue="hardware" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'} p-1`}>
            <TabsTrigger value="hardware" className="data-[state=active]:bg-cyan-500">
              <User className="w-4 h-4 mr-2" />
              Hardware
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-cyan-500">
              <User className="w-4 h-4 mr-2" />
              Network
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-cyan-500">
              <User className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-cyan-500">
              <User className="w-4 h-4 mr-2" />
              Games
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hardware" className="mt-6">
            <Card className={`${theme === 'dark' 
              ? 'bg-slate-900/50 border-white/10' 
              : 'bg-white/80 border-slate-200'} 
              backdrop-blur-lg`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                  <User className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                  Hardware Specifications
                </CardTitle>
                <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                  Detailed information about your gaming station
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* CPU */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/10'} rounded-full flex items-center justify-center`}>
                      <User className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>Processor</p>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>Intel Core i9-13900K</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Usage</span>
                      <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} p-2 rounded`}>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Cores</p>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>24 (8P+16E)</p>
                      </div>
                      <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} p-2 rounded`}>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Threads</p>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>32</p>
                      </div>
                      <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} p-2 rounded`}>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Base Clock</p>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>3.0 GHz</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RAM */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-500/10'} rounded-full flex items-center justify-center`}>
                      <User className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>Memory</p>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>32GB DDR5-6000</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Usage</span>
                      <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>12.8 GB / 32 GB (40%)</span>
                    </div>
                    <Progress value={40} className="h-2" />
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} p-2 rounded`}>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Type</p>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>DDR5</p>
                      </div>
                      <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} p-2 rounded`}>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Speed</p>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>6000 MHz</p>
                      </div>
                      <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} p-2 rounded`}>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Channels</p>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>Dual</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GPU */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-500/10'} rounded-full flex items-center justify-center`}>
                      <Monitor className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                    <div>
                      <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>Graphics</p>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>NVIDIA GeForce RTX 4080</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Usage</span>
                      <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} p-2 rounded`}>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>VRAM</p>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>16 GB GDDR6X</p>
                      </div>
                      <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} p-2 rounded`}>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Core Clock</p>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>2.5 GHz</p>
                      </div>
                      <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} p-2 rounded`}>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Temperature</p>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>68°C</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Storage */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-500/10'} rounded-full flex items-center justify-center`}>
                      <User className={`w-5 h-5 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
                    </div>
                    <div>
                      <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>Storage</p>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>2TB NVMe SSD</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Usage</span>
                      <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1.2 TB / 2 TB (60%)</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} p-2 rounded`}>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Type</p>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>NVMe SSD</p>
                      </div>
                      <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} p-2 rounded`}>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Read Speed</p>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>7000 MB/s</p>
                      </div>
                      <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} p-2 rounded`}>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Write Speed</p>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>5000 MB/s</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="mt-6">
            <Card className={`${theme === 'dark' 
              ? 'bg-slate-900/50 border-white/10' 
              : 'bg-white/80 border-slate-200'} 
              backdrop-blur-lg`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                  <User className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                  Network Status
                </CardTitle>
                <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                  Connection information and network performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Connection Status */}
                <div className={`flex items-center justify-between p-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-500/10'} rounded-full flex items-center justify-center`}>
                      <User className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>Connection</p>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>Wired Ethernet</p>
                    </div>
                  </div>
                  <Badge className={`${theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-500/10 text-green-600'}`}>Excellent</Badge>
                </div>

                {/* Network Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                      <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>Download Speed</p>
                    </div>
                    <div className={`p-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg text-center`}>
                      <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>940 Mbps</p>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>Peak: 980 Mbps</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                      <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>Upload Speed</p>
                    </div>
                    <div className={`p-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg text-center`}>
                      <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>920 Mbps</p>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>Peak: 950 Mbps</p>
                    </div>
                  </div>
                </div>

                {/* Ping & Latency */}
                <div className="space-y-3">
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>Ping & Latency</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`p-3 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg text-center`}>
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>5 ms</p>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs`}>Local</p>
                    </div>
                    <div className={`p-3 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg text-center`}>
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>18 ms</p>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs`}>Regional</p>
                    </div>
                    <div className={`p-3 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg text-center`}>
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>45 ms</p>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs`}>International</p>
                    </div>
                  </div>
                </div>

                {/* Network Usage */}
                <div className="space-y-3">
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>Network Usage</p>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg`}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Downloaded</span>
                      <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>4.2 GB</span>
                    </div>
                    <Progress value={42} className="h-2 mb-4" />
                    <div className="flex justify-between text-sm mb-2">
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Uploaded</span>
                      <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>0.8 GB</span>
                    </div>
                    <Progress value={8} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <Card className={`${theme === 'dark' 
              ? 'bg-slate-900/50 border-white/10' 
              : 'bg-white/80 border-slate-200'} 
              backdrop-blur-lg`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                  <User className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                  System Performance
                </CardTitle>
                <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                  Real-time performance monitoring and system health
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Performance Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg text-center`}>
                    <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/10'} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <User className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>45%</p>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs`}>CPU Usage</p>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg text-center`}>
                    <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-500/10'} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <User className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                    </div>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>40%</p>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs`}>RAM Usage</p>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg text-center`}>
                    <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-500/10'} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <Monitor className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>65%</p>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs`}>GPU Usage</p>
                  </div>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg text-center`}>
                    <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-red-500/20' : 'bg-red-500/10'} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <User className={`w-5 h-5 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                    </div>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>68°C</p>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs`}>Temperature</p>
                  </div>
                </div>

                {/* CPU Cores */}
                <div className="space-y-3">
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>CPU Cores</p>
                  <div className="grid gri" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
