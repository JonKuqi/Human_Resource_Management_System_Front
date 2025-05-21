"use client";

import { useState, useEffect } from "react";
import {
  ArrowUpDown,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {jwtDecode} from "jwt-decode";

interface EvaluationQuestion {
  evalqid: number;
  questionText: string;
  form: string | null;
}

interface EvaluationAnswer {
  evalid: number;
  form: string | null;
  question: EvaluationQuestion;
  rating: number;
  comment: string;
}

interface EvaluationForm {
  id: number;
  questions: EvaluationQuestion[];
  fromUserTenantId: number;
  toUserTenantId: number;
  status: string;
  createdAt: string; // ISO string
  answers: EvaluationAnswer[];
  fromUserTenant?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  toUserTenant?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}

interface DecodedToken {
  user_tenant_id: number;
  sub: string; // email
  [key: string]: any;
}

export function PerformanceEvaluationList() {
  const [evaluations, setEvaluations] = useState<EvaluationForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    async function fetchEvaluations() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || "";
        if (!token) throw new Error("No token found");

        const decoded: DecodedToken = jwtDecode(token);
        setUserEmail(decoded.sub || "");

        const res = await fetch(
          "http://localhost:8081/api/v1/tenant/evaluation-forms",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch evaluations");

        const data: EvaluationForm[] = await res.json();
        setEvaluations(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch evaluations.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvaluations();
  }, []);

  const filteredEvaluations = evaluations.filter((evaluation) => {
    const employeeName = `${evaluation.toUserTenant?.firstName ?? ""} ${
      evaluation.toUserTenant?.lastName ?? ""
    }`.toLowerCase();

    const matchesSearch = employeeName.includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || evaluation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this evaluation?")) return;

    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(
        `http://localhost:8081/api/v1/tenant/evaluation-forms/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete evaluation");

      setEvaluations((prev) => prev.filter((e) => e.id !== id));
      toast.success("Evaluation deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete evaluation");
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <Input
            placeholder="Search evaluations..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Employee Id</TableHead> {/* ndryshimi ketu */}
                <TableHead>Evaluator</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Loading evaluations...
                  </TableCell>
                </TableRow>
              ) : filteredEvaluations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No evaluations found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell className="font-medium">{evaluation.id}</TableCell>
                    <TableCell>
                      
                      {evaluation.toUserTenantId} 
                    </TableCell>
                    <TableCell>
                      {/* Shfaq emailin e nxjerrë nga token */}
                      {userEmail}
                    </TableCell>
                    <TableCell>Q1</TableCell>
                    <TableCell>{new Date(evaluation.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={evaluation.status === "completed" ? "default" : "outline"}
                        className={
                          evaluation.status === "completed"
                            ? "bg-green-500"
                            : evaluation.status === "in-progress"
                            ? "border-blue-500 text-blue-500"
                            : "border-yellow-500 text-yellow-500"
                        }
                      >
                        {evaluation.status === "completed"
                          ? "Completed"
                          : evaluation.status === "in-progress"
                          ? "In Progress"
                          : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {Array.isArray(evaluation.answers) && evaluation.answers.length > 0 ? (
                        <div className="flex items-center">
                          <span className="font-medium">
                            {(evaluation.answers.reduce((acc, ans) => acc + ans.rating, 0) / evaluation.answers.length).toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">/5</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(evaluation.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Card>
  );
}
