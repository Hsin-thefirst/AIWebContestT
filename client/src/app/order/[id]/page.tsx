"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle, CreditCard, Ticket } from "lucide-react"

type OrderState = "PENDING_PAYMENT" | "PROCESSING" | "CONFIRMED" | "FAILED"

export default function OrderStatusPage() {
  const params = useParams()
  const orderId = params.id as string
  const [state, setState] = useState<OrderState>("PENDING_PAYMENT")

  useEffect(() => {
    const timer1 = setTimeout(() => setState("PROCESSING"), 3000)
    const timer2 = setTimeout(() => setState("CONFIRMED"), 7000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const steps = [
    { key: "PENDING_PAYMENT", label: "Payment Required", icon: CreditCard },
    { key: "PROCESSING", label: "Processing Payment", icon: Clock },
    { key: "CONFIRMED", label: "Order Confirmed", icon: CheckCircle2 },
  ]

  const getStepStatus = (stepKey: string) => {
    if (state === "FAILED") return "failed"
    const currentIndex = steps.findIndex(s => s.key === state)
    const stepIndex = steps.findIndex(s => s.key === stepKey)

    if (stepIndex < currentIndex) return "completed"
    if (stepIndex === currentIndex) return "current"
    return "upcoming"
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col items-center justify-center text-center">
        {state === "CONFIRMED" ? (
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
        ) : state === "FAILED" ? (
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <XCircle className="w-12 h-12 text-destructive" />
          </div>
        ) : (
          <div className="bg-blue-100 p-4 rounded-full mb-4 animate-pulse">
            <Clock className="w-12 h-12 text-primary" />
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {state === "CONFIRMED" ? "Booking Confirmed!" : "Processing Order"}
        </h1>
        <p className="mt-2 text-gray-500">Order ID: #{orderId.toUpperCase()}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Status Tracker</CardTitle>
          <CardDescription>Real-time updates on your booking</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200" />

            <div className="space-y-8 relative">
              {steps.map((step) => {
                const status = getStepStatus(step.key)
                const Icon = step.icon

                return (
                  <div key={step.key} className="flex items-start">
                    <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 bg-white transition-colors duration-500 ${
                      status === 'completed' ? 'border-green-500 text-green-500' :
                      status === 'current' ? 'border-primary text-primary animate-pulse shadow-md shadow-primary/20' :
                      status === 'failed' ? 'border-destructive text-destructive' :
                      'border-gray-200 text-gray-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="ml-6 flex-1 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className={`font-semibold text-lg ${
                            status === 'completed' ? 'text-green-700' :
                            status === 'current' ? 'text-primary' :
                            'text-gray-500'
                          }`}>
                            {step.label}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {status === 'completed' ? 'Successfully completed.' :
                             status === 'current' ? 'Currently in progress...' :
                             'Waiting for previous steps.'}
                          </p>
                        </div>
                        {status === 'current' && (
                          <Badge variant="outline" className="mt-2 sm:mt-0 px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                            In Progress
                          </Badge>
                        )}
                        {status === 'completed' && (
                          <Badge variant="outline" className="mt-2 sm:mt-0 px-3 py-1 bg-green-50 text-green-700 border-green-200">
                            Done
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {state === "CONFIRMED" && (
        <Card className="bg-primary/5 border-primary/20 shadow-inner">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Ticket className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-xl">Your Ticket is Ready</CardTitle>
                <CardDescription>A confirmation email has been sent to your student email.</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
