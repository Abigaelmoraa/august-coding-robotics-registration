import { z } from "zod";

export const programOptions = [
  { value: "coding", label: "Coding Program" },
  { value: "robotics", label: "Robotics Program" },
  { value: "coding_robotics", label: "Coding + Robotics (Combined)" },
] as const;

export const levelOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

export const sessionOptions = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
] as const;

export const dayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const registrationSchema = z.object({
  student_full_name: z.string().trim().min(2, "Enter student's full name").max(100),
  parent_name: z.string().trim().min(2, "Enter parent/guardian name").max(100),
  parent_phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[+\d\s()-]+$/, "Invalid phone number"),
  parent_email: z.string().trim().email("Invalid email").max(255),
  student_age: z.coerce.number().int().min(4, "Minimum age is 4").max(19, "Maximum age is 19"),
  student_grade: z.string().trim().min(1, "Enter class/grade").max(50),
  school_name: z.string().trim().min(2, "Enter school name").max(150),
  gender: z.enum(["male", "female", "other", ""]).optional(),
  area_of_residence: z.string().trim().min(2, "Enter area of residence").max(150),
  emergency_contact: z.string().trim().max(50).optional().or(z.literal("")),
  additional_notes: z.string().trim().max(1000).optional().or(z.literal("")),
  program: z.enum(["coding", "robotics", "coding_robotics"]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  session_pref: z.enum(["morning", "afternoon", "evening"]),
  preferred_days: z.array(z.string()).min(1, "Select at least one preferred day"),
  preferred_start_date: z.string().min(1, "Choose a start date"),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
