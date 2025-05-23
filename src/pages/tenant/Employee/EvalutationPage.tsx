"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, Star, User } from 'lucide-react'
import axios from "axios"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"

interface Colleague {
  id: string
  name: string
  position: string
  department: string
  avatar?: string
}

interface EvaluationQuestion {
  id: string
  text: string
  type: "rating" | "text"
}

interface PendingEvaluation {
  id: string
  colleague: Colleague
  dueDate: string
}

interface CompletedEvaluation {
  id: string
  colleague: Colleague
  submittedDate: string
  overallRating: number
}

export default function EvaluationPage() {
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedColleague, setSelectedColleague] = useState<Colleague | null>(null)
  const [pendingEvaluations, setPendingEvaluations] = useState<PendingEvaluation[]>([])
  const [completedEvaluations, setCompletedEvaluations] = useState<CompletedEvaluation[]>([])
  const [questions, setQuestions] = useState<EvaluationQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string | number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    // Simulate fetching pending evaluations
    const mockPendingEvaluations: PendingEvaluation[] = [
      {
        id: "1",
        colleague: {
          id: "101",
          name: "Michael Chen",
          position: "Frontend Developer",
          department: "Engineering",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        dueDate: "2025-06-01",
      },
      {
        id: "2",
        colleague: {
          id: "102",
          name: "Emily Rodriguez",
          position: "UX Designer",
          department: "Design",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        dueDate: "2025-06-05",
      },
    ]
    setPendingEvaluations(mockPendingEvaluations)

    // Simulate fetching completed evaluations
    const mockCompletedEvaluations: CompletedEvaluation[] = [
      {
        id: "3",
        colleague: {
          id: "103",
          name: "Sarah Johnson",
          position: "HR Manager",
          department: "Human Resources",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        submittedDate: "2025-05-15",
        overallRating: 4.5,
      },
    ]
    setCompletedEvaluations(mockCompletedEvaluations)

    // Simulate fetching evaluation questions
    const mockQuestions: EvaluationQuestion[] = [
      { id: "q1", text: "How well does this person communicate with team members?", type: "rating" },
      { id: "q2", text: "How would you rate this person's technical skills?", type: "rating" },
      { id: "q3", text: "How well does this person meet deadlines?", type: "rating" },
      { id: "q4", text: "How would you rate this person's problem-solving abilities?", type: "rating" },
      { id: "q5", text: "What are this person's strengths?", type: "text" },
      { id: "q6", text: "What areas could this person improve in?", type: "text" },
      { id: "q7", text: "Additional comments or feedback:", type: "text" },
    ]
    setQuestions(mockQuestions)
  }, [])

  const handleColleagueSelect = (evaluation: PendingEvaluation) => {
    setSelectedColleague(evaluation.colleague)
    // Reset answers when selecting a new colleague
    setAnswers({})
  }

  const handleAnswerChange = (questionId: string, value: string | number) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    })
  }

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredQuestions = questions.filter(
      (q) => !(q.id in answers) || (typeof answers[q.id] === "string" && !answers[q.id])
    )
    
    if (unansweredQuestions.length > 0) {
      toast.error("Please answer all questions before submitting")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // In a real app, you would submit the evaluation to the server
      // await axios.post("/api/evaluations", {
      //   colleagueId: selectedColleague?.id,
      //   answers,
      // })
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Update UI
      if (selectedColleague) {
        // Remove from pending
        setPendingEvaluations(pendingEvaluations.filter(
          (pendingEval) => pendingEval.colleague.id !== selectedColleague.id
        ))
        
        // Add to completed
        const avgRating = Object.entries(answers)
          .filter(([key, value]) => questions.find(q => q.id === key)?.type === "rating")
          .reduce((sum, [_, value]) => sum + (Number(value) || 0), 0) / 
          questions.filter(q => q.type === "rating").length
        
        setCompletedEvaluations([
          ...completedEvaluations,
          {
            id: Date.now().toString(),
            colleague: selectedColleague,
            submittedDate: new Date().toISOString().split("T")[0],
            overallRating: parseFloat(avgRating.toFixed(1)),
          },
        ])
      }
      
      toast.success("Evaluation submitted successfully")
      setSelectedColleague(null)
      setAnswers({})
      setActiveTab("completed")
    } catch (error) {
      console.error("Error submitting evaluation:", error)
      toast.error("Failed to submit evaluation. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-employee-darker-blue mb-6">Peer Evaluations</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending">
            Pending Evaluations
            {pendingEvaluations.length > 0 && (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {pendingEvaluations.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed Evaluations
            {completedEvaluations.length > 0 && (
              <span className="ml-2 rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">
                {completedEvaluations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {selectedColleague ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={selectedColleague.avatar || "/placeholder.svg"} alt={selectedColleague.name} />
                      <AvatarFallback>{selectedColleague.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedColleague.name}</CardTitle>
                      <CardDescription>
                        {selectedColleague.position} • {selectedColleague.department}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedColleague(null)}>
                    Back to List
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {questions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <Label htmlFor={question.id}>{question.text}</Label>
                      
                      {question.type === "rating" ? (
                        <RadioGroup
                          id={question.id}
                          value={answers[question.id]?.toString() || ""}
                          onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
                          className="flex space-x-2"
                        >
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <div key={rating} className="flex flex-col items-center">
                              <RadioGroupItem
                                value={rating.toString()}
                                id={`${question.id}-${rating}`}
                                className="sr-only"
                              />
                              <Label
                                htmlFor={`${question.id}-${rating}`}
                                className={`flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-md border-2 ${
                                  answers[question.id] === rating
                                    ? "border-employee-dark-blue bg-employee-dark-blue/10"
                                    : "border-muted hover:border-employee-dark-blue/50"
                                }`}
                              >
                                <span className="text-lg font-medium">{rating}</span>
                                <span className="text-[10px] text-muted-foreground">
                                  {rating === 1
                                    ? "Poor"
                                    : rating === 2
                                    ? "Fair"
                                    : rating === 3
                                    ? "Good"
                                    : rating === 4
                                    ? "Great"
                                    : "Excellent"}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      ) : (
                        <Textarea
                          id={question.id}
                          value={(answers[question.id] as string) || ""}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          rows={4}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedColleague(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Evaluation"}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingEvaluations.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Check className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-xl font-medium">All caught up!</h3>
                    <p className="text-muted-foreground">
                      You have no pending evaluations to complete.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pendingEvaluations.map((evaluation) => (
                  <Card key={evaluation.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage
                              src={evaluation.colleague.avatar || "/placeholder.svg"}
                              alt={evaluation.colleague.name}
                            />
                            <AvatarFallback>{evaluation.colleague.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{evaluation.colleague.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {evaluation.colleague.position} • {evaluation.colleague.department}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-4">
                            <p className="text-sm font-medium">Due: {formatDate(evaluation.dueDate)}</p>
                            <p
                              className={`text-xs ${
                                getDaysRemaining(evaluation.dueDate) < 3
                                  ? "text-red-500"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {getDaysRemaining(evaluation.dueDate)} days remaining
                            </p>
                          </div>
                          <Button onClick={() => handleColleagueSelect(evaluation)}>
                            Start Evaluation
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="space-y-4">
            {completedEvaluations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <User className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium">No completed evaluations</h3>
                  <p className="text-muted-foreground">
                    You haven't completed any peer evaluations yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedEvaluations.map((evaluation) => (
                <Collapsible key={evaluation.id}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage
                              src={evaluation.colleague.avatar || "/placeholder.svg"}
                              alt={evaluation.colleague.name}
                            />
                            <AvatarFallback>{evaluation.colleague.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{evaluation.colleague.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {evaluation.colleague.position} • {evaluation.colleague.department}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-4">
                            <p className="text-sm font-medium">
                              Submitted: {formatDate(evaluation.submittedDate)}
                            </p>
                            <div className="flex justify-end">
                              {renderStars(evaluation.overallRating)}
                            </div>
                          </div>
                          <CollapsibleTrigger asChild>
                            <Button variant="outline" size="sm">
                              <ChevronDown className="h-4 w-4" />
                              <span className="sr-only">Toggle details</span>
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </div>
                      
                      <CollapsibleContent>
                        <Separator className="my-4" />
                        <div className="space-y-4 pt-2">
                          <p className="text-sm text-muted-foreground">
                            This evaluation has been submitted and cannot be modified.
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium">Communication</h4>
                              {renderStars(4)}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Technical Skills</h4>
                              {renderStars(5)}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Meeting Deadlines</h4>
                              {renderStars(4)}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Problem Solving</h4>
                              {renderStars(5)}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Strengths</h4>
                            <p className="text-sm mt-1">
                              Excellent communication skills and technical expertise. Always willing to help team members.
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Areas for Improvement</h4>
                            <p className="text-sm mt-1">
                              Could improve on documentation and knowledge sharing.
                            </p>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </CardContent>
                  </Card>
                </Collapsible>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}