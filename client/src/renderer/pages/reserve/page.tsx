import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Monitor, Clock, User, Cpu, Memory, HardDrive, CheckCircle, X, AlertCircle } from "../../components/icons"
import { useTheme } from "../../components/ThemeProvider"

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
]

const pcStations = [
  { id: 1, status: "available", type: "Gaming Pro", specs: "RTX 4080, i9-13900K, 32GB RAM", price: 8.5 },
  { id: 2, status: "occupied", type: "Gaming Pro", specs: "RTX 4080, i9-13900K, 32GB RAM", price: 8.5 },
  { id: 3, status: "available", type: "Gaming Elite", specs: "RTX 4090, i9-13900K, 64GB RAM", price: 12.0 },
  { id: 4, status: "maintenance", type: "Gaming Standard", specs: "RTX 4070, i7-13700K, 16GB RAM", price: 6.0 },
  { id: 5, status: "available", type: "Gaming Standard", specs: "RTX 4070, i7-13700K, 16GB RAM", price: 6.0 },
  { id: 6, status: "occupied", type: "Gaming Pro", specs: "RTX 4080, i9-13900K, 32GB RAM", price: 8.5 },
  { id: 7, status: "available", type: "Gaming Elite", specs: "RTX 4090, i9-13900K, 64GB RAM", price: 12.0 },
  { id: 8, status: "available", type: "Gaming Standard", specs: "RTX 4070, i7-13700K, 16GB RAM", price: 6.0 },
  { id: 9, status: "reserved", type: "Gaming Pro", specs: "RTX 4080, i9-13900K, 32GB RAM", price: 8.5 },
  { id: 10, status: "available", type: "Gaming Elite", specs: "RTX 4090, i9-13900K, 64GB RAM", price: 12.0 },
  { id: 11, status: "available", type: "Gaming Standard", specs: "RTX 4070, i7-13700K, 16GB RAM", price: 6.0 },
  { id: 12, status: "occupied", type: "Gaming Pro", specs: "RTX 4080, i9-13900K, 32GB RAM", price: 8.5 },
]

