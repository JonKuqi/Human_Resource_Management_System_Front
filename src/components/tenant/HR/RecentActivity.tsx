import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
      action: "applied for",
      target: "Senior Developer position",
      time: "2 hours ago",
    },
    {
      id: 2,
      user: {
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "EC",
      },
      action: "requested",
      target: "annual leave",
      time: "4 hours ago",
    },
    {
      id: 3,
      user: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MB",
      },
      action: "completed",
      target: "performance review",
      time: "Yesterday",
    },
    {
      id: 4,
      user: {
        name: "Sarah Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SW",
      },
      action: "signed",
      target: "new contract",
      time: "Yesterday",
    },
  ]

  return (
    <Card className="border-hr-light-gray">
      <CardHeader>
        <CardTitle className="text-hr-darker-blue">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <Avatar className="h-8 w-8 border border-hr-light-gray">
              <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback className="bg-hr-dark-blue text-hr-lightest-gray text-xs">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
                  <span className="font-medium text-hr-dark-blue">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
