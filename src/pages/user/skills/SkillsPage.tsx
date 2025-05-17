"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useTheme } from "../../../context/ThemeContext";  // Shtoji path-in tënd të saktë

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Plus, X, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";

interface SkillDto {
  skillId: number;
  name: string;
  type: string;
}

interface UserSkill {
  userSkillsId: number;
  skill: SkillDto;
  value: number;
  description?: string;
  issuedAt: string;
  validUntil?: string | null;
}

interface JwtPayload {
  userGeneralId?: number;
}

const getToken = () => localStorage.getItem("token");
const getUserGeneralId = (): number | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.user_general_id || null;  // përdor snake_case
  } catch {
    return null;
  }
};

export default function SkillsManagement() {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SkillDto[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<UserSkill | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [skillForm, setSkillForm] = useState({
    skillId: 0,       // Shto skillId këtu
    name: "",
    type: "",
    value: 50,
    description: "",
  });
  
  const token = getToken();
  const userGeneralId = getUserGeneralId();

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const resetForm = () => {
    setSkillForm({ skillId:0, name: "", type: "", value: 50, description: "" });
    setSelectedSkill(null);
    setIsEditMode(false);
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };
  

  useEffect(() => {
    if (!userGeneralId) return;
    fetchUserSkills();
  }, [userGeneralId]);

  async function fetchUserSkills() {
    try {
      const response = await axios.get<UserSkill[]>(
        `http://localhost:8081/api/v1/public/user-skills/filter?userGeneral.userGeneralId=${userGeneralId}`,
        axiosConfig
      );
      setSkills(response.data);
    } catch (error) {
      console.error("Failed to fetch user skills", error);
    }
  }

  const { colors } = useTheme();

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        const response = await axios.get<SkillDto[]>(
          `http://localhost:8081/api/v1/public/skill/search?q=${encodeURIComponent(query)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSearchResults(response.data);
        setShowResults(true);
      } catch (error) {
        console.error("Search failed", error);
        setSearchResults([]);
        setShowResults(false);
      }
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const handleSelectSkill = (skill: SkillDto) => {
    setSelectedSkill({
      userSkillsId: 0,
      skill,
      value: 50,
      description: "",
      issuedAt: new Date().toISOString().slice(0, 10),
      validUntil: null,
    });
    setSkillForm({
      skillId: skill.skillId,   // Kjo është e rëndësishme
      name: skill.name,
      type: skill.type,
      value: 50,
      description: "",
    });
    setShowResults(false);
    setSearchQuery("");
  };
  
  

 

  const handleAddSkill = async () => {
    console.log("handleAddSkill called", skillForm);
    if (!skillForm.name || !skillForm.type || !userGeneralId) {
      console.log("Validation failed:", skillForm, userGeneralId);
      return;
    }
    try {
      let skillId: number | null = null;
      const searchRes = await axios.get<SkillDto[]>(
        `http://localhost:8081/api/v1/public/skill/search?q=${encodeURIComponent(skillForm.name)}`,
        axiosConfig
      );
      const existingSkill = searchRes.data.find(
        (s) => s.name.toLowerCase() === skillForm.name.toLowerCase()
      );

      if (existingSkill) {
        skillId = existingSkill.skillId;
      } else {
        const createSkillRes = await axios.post(
          `http://localhost:8081/api/v1/public/skill`,
          { name: skillForm.name, type: skillForm.type },
          axiosConfig
        );
        skillId = createSkillRes.data.skillId;
      }

      if (!skillId) throw new Error("Failed to get skillId");

      await axios.post(
        `http://localhost:8081/api/v1/public/user-skills`,
        {
          skill: { skillId },
          value: skillForm.value,
          description: skillForm.description,
          userGeneral: { userGeneralId },
          issuedAt: new Date().toISOString().slice(0, 10),
        },
        axiosConfig
      );

      await fetchUserSkills();
      resetForm();
    } catch (error) {
      console.error("Failed to add skill", error);
      alert("Failed to add skill");
    }
  };

  const handleUpdateSkill = async () => {
    if (!selectedSkill) return;
  
    try {
      // Kontrollo në backend nëse ekziston rekord tjetër me këtë userGeneralId + skillId
      const checkRes = await axios.get<UserSkill[]>(
       ` http://localhost:8081/api/v1/public/user-skills/filter?userGeneral.userGeneralId=${userGeneralId}&skill.skillId=${skillForm.skillId}`,
        axiosConfig
      );
  
      // Përjashto rekordin aktual nga rezultati
      const duplicate = checkRes.data.find(
        (us) => us.userSkillsId !== selectedSkill.userSkillsId
      );
  
      await axios.put(
        `http://localhost:8081/api/v1/public/user-skills/${selectedSkill.userSkillsId}/value`,
        {
          skill: { skillId: skillForm.skillId },
          value: skillForm.value,
          description: skillForm.description,
          userGeneral: { userGeneralId },
          issuedAt: selectedSkill.issuedAt,
          validUntil: selectedSkill.validUntil,
        },
        axiosConfig
      );
      await fetchUserSkills();
      resetForm();
    } catch (error) {
      console.error("Failed to update skill", error);
      alert("Failed to update skill");
    }
  };

  const handleDeleteSkill = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8081/api/v1/public/user-skills/${id}`, axiosConfig);
      await fetchUserSkills();
    } catch (error) {
      console.error("Failed to delete skill", error);
      alert("Failed to delete skill");
    }
  };

  const openEditSkill = (userSkill: UserSkill) => {
    setSelectedSkill(userSkill);
    setSkillForm({
      skillId: userSkill.skill.skillId,
      name: userSkill.skill.name,
      type: userSkill.skill.type,
      value: userSkill.value,
      description: userSkill.description || "",
    });
    setIsEditMode(true);
  };

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
                {isEditMode
                  ? "Update your skill information"
                  : "Search for existing skills or add a new one"}
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
                              key={result.skillId}
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

                  {selectedSkill === null && skillForm.name && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{skillForm.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {skillForm.type}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSkillForm({ skillId:0 ,name: "", type: "", value: 50, description: "" })
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button onClick={handleAddSkill}>Test Add Skill</Button>

                      </div>
                    </div>
                  )}
                </div>
              )}

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Form submitted", isEditMode);
                  isEditMode ? handleUpdateSkill() : handleAddSkill();
                }}
              >
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
                  <Input
  id="skill-type"
  placeholder="Enter skill type"
  value={skillForm.type}
  onChange={(e) => setSkillForm({ ...skillForm, type: e.target.value })}
/>

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
                        setIsEditMode(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  )}
             <Button
  type="submit"
  style={{ backgroundColor: colors.primary, color: "white" }}
  className="bg-dark-blue-gray hover:bg-very-dark-blue-gray"
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
                    <div key={skill.userSkillsId} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-dark-blue-gray">{skill.skill.name}</h3>
                          <Badge variant="outline" className="mt-1">
                            {skill.skill.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => openEditSkill(skill)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteSkill(skill.userSkillsId)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the skill "{skill.skill.name}" from your profile.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDeleteSkill(skill.userSkillsId)}
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
