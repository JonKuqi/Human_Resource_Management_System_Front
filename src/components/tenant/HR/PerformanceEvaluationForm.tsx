"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Plus, Trash2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const formSchema = z.object({
  employeeId: z.string({
    required_error: "Please select an employee.",
  }),
  period: z.string({
    required_error: "Please select an evaluation period.",
  }),
  questions: z
    .array(
      z.object({
        question: z.string().min(5, {
          message: "Question must be at least 5 characters.",
        }),
      }),
    )
    .min(1, {
      message: "You must add at least one question.",
    }),
  comments: z.string().optional(),
})

// Sample employees data
const employees = [
  { id: "EMP-001", name: "Alex Johnson" },
  { id: "EMP-002", name: "Sarah Williams" },
  { id: "EMP-003", name: "Michael Brown" },
  { id: "EMP-005", name: "David Wilson" },
  { id: "EMP-006", name: "Jessica Miller" },
]

export function PerformanceEvaluationForm() {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questions: [
        { question: "How well does the employee meet their objectives?" },
        { question: "How would you rate the employee's communication skills?" },
        { question: "How would you rate the employee's teamwork?" },
      ],
      comments: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Here you would typically send the data to your API
    alert("Performance evaluation created successfully!")
  }

  return (
    <Card className="border-hr-light-gray">
      <CardHeader>
        <CardTitle>Performance Evaluation Form</CardTitle>
        <CardDescription>Create a new performance evaluation for an employee.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evaluation Period</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Q1-2025">Q1 2025</SelectItem>
                        <SelectItem value="Q2-2025">Q2 2025</SelectItem>
                        <SelectItem value="Q3-2025">Q3 2025</SelectItem>
                        <SelectItem value="Q4-2025">Q4 2025</SelectItem>
                        <SelectItem value="Annual-2025">Annual 2025</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">Evaluation Questions</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ question: "" })}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Add questions for the evaluation. Each question will be rated on a scale of 1-5.
              </p>

              <Accordion type="single" collapsible className="w-full">
                {fields.map((field, index) => (
                  <AccordionItem key={field.id} value={`item-${index}`}>
                    <AccordionTrigger className="text-sm font-medium">
                      Question {index + 1}: {form.watch(`questions.${index}.question`) || "New Question"}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`questions.${index}.question`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Enter question" {...field} />
                                </FormControl>
                                <FormDescription>This question will be rated on a scale of 1-5.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove question</span>
                        </Button>
                      </div>

                      {selectedQuestion === index && (
                        <div className="mt-4 rounded-md border p-4">
                          <h4 className="mb-2 font-medium">Rating Preview</h4>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-primary">
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                              </div>
                              <span className="text-sm">1 - Poor</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-primary">
                                <div className="h-2 w-2 rounded-full"></div>
                              </div>
                              <span className="text-sm">2 - Below Average</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-primary">
                                <div className="h-2 w-2 rounded-full"></div>
                              </div>
                              <span className="text-sm">3 - Average</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-primary">
                                <div className="h-2 w-2 rounded-full"></div>
                              </div>
                              <span className="text-sm">4 - Good</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-primary">
                                <div className="h-2 w-2 rounded-full"></div>
                              </div>
                              <span className="text-sm">5 - Excellent</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="mt-2"
                        onClick={() => setSelectedQuestion(selectedQuestion === index ? null : index)}
                      >
                        {selectedQuestion === index ? "Hide Preview" : "Show Rating Preview"}
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {fields.length === 0 && (
                <div className="rounded-md border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">No questions added yet.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => append({ question: "" })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional comments or instructions for the evaluator."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>These comments will be visible to the evaluator.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/performance">Cancel</Link>
            </Button>
            <Button type="submit">Create Evaluation</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
