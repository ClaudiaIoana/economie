// src/models/User.ts

export interface User {
    id?: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password?: string;
    description: string;
    rating: number;
    role: string;
    date_joined: string;
    date_of_birth: string;
    skills: string[];       // Array of skill names (or IDs if you prefer)
    preferences: string[];  // Array of preference names (or IDs)
}