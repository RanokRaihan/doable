export interface LoggedinUser {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  profileStatus: "COMPLETE" | "INCOMPLETE" | "SUSPENDED";
  image?: string;
}
