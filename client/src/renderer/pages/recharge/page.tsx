import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Zap, Gift, CreditCard, User, CheckCircle, Smartphone, Wallet } from "../../components/icons"
import { useTheme } from "../../components/ThemeProvider"

const quickAmounts = [5, 10, 25, 50, 100]
const paymentMethods = [
  { id: "card", name: "Credit Card", icon: CreditCard, color: "blue" },
  { id: "bank", name: "Bank Transfer", icon: Smartphone, color: "cyan" },
  { id: "wallet", name: "MoMo", icon: Wallet, color: "pink" },
]

export default function RechargePage() {
  const [selectedAmount, setSelectedAmount] = useState(25)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const { theme } = useTheme()

  const handleRecharge = async () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
    }, 2000)
  }

  const finalAmount = customAmount ? Number.parseFloat(customAmount) : selectedAmount
  const bonusAmount = finalAmount >= 50 ? finalAmount * 0.1 : finalAmount >= 25 ? finalAmount * 0.05 : 0

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2`}>Recharge Your Account</h1>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Add credits to continue your gaming experience</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Card className={`${theme === 'dark'
          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30'
          : 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20'} 
          backdrop-blur-lg`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} text-sm font-medium`}>Current Balance</p>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>$24.50</p>
              </div>
              <div className="text-right">
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-500'} text-sm`}>Last recharge</p>
                <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className={`${theme === 'dark'
            ? 'bg-slate-900/50 border-white/10'
            : 'bg-white/80 border-slate-200'} 
            backdrop-blur-lg`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                <Zap className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                Add Credits
              </CardTitle>
              <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Choose an amount and payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-3 block`}>Quick Select</Label>
                <div className="grid grid-cols-5 gap-3">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className={`$${
                        selectedAmount === amount
                          ? "bg-cyan-500 hover:bg-cyan-600"
                          : theme === 'dark'
                            ? "border-white/20 text-gray-300 hover:bg-white/10"
                            : "border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                      onClick={() => {
                        setSelectedAmount(amount)
                        setCustomAmount("")
                      }}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="custom-amount" className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2 block`}>
                  Custom Amount
                </Label>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedAmount(0)
                  }}
                  className={`${theme === 'dark' 
                    ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400'
                    : 'bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                />
              </div>
              <div>
                <Label className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-3 block`}>Payment Method</Label>
                <Tabs defaultValue={selectedMethod} onValueChange={setSelectedMethod}>
                  <TabsList className={`w-full ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'}`}>
                    {paymentMethods.map((method) => (
                      <TabsTrigger 
                        key={method.id} 
                        value={method.id} 
                        className={`flex-1 data-[state=active]:bg-${method.color}-500 data-[state=active]:text-white`}
                      >
                        <method.icon className="w-4 h-4 mr-2" />
                        {method.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsContent value="card" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="card-number" className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          Card Number
                        </Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          className={`${theme === 'dark' 
                            ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400'
                            : 'bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="card-name" className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          Cardholder Name
                        </Label>
                        <Input
                          id="card-name"
                          placeholder="John Doe"
                          className={`${theme === 'dark' 
                            ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400'
                            : 'bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          Expiry Date
                        </Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          className={`${theme === 'dark' 
                            ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400'
                            : 'bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          className={`${theme === 'dark' 
                            ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400'
                            : 'bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="bank" className="mt-4 space-y-4">
                    <div>
                      <Label className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2 block`}>
                        Chuyển khoản ngân hàng
                      </Label>
                      <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'}`}>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Ngân hàng:</span>
                            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Vietcombank</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Số tài khoản:</span>
                            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1234567890</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Chủ tài khoản:</span>
                            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>CYBER CAFE</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Nội dung CK:</span>
                            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>CC-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
                          </div>
                        </div>
                      </div>
                      <p className={`mt-3 text-sm ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        Quét QR hoặc chuyển khoản với nội dung chính xác để được cộng tiền tự động
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="wallet" className="mt-4 space-y-4">
                    <div>
                      <Label className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2 block`}>
                        Thanh toán MoMo
                      </Label>
                      <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'}`}>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Số điện thoại:</span>
                            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>0987654321</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Người nhận:</span>
                            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>CYBER CAFE</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Lời nhắn:</span>
                            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>CC-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
                          </div>
                        </div>
                      </div>
                      <p className={`mt-3 text-sm ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`}>
                        Quét mã QR MoMo hoặc chuyển tiền với lời nhắn chính xác
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <Button
                onClick={handleRecharge}
                disabled={isProcessing || (!customAmount && !selectedAmount)}
                className={`w-full ${theme === 'dark' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'} text-white py-3`}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  `Recharge $${finalAmount.toFixed(2)}`
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <Card className={`${theme === 'dark'
            ? 'bg-slate-900/50 border-white/10'
            : 'bg-white/80 border-slate-200'} 
            backdrop-blur-lg`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-lg`}>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-500'}`}>Amount</span>
                <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>${finalAmount.toFixed(2)}</span>
              </div>
              {bonusAmount > 0 && (
                <div className="flex justify-between">
                  <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Bonus Credits</span>
                  <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-medium`}>+${bonusAmount.toFixed(2)}</span>
                </div>
              )}
              <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'} pt-4`}>
                <div className="flex justify-between">
                  <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>Total Credits</span>
                  <span className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} font-bold text-lg`}>${(finalAmount + bonusAmount).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={`${theme === 'dark'
            ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30'
            : 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20'} 
            backdrop-blur-lg`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-lg flex items-center gap-2`}>
                <Gift className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                Bonus Offers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                <div>
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-sm font-medium`}>5% Bonus on $25+</p>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-500'} text-xs`}>Get extra credits</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                <div>
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-sm font-medium`}>10% Bonus on $50+</p>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-500'} text-xs`}>Maximum value</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={`${theme === 'dark'
            ? 'bg-slate-900/50 border-white/10'
            : 'bg-white/80 border-slate-200'} 
            backdrop-blur-lg`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-lg`}>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-sm`}>Recharge</p>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs`}>2 days ago</p>
                </div>
                <Badge className={`${theme === 'dark'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-green-500/10 text-green-600'}`}>
                  +$25.00
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-sm`}>Gaming Session</p>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs`}>3 days ago</p>
                </div>
                <Badge className={`${theme === 'dark'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-red-500/10 text-red-600'}`}>
                  -$12.50
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-sm`}>Food Order</p>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-xs`}>4 days ago</p>
                </div>
                <Badge className={`${theme === 'dark'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-red-500/10 text-red-600'}`}>
                  -$8.75
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
