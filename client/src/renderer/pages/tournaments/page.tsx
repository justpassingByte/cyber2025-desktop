import { useState } from "react"
import { motion } from "framer-motion"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useTheme } from "../../components/ThemeProvider"
import { Trophy, Calendar, Users, Clock, Star, ChevronRight, Medal } from "../../components/icons"

export default function TournamentsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const { theme } = useTheme()

  const upcomingTournaments = [
  {
    id: 1,
      game: "Counter-Strike 2",
      title: "Weekend Warriors",
      date: "This Saturday, 7:00 PM",
      participants: "16/32",
      prize: "$500",
      entryFee: "$10",
      image: "/placeholder.svg",
  },
  {
    id: 2,
    game: "League of Legends",
      title: "Summoner's Clash",
      date: "Next Friday, 6:00 PM",
      participants: "8/20",
      prize: "$300",
      entryFee: "$5",
      image: "/placeholder.svg",
  },
  {
    id: 3,
      game: "Valorant",
      title: "Tactical Showdown",
      date: "Oct 15, 8:00 PM",
      participants: "20/30",
      prize: "$400",
      entryFee: "$8",
      image: "/placeholder.svg",
    },
  ]

  const ongoingTournaments = [
  {
    id: 4,
      game: "Dota 2",
      title: "Battle of Ancients",
      status: "Group Stage",
      nextMatch: "Team Alpha vs Team Beta",
      participants: "16/16",
      prize: "$600",
      image: "/placeholder.svg",
  },
  ]

  const pastTournaments = [
  {
    id: 5,
      game: "Fortnite",
      title: "Victory Royale Challenge",
      date: "Last Sunday",
      winner: "xXDarkLordXx",
      participants: "50",
      prize: "$700",
      image: "/placeholder.svg",
    },
    {
      id: 6,
      game: "Call of Duty: Warzone",
      title: "Gulag Champions",
      date: "2 weeks ago",
      winner: "TheSniper420",
      participants: "40",
      prize: "$450",
      image: "/placeholder.svg",
  },
]

  const myTournaments = [
    {
      id: 2,
      game: "League of Legends",
      title: "Summoner's Clash",
      date: "Next Friday, 6:00 PM",
      status: "Registered",
      teamName: "Digital Destroyers",
      image: "/placeholder.svg",
    },
    {
      id: 6,
      game: "Call of Duty: Warzone",
      title: "Gulag Champions",
      date: "2 weeks ago",
      status: "5th Place",
      teamName: "Digital Destroyers",
      image: "/placeholder.svg",
    },
  ]

  const filteredTournaments = () => {
    switch(activeTab) {
      case "upcoming":
        return upcomingTournaments;
      case "ongoing":
        return ongoingTournaments;
      case "past":
        return pastTournaments;
      default:
        return [];
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2`}>
          Tournaments
        </h1>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Compete and win amazing prizes</p>
      </motion.div>

      {/* Featured Tournament */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={`${theme === 'dark' 
          ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30' 
          : 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20'} 
          backdrop-blur-lg overflow-hidden`}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
            <div className="w-full h-64 bg-gray-700">
              <img
                src="/placeholder.svg"
                alt="Featured Tournament"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 p-6 z-20">
              <Badge className={`${theme === 'dark' ? 'bg-purple-500 text-white' : 'bg-purple-500/80 text-white'} mb-2`}>
                Featured
              </Badge>
              <h2 className={`text-2xl font-bold text-white mb-1`}>
                CS2 Championship 2023
              </h2>
              <p className="text-gray-300">The biggest Counter-Strike event this month</p>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-500/10'} rounded-full flex items-center justify-center`}>
                  <Calendar className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
                </div>
                <div>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs`}>Date & Time</p>
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>Oct 21, 2023 • 7:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-500/10'} rounded-full flex items-center justify-center`}>
                  <Users className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
                </div>
                <div>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs`}>Participants</p>
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>32 Teams (5v5)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-500/10'} rounded-full flex items-center justify-center`}>
                  <Trophy className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
                </div>
                <div>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs`}>Prize Pool</p>
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>$1,000</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <Button className={`${theme === 'dark' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'} text-white`}>
                Register Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'} p-1`}>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-purple-500">
              <Calendar className="w-4 h-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="ongoing" className="data-[state=active]:bg-purple-500">
              <Clock className="w-4 h-4 mr-2" />
              Ongoing
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-purple-500">
              <Medal className="w-4 h-4 mr-2" />
              Past
            </TabsTrigger>
            <TabsTrigger value="my-tournaments" className="data-[state=active]:bg-purple-500">
              <Star className="w-4 h-4 mr-2" />
              My Tournaments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {upcomingTournaments.map((tournament) => (
                <TournamentCard 
                  key={tournament.id} 
                  tournament={tournament} 
                  theme={theme}
                  type="upcoming"
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ongoing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {ongoingTournaments.map((tournament) => (
                <TournamentCard 
                  key={tournament.id} 
                  tournament={tournament} 
                  theme={theme}
                  type="ongoing"
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {pastTournaments.map((tournament) => (
                <TournamentCard 
                  key={tournament.id} 
                  tournament={tournament} 
                  theme={theme}
                  type="past"
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-tournaments">
            {myTournaments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {myTournaments.map((tournament) => (
                  <Card key={tournament.id} className={`${theme === 'dark' ? 'bg-slate-900/50 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-lg`}>
                    <div className="flex">
                      <div className="w-1/3">
                        <img
                          src={tournament.image}
                          alt={tournament.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-4">
                        <Badge className={`mb-2 ${theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-500/10 text-purple-600'}`}>{tournament.game}</Badge>
                        <h3 className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium mb-2`}>{tournament.title}</h3>
                        <div className="space-y-1 mb-4">
                          <div className="flex justify-between">
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Date</p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{tournament.date}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Status</p>
                            <p className={`text-xs ${tournament.status === "Registered" 
                              ? theme === 'dark' ? 'text-green-400' : 'text-green-600' 
                              : theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                              {tournament.status}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Team</p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{tournament.teamName}</p>
                          </div>
                        </div>
                        <Button size="sm" className={`w-full ${theme === 'dark'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'} text-white`}>
                          {tournament.status === "Registered" ? "View Details" : "View Results"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className={`text-center p-12 mt-6 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                <Star className="mx-auto w-12 h-12 opacity-20 mb-4" />
                <h3 className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium mb-2`}>No Tournaments Yet</h3>
                <p>You haven't registered for any tournaments yet.</p>
                <Button
                  onClick={() => setActiveTab("upcoming")}
                  className={`mt-4 ${theme === 'dark'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'} text-white`}
                >
                  Browse Tournaments
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Rankings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className={`${theme === 'dark' ? 'bg-slate-900/50 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-lg`}>
          <CardHeader>
            <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
              <Medal className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
              Top Players
            </CardTitle>
            <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
              Monthly rankings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((rank) => (
                <div
                  key={rank}
                  className={`flex items-center justify-between p-3 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'} rounded-lg hover:${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'} transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        rank === 1
                          ? "bg-yellow-500/20 text-yellow-400"
                          : rank === 2
                            ? "bg-gray-400/20 text-gray-300"
                            : rank === 3
                              ? "bg-amber-600/20 text-amber-500"
                              : theme === 'dark' ? "bg-white/10 text-gray-400" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {rank}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-500/10'} rounded-full flex items-center justify-center`}>
                        <Users className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
                      </div>
                      <div>
                        <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>Player {rank}</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>CS2, Valorant</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} font-bold`}>{1000 - rank * 50} pts</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>{10 - rank} wins</p>
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

function TournamentCard({ tournament, theme, type }: { tournament: any, theme: string, type: string }) {
  return (
    <Card className={`${theme === 'dark' ? 'bg-slate-900/50 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-lg hover:${theme === 'dark' ? 'border-purple-500/30' : 'border-purple-500/20'} transition-all duration-300 overflow-hidden`}>
      <div className="relative">
        <img
          src={tournament.image}
          alt={tournament.title}
          className="w-full h-40 object-cover"
        />
        <Badge
          className={`absolute top-2 right-2 ${
            type === "upcoming" ? 
              theme === 'dark' ? "bg-green-500/20 text-green-400" : "bg-green-500/10 text-green-600" : 
            type === "ongoing" ? 
              theme === 'dark' ? "bg-blue-500/20 text-blue-400" : "bg-blue-500/10 text-blue-600" :
              theme === 'dark' ? "bg-purple-500/20 text-purple-400" : "bg-purple-500/10 text-purple-600"
          }`}
        >
          {type === "upcoming" ? "Registration Open" : type === "ongoing" ? "In Progress" : "Completed"}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-lg`}>{tournament.title}</CardTitle>
            <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
              {tournament.game}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className={`${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} font-bold`}>{tournament.prize}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`} />
            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{tournament.date}</span>
          </div>
          {type === "ongoing" && (
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`} />
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{tournament.status}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`} />
            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{tournament.participants}</span>
          </div>
          {tournament.entryFee && (
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`} />
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{tournament.entryFee}</span>
            </div>
          )}
          {tournament.winner && (
            <div className="flex items-center gap-2">
              <Trophy className={`w-4 h-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <span className={`${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>{tournament.winner}</span>
            </div>
          )}
        </div>

        <Button
          className={`w-full ${
            type === "upcoming"
              ? theme === 'dark'
                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              : theme === 'dark'
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200"
          } ${type !== "upcoming" ? "" : "text-white"}`}
        >
          {type === "upcoming" ? "Register" : type === "ongoing" ? "View Bracket" : "View Results"}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
