// This is a mock implementation - in a real app, you would use a proper JWT library
export function getUserFromToken(): {
    user_general_id: string
    name?: string
    email?: string
    position?: string
    department?: string
    avatar?: string
  } {
    // In a real app, you would decode the JWT token from localStorage or cookies
    // const token = localStorage.getItem('token');
    // return decodeJwt(token);
  
    // For demo purposes, we'll return mock data
    return {
      user_general_id: "user-123",
      name: "John Doe",
      email: "john.doe@example.com",
      position: "Senior Developer",
      department: "Engineering",
      avatar: "/placeholder.svg?height=200&width=200",
    }
  }
  
  export function isAuthenticated(): boolean {
    // In a real app, you would check if the token exists and is valid
    // const token = localStorage.getItem('token');
    // return !!token && !isTokenExpired(token);
  
    // For demo purposes, we'll return true
    return true
  }
  