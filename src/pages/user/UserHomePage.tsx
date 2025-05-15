"use client"

import { Link } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Briefcase, Star, User } from "lucide-react"

const UserHomePage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <section className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-dark-blue-gray mb-4">
          Welcome to Your HR Management Dashboard
        </h1>
        <p className="text-very-dark-blue-gray text-lg mb-8">
          Manage your professional profile, skills, and job applications all in one place.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* JOBS */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-dark-blue-gray text-white">
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Job Listings
              </CardTitle>
              <CardDescription className="text-lighter-gray">Post and manage job opportunities</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">Create and manage job listings for your company.</p>
              <Link to="/user/joblist">
                <Button className="w-full bg-dark-blue-gray hover:bg-very-dark-blue-gray">
                  Post Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* SKILLS */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-dark-blue-gray text-white">
              <CardTitle className="flex items-center">
                <Star className="mr-2 h-5 w-5" />
                Skills Management
              </CardTitle>
              <CardDescription className="text-lighter-gray">Showcase your professional skills</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">Add, update, and manage your professional skills.</p>
              <Link to="/user/skills">
                <Button className="w-full bg-dark-blue-gray hover:bg-very-dark-blue-gray">
                  Manage Skills
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* PROFILE */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-dark-blue-gray text-white">
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription className="text-lighter-gray">Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">Keep your profile information up to date.</p>
              <Link to="/user/profile">
                <Button className="w-full bg-dark-blue-gray hover:bg-very-dark-blue-gray">
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-dark-blue-gray mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="p-4 border-l-4 border-dark-blue-gray bg-almost-white">
            <h3 className="font-medium">Profile Updated</h3>
            <p className="text-sm text-gray-600">You updated your profile information yesterday</p>
          </div>
          <div className="p-4 border-l-4 border-dark-blue-gray bg-almost-white">
            <h3 className="font-medium">New Skill Added</h3>
            <p className="text-sm text-gray-600">You added "Project Management" to your skills</p>
          </div>
          <div className="p-4 border-l-4 border-dark-blue-gray bg-almost-white">
            <h3 className="font-medium">Job Application</h3>
            <p className="text-sm text-gray-600">You applied for "Senior Developer" position</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default UserHomePage;
