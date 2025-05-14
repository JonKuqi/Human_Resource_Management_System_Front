import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: "Team Meeting",
      date: "May 14, 2025",
      time: "10:00 AM",
      type: "meeting",
    },
    {
      id: 2,
      title: "Interview: Product Designer",
      date: "May 15, 2025",
      time: "2:30 PM",
      type: "interview",
    },
    {
      id: 3,
      title: "Performance Review Deadline",
      date: "May 20, 2025",
      time: "All day",
      type: "deadline",
    },
    {
      id: 4,
      title: "New Employee Orientation",
      date: "May 22, 2025",
      time: "9:00 AM",
      type: "orientation",
    },
  ]

  return (
    <Card className="border-hr-light-gray">
      <CardHeader>
        <CardTitle className="text-hr-darker-blue">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hr-dark-blue/10">
                <Calendar className="h-5 w-5 text-hr-dark-blue" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium leading-none">{event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {event.date} • {event.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
