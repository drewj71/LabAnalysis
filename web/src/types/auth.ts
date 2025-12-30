export interface AuthUser {
    id: string;
    email: string;
    emailConfirmed: boolean;
    firstName?: string;
    lastName?: string;
    isOnboarded: boolean;
    onboardingStep: number;
}

export type FieldType = "text" | "number" | "date" | "select" | "file" | "tags";

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // for select or autocomplete suggestions
}

export interface Step {
  id: string;
  title: string;
  description?: string;
  type?: "form" | "action";
  fields: Field[];
}

export interface OnboardingFormProps {
  step: Step;
  defaultValues?: Record<string, any>; 
  onSubmit: (formData: FormData) => void | Promise<void>;
}

export type OnboardingFormValues = {
  // Profile
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: string
  height?: number
  weight?: number

  // Medical
  allergies?: string[]
  medicalConditions?: Condition[]
  medications: Medication[]

  // Upload
  labReport?: File
}

export type Medication = {
  name: string
  dosage?: number
  unit?: "mg" | "mcg" | "g" | "ml"
  frequency?: "Once daily" | "Twice daily" | "As needed"
}


export type Condition = {
  name: string
  status?: "active" | "recovered" | "chronic"
  severity?: "mild" | "moderate" | "severe"
  diagnosisDate?: string
  notes?: string
} 