export default function ReservePage() {
  const [selectedStation, setSelectedStation] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedTime, setSelectedTime] = useState("")
  const [duration, setDuration] = useState(2)
  const { theme } = useTheme()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/20 border-green-500/50 text-green-400"
      case "occupied":
        return "bg-red-500/20 border-red-500/50 text-red-400"
      case "reserved":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
      case "maintenance":
        return "bg-gray-500/20 border-gray-500/50 text-gray-400"
      default:
        return "bg-gray-500/20 border-gray-500/50 text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-4 h-4" />
      case "occupied":
        return <User className="w-4 h-4" />
      case "reserved":
        return <Clock className="w-4 h-4" />
      case "maintenance":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <X className="w-4 h-4" />
    }
  }

  const selectedStationData = pcStations.find((station) => station.id === selectedStation)
  const totalCost = selectedStationData ? selectedStationData.price * duration : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2`}>Reserve a Gaming Station</h1>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Choose your perfect gaming setup</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Station Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className={`${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-lg border-white/10' : 'bg-white/80 border-slate-200 backdrop-blur-lg'}`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                <Monitor className="w-5 h-5 text-cyan-400" />
                Gaming Stations
              </CardTitle>
              <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Select an available station</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-lg" style={{background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}}>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm" style={{color: theme === 'dark' ? '#d1fae5' : '#166534'}}>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm" style={{color: theme === 'dark' ? '#fecaca' : '#991b1b'}}>Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm" style={{color: theme === 'dark' ? '#fef9c3' : '#a16207'}}>Reserved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <span className="text-sm" style={{color: theme === 'dark' ? '#d1d5db' : '#374151'}}>Maintenance</span>
                </div>
              </div>

              {/* Station Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pcStations.map((station) => (
                  <motion.div key={station.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedStation === station.id
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : station.status === "available"
                            ? theme === 'dark' ? 'border-white/20 hover:border-cyan-500/50 bg-white/5' : 'border-slate-200 hover:border-cyan-500/50 bg-slate-100/50'
                            : 'border-white/10 bg-white/5 opacity-60 cursor-not-allowed'
                      }`}
                      onClick={() => {
                        if (station.status === "available") {
                          setSelectedStation(station.id)
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="text-center space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`${theme === 'dark' ? 'text-white font-medium' : 'text-slate-900 font-medium'}`}>PC #{station.id}</span>
                            <Badge className={getStatusColor(station.status)}>{getStatusIcon(station.status)}</Badge>
                          </div>
                          <p className="text-xs text-gray-400">{station.type}</p>
                          <p className="text-cyan-400 font-bold">${station.price}/hr</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reservation Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Selected Station Info */}
          {selectedStationData && (
            <Card className={`${theme === 'dark' ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30' : 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20 bg-white/80 border-slate-200'} backdrop-blur-lg`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-lg`}>Selected Station</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-500/10'} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Monitor className={`w-8 h-8 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  </div>
                  <h3 className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-bold text-lg`}>PC #{selectedStationData.id}</h3>
                  <p className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>{selectedStationData.type}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Cpu className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>High-end CPU</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Memory className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>Fast RAM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>SSD Storage</span>
                  </div>
                </div>

                <div className={`text-center pt-2 border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                  <p className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} font-bold text-xl`}>${selectedStationData.price}/hour</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Booking Form */}
          <Card className={`${theme === 'dark' ? 'bg-slate-900/50 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-lg`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-lg`}>Reservation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date" className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={`${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                />
              </div>

              <div>
                <Label className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Time Slot</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      className={
                        selectedTime === time
                          ? `${theme === 'dark' ? 'bg-cyan-500 hover:bg-cyan-600 text-white' : 'bg-cyan-600 hover:bg-cyan-700 text-white'}`
                          : `${theme === 'dark' ? 'border-white/20 text-gray-300 hover:bg-white/10' : 'border-slate-200 text-slate-700 hover:bg-slate-200'}`
                      }
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="duration" className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="8"
                  value={duration}
                  onChange={(e) => setDuration(Number.parseInt(e.target.value) || 1)}
                  className={`${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                />
              </div>

              {/* Cost Summary */}
              {selectedStationData && (
                <div className={`space-y-2 pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className={`${theme === 'dark' ? 'flex justify-between text-gray-300' : 'flex justify-between text-slate-700'}`}>
                    <span>Rate per hour</span>
                    <span>${selectedStationData.price}</span>
                  </div>
                  <div className={`${theme === 'dark' ? 'flex justify-between text-gray-300' : 'flex justify-between text-slate-700'}`}>
                    <span>Duration</span>
                    <span>{duration} hours</span>
                  </div>
                  <div className={`${theme === 'dark' ? 'flex justify-between text-white font-bold text-lg' : 'flex justify-between text-slate-900 font-bold text-lg'}`}>
                    <span>Total Cost</span>
                    <span className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <Button
                disabled={!selectedStation || !selectedTime}
                className={`w-full ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'} text-white disabled:opacity-50`}
              >
                Reserve Station
              </Button>
            </CardContent>
          </Card>

          {/* Current Reservations */}
          <Card className={`${theme === 'dark' ? 'bg-slate-900/50 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-lg`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-lg`}>Your Reservations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className={`${theme === 'dark' ? 'flex items-center justify-between p-3 bg-white/5 rounded-lg' : 'flex items-center justify-between p-3 bg-slate-100 rounded-lg'}`}>
                <div>
                  <p className={`${theme === 'dark' ? 'text-white font-medium' : 'text-slate-900 font-medium'}`}>PC #7</p>
                  <p className={`${theme === 'dark' ? 'text-gray-400 text-sm' : 'text-slate-500 text-sm'}`}>Today, 14:00 - 16:00</p>
                </div>
                <Badge className={`${theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-500/10 text-green-600'}`}>Active</Badge>
              </div>
              <div className={`${theme === 'dark' ? 'flex items-center justify-between p-3 bg-white/5 rounded-lg' : 'flex items-center justify-between p-3 bg-slate-100 rounded-lg'}`}>
                <div>
                  <p className={`${theme === 'dark' ? 'text-white font-medium' : 'text-slate-900 font-medium'}`}>PC #3</p>
                  <p className={`${theme === 'dark' ? 'text-gray-400 text-sm' : 'text-slate-500 text-sm'}`}>Tomorrow, 18:00 - 20:00</p>
                </div>
                <Badge className={`${theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-500/10 text-yellow-600'}`}>Upcoming</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
