"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Search, Plus, X, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock data for skills
const mockSkills = [
  { id: 1, name: "JavaScript", type: "Technical", value: 85, description: "Modern JavaScript including ES6+ features" },
  { id: 2, name: "React", type: "Technical", value: 90, description: "React.js library and ecosystem" },
  { id: 3, name: "Project Management", type: "Soft Skill", value: 75, description: "Agile project management" },
  { id: 4, name: "Communication", type: "Soft Skill", value: 80, description: "Written and verbal communication" },
]

// Mock data for skill search results
const mockSearchResults = [
  { id: 101, name: "TypeScript", type: "Technical" },
  { id: 102, name: "Node.js", type: "Technical" },
  { id: 103, name: "Express.js", type: "Technical" },
  { id: 104, name: "MongoDB", type: "Technical" },
]

export default function SkillsManagement() {
  const [skills, setSkills] = useState(mockSkills)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<any>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // Form state for adding/editing skills
  const [skillForm, setSkillForm] = useState({
    name: "",
    type: "",
    value: 50,
    description: "",
  })

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 2) {
      // Simulate API call with mock data
      setSearchResults(mockSearchResults.filter((skill) => skill.name.toLowerCase().includes(query.toLowerCase())))
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  // Handle skill selection from search results
  const handleSelectSkill = (skill: any) => {
    setSelectedSkill(skill)
    setSkillForm({
      name: skill.name,
      type: skill.type,
      value: 50,
      description: "",
    })
    setShowResults(false)
    setSearchQuery("")
  }

  // Handle adding a new skill
  const handleAddSkill = () => {
    const newSkill = {
      id: Date.now(), // Use a proper ID in a real application
      name: skillForm.name,
      type: skillForm.type,
      value: skillForm.value,
      description: skillForm.description,
    }

    setSkills([...skills, newSkill])
    resetForm()
  }

  // Handle editing an existing skill
  const handleEditSkill = (skill: any) => {
    setIsEditMode(true)
    setSelectedSkill(skill)
    setSkillForm({
      name: skill.name,
      type: skill.type,
      value: skill.value,
      description: skill.description,
    })
  }

  // Handle updating a skill
  const handleUpdateSkill = () => {
    const updatedSkills = skills.map((skill) => (skill.id === selectedSkill.id ? { ...skill, ...skillForm } : skill))

    setSkills(updatedSkills)
    resetForm()
    setIsEditMode(false)
  }

  // Handle deleting a skill
  const handleDeleteSkill = (id: number) => {
    setSkills(skills.filter((skill) => skill.id !== id))
  }

  // Reset form state
  const resetForm = () => {
    setSkillForm({
      name: "",
      type: "",
      value: 50,
      description: "",
    })
    setSelectedSkill(null)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-dark-blue-gray mb-6">Skills Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Add/Edit Skills */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{isEditMode ? "Edit Skill" : "Add New Skill"}</CardTitle>
              <CardDescription>
                {isEditMode ? "Update your skill information" : "Search for existing skills or add a new one"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isEditMode && (
                <div className="mb-6">
                  <Label htmlFor="skill-search">Search Skills</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="skill-search"
                      placeholder="Type to search skills..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    {showResults && searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                        <ul className="py-1">
                          {searchResults.map((result) => (
                            <li
                              key={result.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSelectSkill(result)}
                            >
                              <div className="font-medium">{result.name}</div>
                              <div className="text-sm text-gray-500">{result.type}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {selectedSkill && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{selectedSkill.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {selectedSkill.type}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedSkill(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skill-name">Skill Name</Label>
                  <Input
                    id="skill-name"
                    placeholder="e.g. JavaScript"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    disabled={isEditMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skill-type">Skill Type</Label>
                  <Select value={skillForm.type} onValueChange={(value) => setSkillForm({ ...skillForm, type: value })}>
                    <SelectTrigger id="skill-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Soft Skill">Soft Skill</SelectItem>
                      <SelectItem value="Language">Language</SelectItem>
                      <SelectItem value="Certification">Certification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="skill-value">Proficiency Level: {skillForm.value}%</Label>
                  </div>
                  <Slider
                    id="skill-value"
                    min={0}
                    max={100}
                    step={5}
                    value={[skillForm.value]}
                    onValueChange={(value) => setSkillForm({ ...skillForm, value: value[0] })}
                    className="py-4"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skill-description">Description</Label>
                  <Textarea
                    id="skill-description"
                    placeholder="Describe your experience with this skill..."
                    value={skillForm.description}
                    onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  {isEditMode && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditMode(false)
                        resetForm()
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="button"
                    className="bg-dark-blue-gray hover:bg-very-dark-blue-gray"
                    onClick={isEditMode ? handleUpdateSkill : handleAddSkill}
                    disabled={!skillForm.name || !skillForm.type}
                  >
                    {isEditMode ? "Update Skill" : "Add Skill"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Skills List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Skills</CardTitle>
              <CardDescription>Manage your professional skills and competencies</CardDescription>
            </CardHeader>
            <CardContent>
              {skills.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't added any skills yet.</p>
                  <Button variant="outline" onClick={() => document.getElementById("skill-name")?.focus()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Skill
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-dark-blue-gray">{skill.name}</h3>
                          <Badge variant="outline" className="mt-1">
                            {skill.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Skill</DialogTitle>
                                <DialogDescription>Update your skill information below.</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-skill-name">Skill Name</Label>
                                  <Input id="edit-skill-name" value={skill.name} disabled />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-skill-type">Skill Type</Label>
                                  <Input id="edit-skill-type" value={skill.type} disabled />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <Label htmlFor="edit-skill-value">Proficiency Level: {skill.value}%</Label>
                                  </div>
                                  <Slider
                                    id="edit-skill-value"
                                    min={0}
                                    max={100}
                                    step={5}
                                    defaultValue={[skill.value]}
                                    className="py-4"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-skill-description">Description</Label>
                                  <Textarea id="edit-skill-description" defaultValue={skill.description} />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  type="button"
                                  className="bg-dark-blue-gray hover:bg-very-dark-blue-gray"
                                  onClick={() => handleEditSkill(skill)}
                                >
                                  Update Skill
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the skill "{skill.name}" from your profile.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDeleteSkill(skill.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      <div className="mt-2">
                        <div className="text-sm text-gray-600 mb-1">Proficiency Level</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-dark-blue-gray h-2.5 rounded-full"
                            style={{ width: `${skill.value}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-xs text-gray-500 mt-1">{skill.value}%</div>
                      </div>

                      {skill.description && (
                        <div className="mt-4 text-sm text-gray-700">
                          <div className="font-medium mb-1">Description:</div>
                          <p>{skill.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
