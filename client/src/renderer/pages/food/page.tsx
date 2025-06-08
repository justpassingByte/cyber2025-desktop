import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useTheme } from "../../components/ThemeProvider"
import CustomIcon from "../../components/ui/CustomIcon"
// No longer directly importing requestFoodData or other socket functions for UI-triggered fetch
// import { requestFoodData, onFoodDataReceived, offFoodDataReceived } from "../../../main/services/socket"

// Get ipcRenderer
const ipcRenderer = window.require ? window.require('electron').ipcRenderer : undefined;

interface FoodItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string; // Changed to image_url to match backend
  status: string;
  category?: {
    name: string;
  };
  rating?: number; // Assuming backend will provide this
  prepTime?: string; // Assuming backend will provide this
  popular?: boolean; // Assuming backend will provide this
}

const categories = [
  { id: "all", name: "All Items", icon: "UtensilsCrossed" }, // Using string for CustomIcon
  { id: "drinks", name: "Drinks", icon: "Coffee" },
  { id: "snacks", name: "Snacks", icon: "Popcorn" },
  { id: "meals", name: "Meals", icon: "Burger" },
  { id: "desserts", name: "Desserts", icon: "IceCream" },
]

export default function FoodOrderPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<{ [key: number]: number }>({})
  const [showCart, setShowCart] = useState(false)
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]) // State for real data
  const [loading, setLoading] = useState<boolean>(true) // Loading state
  const { theme } = useTheme()

  useEffect(() => {
    const fetchFoodItems = async () => {
      if (!ipcRenderer) {
        console.error('ipcRenderer is not defined. Cannot fetch food data.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('[Client UI] Invoking food:get-all IPC...');
        const response = await ipcRenderer.invoke('food:get-all');
        console.log('[Client UI] Response from food:get-all IPC:', response);

        if (response.success && response.foods) {
          setFoodItems(response.foods);
        } else {
          console.error('Failed to fetch food items:', response.error);
        }
      } catch (error) {
        console.error('Error during food data fetch via IPC:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []); // Empty dependency array means this runs once on mount

  const filteredItems = foodItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || (item.category && item.category.name.toLowerCase() === selectedCategory.toLowerCase())
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const addToCart = (itemId: number) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }))
  }

  const removeFromCart = (itemId: number) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[itemId] > 1) {
        newCart[itemId]--
      } else {
        delete newCart[itemId]
      }
      return newCart
    })
  }

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0)
  }

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [itemId, count]) => {
      const item = foodItems.find((item) => item.id === Number.parseInt(itemId))
      return sum + (item?.price || 0) * count
    }, 0)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2`}>Order Food & Drinks</h1>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>Fuel your gaming session</p>
        </div>

        {/* Cart Button */}
        <Button
          onClick={() => setShowCart(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 relative"
        >
          <CustomIcon name="ShoppingCart" className="w-4 h-4 mr-2" />
          Cart
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <CustomIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search food and drinks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 ${theme === 'dark' 
              ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' 
              : 'bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
          />
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className={`${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'} p-1`}>
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-cyan-500 flex items-center gap-2"
              >
                <CustomIcon name={category.icon as any} className="w-4 h-4" /> {/* Cast to any temporarily */}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Menu Items Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {loading ? (
          <div className="flex justify-center items-center col-span-full h-64">
            <CustomIcon name="Loader2" className="h-10 w-10 animate-spin text-blue-500" />
            <p className="ml-3 text-lg text-gray-600">Đang tải dữ liệu đồ ăn...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-10 col-span-full text-gray-500">
            <p className="text-xl font-semibold mb-2">Không tìm thấy đồ ăn nào</p>
            <p>Hãy thử tìm kiếm với từ khóa khác hoặc thêm đồ ăn mới.</p>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${theme === 'dark'
                ? 'bg-slate-900/50 border-white/10 hover:border-cyan-500/30'
                : 'bg-white/80 border-slate-200 hover:border-cyan-500/30'} 
                backdrop-blur-lg transition-all duration-300 group`}>
                <div className="relative">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                    width={400}
                    height={192}
                  />
                  {item.popular && (
                    <Badge className="absolute top-2 left-2 bg-orange-500 text-white">
                      <CustomIcon name="Star" className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <CustomIcon name="Star" className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-white text-xs">{item.rating || "N/A"}</span>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-lg`}>{item.name}</CardTitle>
                      <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>{item.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'} font-bold text-lg`}>${item.price}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <CustomIcon name="Clock" className="w-4 h-4" />
                      {item.prepTime || "N/A"}
                    </div>

                    <div className="flex items-center gap-2">
                      {cart[item.id] ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.id)}
                            className={`w-8 h-8 p-0 ${theme === 'dark' 
                              ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                              : 'border-cyan-600/30 text-cyan-700 hover:bg-cyan-500/10'}`}
                          >
                            <CustomIcon name="Minus" className="w-4 h-4" />
                          </Button>
                          <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium w-8 text-center`}>{cart[item.id]}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToCart(item.id)}
                            className={`w-8 h-8 p-0 ${theme === 'dark' 
                              ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                              : 'border-cyan-600/30 text-cyan-700 hover:bg-cyan-500/10'}`}
                          >
                            <CustomIcon name="Plus" className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => addToCart(item.id)}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                        >
                          <CustomIcon name="Plus" className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className={`absolute right-0 top-0 h-full w-full max-w-md ${theme === 'dark'
                ? 'bg-slate-900 border-l border-white/10'
                : 'bg-white border-l border-slate-200'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Your Order</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowCart(false)}
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                    <CustomIcon name="X" className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                  {Object.entries(cart).map(([itemId, count]) => {
                    const item = foodItems.find((item) => item.id === Number.parseInt(itemId))
                    if (!item) return null

                    return (
                      <div key={itemId} className={`flex items-center gap-3 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-lg p-3`}>
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                          width={48}
                          height={48}
                        />
                        <div className="flex-1">
                          <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium`}>{item.name}</p>
                          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'} text-sm`}>${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.id)}
                            className={`w-8 h-8 p-0 ${theme === 'dark' 
                              ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                              : 'border-cyan-600/30 text-cyan-700 hover:bg-cyan-500/10'}`}
                          >
                            <CustomIcon name="Minus" className="w-4 h-4" />
                          </Button>
                          <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium w-8 text-center`}>{count}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToCart(item.id)}
                            className={`w-8 h-8 p-0 ${theme === 'dark' 
                              ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                              : 'border-cyan-600/30 text-cyan-700 hover:bg-cyan-500/10'}`}
                          >
                            <CustomIcon name="Plus" className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}

                  {Object.keys(cart).length === 0 && (
                    <div className="text-center py-8">
                      <CustomIcon name="ShoppingCart" className={`w-12 h-12 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'} mx-auto mb-4`} />
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Your cart is empty</p>
                    </div>
                  )}
                </div>

                {Object.keys(cart).length > 0 && (
                  <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'} pt-4 space-y-4`}>
                    <div className="flex justify-between">
                      <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Total ({getTotalItems()} items)</span>
                      <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-bold`}>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                      Place Order
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
