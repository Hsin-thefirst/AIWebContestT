"use client"
import { useState, useMemo } from "react"
import { format, addDays } from "date-fns"
import { CalendarIcon, MapPin, Users, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const SPACES = [
  { id: '1', name: "Lecture Hall A", type: "academic", capacity: 100, image: "bg-blue-100", building: "Science Block" },
  { id: '2', name: "Tennis Court 1", type: "sports", capacity: 4, image: "bg-green-100", building: "Sports Complex" },
  { id: '3', name: "Study Pod 3B", type: "academic", capacity: 4, image: "bg-blue-50", building: "Library" },
  { id: '4', name: "Main Indoor Arena", type: "sports", capacity: 20, image: "bg-green-50", building: "Sports Complex" },
]

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
]

export default function SpaceBookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedType, setSelectedType] = useState<"all" | "academic" | "sports">("all")
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const unavailableSlots = useMemo(() => {
    const unavailable = new Set<string>();
    TIME_SLOTS.forEach((time, index) => {
      const spaceHash = selectedSpace ? selectedSpace.length : 0;
      const dateHash = selectedDate ? selectedDate.getTime() : 0;
      
      if ((time.length + spaceHash + dateHash + index) % 5 === 0) {
        unavailable.add(time);
      }
    });
    return unavailable;
  }, [selectedSpace, selectedDate]);

  const filteredSpaces = SPACES.filter(s => selectedType === "all" || s.type === selectedType)

  const handleBooking = () => {
    if (!selectedSpace || !selectedSlot) return
    window.location.href = `/order/new?space=${selectedSpace}&date=${format(selectedDate, 'yyyy-MM-dd')}&time=${selectedSlot}`
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Book a Space</h1>
          <p className="mt-1 text-sm text-gray-500">Find and reserve academic rooms or sports facilities.</p>
        </div>
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {(["all", "academic", "sports"] as const).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                selectedType === type ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSpaces.map(space => (
              <Card 
                key={space.id} 
                className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${selectedSpace === space.id ? 'ring-2 ring-primary border-primary' : ''}`}
                onClick={() => { setSelectedSpace(space.id); setSelectedSlot(null); }}
              >
                <div className={`h-32 ${space.image} rounded-t-xl border-b flex items-center justify-center`}>
                  <CalendarIcon className="w-10 h-10 text-gray-400 opacity-50" />
                </div>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{space.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" /> {space.building}
                      </CardDescription>
                    </div>
                    <Badge variant={space.type === "academic" ? "default" : "secondary"}>
                      {space.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-sm text-gray-600 flex items-center">
                  <Users className="w-4 h-4 mr-1.5" /> Capacity: {space.capacity} pax
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
              <CardDescription>Choose when you need the space.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!selectedSpace ? (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-lg border border-dashed">
                  <Info className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Please select a space first to see availability.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-900">Date</label>
                    <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
                      {Array.from({ length: 7 }).map((_, i) => {
                        const date = addDays(new Date(), i)
                        const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedDate(date)}
                            className={`flex flex-col items-center p-3 rounded-lg border min-w-[4.5rem] transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                              isSelected ? 'bg-primary text-white border-primary' : 'bg-white text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            <span className={`text-xs ${isSelected ? 'text-primary-foreground/80' : 'text-gray-500'}`}>
                              {format(date, 'EEE')}
                            </span>
                            <span className="text-lg font-bold mt-1">{format(date, 'd')}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-900">Time Slot</label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map(time => {
                        const isUnavailable = unavailableSlots.has(time)
                        const isSelected = selectedSlot === time
                        return (
                          <button
                            key={time}
                            disabled={isUnavailable}
                            onClick={() => setSelectedSlot(time)}
                            className={`py-2 px-1 text-sm font-medium rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                              isUnavailable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                              isSelected ? 'bg-primary text-white border-primary' : 'bg-white text-gray-900 hover:border-gray-300'
                            }`}
                          >
                            {time}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg" 
                disabled={!selectedSpace || !selectedSlot}
                onClick={handleBooking}
              >
                Continue to Booking
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
