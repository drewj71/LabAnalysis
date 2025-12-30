import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode } from "jwt-decode";
import type { AuthUser } from "../types/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function decodeUser(token: string): AuthUser {
  const decoded: any = jwtDecode(token);

  return {
    id: decoded.sub,
    email: decoded.email,
    emailConfirmed: decoded.emailConfirmed === "True",
    firstName: decoded.firstName,
    lastName: decoded.lastName,
    isOnboarded: decoded.isOnboarded === "True",
    onboardingStep: decoded.onboardingStep,
  };
}

export const onboardingSteps = [
  {
    id: "profile",
    title: "Profile Setup",
    description: "Complete your profile information.",
    fields: [
      { id: "firstName", label: "First Name", type: "text", required: true },
      { id: "lastName", label: "Last Name", type: "text", required: true },
      { id: "gender", label: "Gender", type: "select", options: ["Male", "Female"], required: true },
      { id: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { id: "height", label: "Height (inches)", type: "number" },
      { id: "weight", label: "Weight (lbs)", type: "number" },
    ],
  },
  {
    id: "medicalInfo",
    title: "Medical Information",
    description: "Provide your medical information.",
    fields: [
      { id: "bloodType", label: "Blood Type", type: "select", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
      { id: "allergies", label: "Allergies", type: "text" },
      { id: "medications", label: "Medications", type: "medication-list" },
      { id: "medicalConditions", label: "Medical Conditions", type: "condition-list" },
    ],
  }, 
  {
    id: "firstUpload",
    title: "Upload First Lab Report",
    description: "Upload your first lab report.",
    fields: [
      { id: "labReport", label: "Lab Report", type: "file" },
    ],
    type: "action",
  }
];