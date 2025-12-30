// src/components/OnboardingForm.tsx
import React from "react";
import { useForm, Controller, type Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import TagInput from "@/components/ui/tag-input";
import type { OnboardingFormProps } from "@/types/auth";
import MedicationInput from "@/components/ui/medication-input";
import type { OnboardingFormValues } from "@/types/auth";
import ConditionInput from "../ui/condition-input";

const OnboardingForm: React.FC<OnboardingFormProps> = ({ step, defaultValues = {}, onSubmit }) => {
  const {
    handleSubmit,
    control,
    setValue,
    register,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    defaultValues,
  })

  const handleFormSubmit = (values: Record<string, any>) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      // File upload
      if (value instanceof FileList) {
        if (value.length > 0) {
          formData.append(key, value[0]);
        }
        return;
      }

      // Medications → normalize dosage
      if (key === "medications" && Array.isArray(value)) {
        const normalized = value.map((m) => ({
          ...m,
          dosage:
            m.dosage && m.unit
              ? `${m.dosage} ${m.unit}`
              : m.dosage ?? null,
        }));

        formData.append("MedicationsJson", JSON.stringify(normalized));
        return;
      }

      // Medical Conditions
      if (key === "medicalConditions" && Array.isArray(value)) {
        formData.append("MedicalConditionsJson", JSON.stringify(value));
        return;
      }

      // String arrays (allergies)
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
        return;
      }

      // Primitives
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {step.fields.map((field) => {
        const name = field.id as Path<OnboardingFormValues>;
        // Tag inputs
        if (["allergies"].includes(field.id)) {
          return (
            <div key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              <TagInput
                control={control}
                setValue={setValue}
                name={field.id}
                placeholder={`Add ${field.label} and press Enter`}
                suggestions={field.options || []}
              />
            </div>
          );
        }

        // Medication input
        if (field.id === "medications") {
          return (
            <div key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              <MedicationInput control={control} name="medications" />
            </div>
          );
        }

        if (field.id === "medicalConditions") {
          return (
            <div key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              <ConditionInput control={control} name="medicalConditions" />
            </div>
          );
        }


        // Select inputs
        if (field.type === "select" && (field.id === "gender" || field.id === "bloodType")) {
          return (
            <div key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              <Controller
                name={name}
                control={control}
                rules={{ required: field.required }}
                render={({ field: controllerField }) => {
                  const value =
                    typeof controllerField.value === "string"
                      ? controllerField.value
                      : undefined;

                  return (
                    <Select value={value} onValueChange={controllerField.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options!.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors[name as keyof OnboardingFormValues] && <span className="text-red-500 text-sm">This field is required</span>}
            </div>
          );
        }

        // File input
        if (field.type === "file") {
          return (
            <div key={name}>
              <Label htmlFor={name}>{field.label}</Label>
              <input
                type="file"
                id={name}
                {...register(name, { required: field.required })}
                className="mt-1 block w-full text-sm"
              />
              {errors[name as keyof OnboardingFormValues] && <span className="text-red-500 text-sm">This field is required</span>}
            </div>
          );
        }

        // Regular text/number/date input
        return (
          <div key={name}>
            <Label htmlFor={name}>{field.label}</Label>
            <Input
              id={name}
              type={field.type}
              placeholder={field.placeholder}
              {...register(name, { required: field.required })}
            />
            {errors[name as keyof OnboardingFormValues] && <span className="text-red-500 text-sm">This field is required</span>}
          </div>
        );
      })}

      <Button type="submit">Next</Button>
    </form>
  );
};

export default OnboardingForm;
