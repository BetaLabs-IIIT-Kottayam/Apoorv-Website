// src/config/teamConfig.ts

export interface TeamMemberConfig {
  id: number; // for ordering
  name: string; // should match the image filename
  role?: string; // optional, in case you want to add roles back later
}

export const teamMembers: TeamMemberConfig[] = [
  { id: 1, name: "Abhishek" },
  { id: 2, name: "Anshumohan" , role: "Dev"},
  { id: 3, name: "Trinadh" },
  { id: 4, name: "Shashank" },
];
