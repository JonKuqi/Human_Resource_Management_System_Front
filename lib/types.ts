export interface Skill {
    id: string
    name: string
    type: string
  }
  
  export interface UserSkill {
    id: string
    skill_id: string
    user_general_id: string
    skill: Skill
    value: string
    issued_at: Date
    valid_until?: Date
  }
  
  export interface User {
    user_general_id: string
    name?: string
    email?: string
    position?: string
    department?: string
    avatar?: string
  }
  