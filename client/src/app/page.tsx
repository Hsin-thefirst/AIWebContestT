import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, MapPin, Clock, ArrowRight, Activity, User } from "lucide-react"
import Link from "next/link"

const UPCOMING_EVENTS = [
  { id: 1, title: "Web Development Workshop", location: "Room 101, Computer Science Bldg", time: "Today, 14:00 - 16:00", type: "academic" },
  { id: 2, title: "Varsity Basketball Practice", location: "Main Indoor Court", time: "Tomorrow, 18:00 - 20:00", type: "sports" },
  { id: 3, title: "Guest Lecture: AI Ethics", location: "Auditorium A", time: "Friday, 10:00 - 12:00", type: "academic" },
]

const QUICK_SPACES = [
  { id: 's1', name: "Study Room C", capacity: 4, type: "academic", status: "available" },
  { id: 's2', name: "Tennis Court 2", capacity: 4, type: "sports", status: "booked" },
  { id: 's3', name: "Conference Room B", capacity: 20, type: "academic", status: "available" },
]

export default function Dashboard() {
  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, Student</h1>
        <p className="mt-1 text-sm text-gray-500">Here&apos;s an overview of your campus activities and available spaces.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section aria-labelledby="upcoming-events-title">
          <div className="flex items-center justify-between mb-4">
            <h2 id="upcoming-events-title" className="text-xl font-semibold text-gray-900">Your Upcoming Events</h2>
            <Link href="/tickets" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {UPCOMING_EVENTS.map(event => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 ${event.type === 'academic' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{event.title}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="quick-book-title">
          <div className="flex items-center justify-between mb-4">
            <h2 id="quick-book-title" className="text-xl font-semibold text-gray-900">Quick Book</h2>
            <Link href="/booking" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center">
              Browse all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {QUICK_SPACES.map(space => (
              <Card key={space.id} className="flex flex-col justify-between">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{space.name}</CardTitle>
                    <Badge variant={space.status === 'available' ? 'success' : 'secondary'} className="capitalize">
                      {space.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center mt-1">
                    <User className="w-3 h-3 mr-1" />
                    Up to {space.capacity} pax
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-2">
                  <Button 
                    className="w-full" 
                    disabled={space.status !== 'available'}
                    asChild={space.status === 'available'}
                  >
                    {space.status === 'available' ? (
                      <Link href={`/booking?space=${space.id}`}>Book Now</Link>
                    ) : (
                      <span>Unavailable</span>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-primary rounded-2xl p-6 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between shadow-lg">
        <div className="mb-6 sm:mb-0 sm:mr-6">
          <h2 className="text-2xl font-bold mb-2">Flash Sale Active!</h2>
          <p className="text-primary-foreground opacity-90 max-w-xl">
            Exclusive campus events tickets are dropping right now. Limited availability. Secure your spot before they&apos;re gone.
          </p>
        </div>
        <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold whitespace-nowrap" asChild>
          <Link href="/tickets">
            <Activity className="w-4 h-4 mr-2" />
            Join Flash Sale
          </Link>
        </Button>
      </section>
    </div>
  )
}
