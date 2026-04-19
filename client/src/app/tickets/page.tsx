"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Timer, Ticket, MapPin, Users, AlertCircle } from "lucide-react"

export default function TicketSalePage() {
  const [stock, setStock] = useState(150)
  const [timeLeft, setTimeLeft] = useState(3600)
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsLive(false)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const stockPoll = setInterval(() => {
      setStock(prev => {
        if (prev <= 0) return 0
        const drop = Math.floor(Math.random() * 3)
        return prev - drop
      })
    }, 3000)

    return () => {
      clearInterval(timer)
      clearInterval(stockPoll)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const progressPercentage = (stock / 150) * 100

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center space-y-4">
        <Badge variant={isLive && stock > 0 ? "destructive" : "secondary"} className="animate-pulse px-4 py-1 text-sm">
          {isLive && stock > 0 ? "LIVE FLASH SALE" : "SALE ENDED"}
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Spring Music Festival</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          The biggest campus event of the year. Grab your tickets before they sell out!
        </p>
      </div>

      <Card className="overflow-hidden border-2 border-primary/10 shadow-xl">
        <div className="bg-primary p-6 text-primary-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 rounded-full">
              <Timer className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-foreground/80 uppercase tracking-wider">Sale ends in</p>
              <p className="text-4xl font-mono font-bold">{formatTime(timeLeft)}</p>
            </div>
          </div>
          
          <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/20 backdrop-blur-sm text-center">
            <p className="text-sm font-medium text-primary-foreground/80 uppercase tracking-wider">Available Tickets</p>
            <p className="text-4xl font-bold font-mono tracking-tighter">{stock}</p>
          </div>
        </div>

        <CardContent className="p-8">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className={stock < 20 ? "text-destructive" : "text-gray-600"}>
                  {stock < 20 ? "Almost sold out!" : "Selling fast"}
                </span>
                <span className="text-gray-600">{stock} / 150 left</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ease-out rounded-full ${
                    stock < 20 ? "bg-destructive" : "bg-primary"
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Main Campus Amphitheater</p>
                  <p className="text-sm text-gray-500">Enter via North Gate</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">General Admission</p>
                  <p className="text-sm text-gray-500">Free seating arrangement</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-8 pt-0 flex flex-col items-stretch gap-4">
          <Button 
            size="lg" 
            className="w-full text-lg h-14"
            disabled={!isLive || stock <= 0}
            onClick={() => window.location.href = '/order/ticket-123'}
          >
            <Ticket className="w-5 h-5 mr-2" />
            {stock <= 0 ? "Sold Out" : "Buy Ticket Now"}
          </Button>
          
          <p className="text-xs text-center text-gray-500 flex items-center justify-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            Maximum 2 tickets per student ID. Non-transferable.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
