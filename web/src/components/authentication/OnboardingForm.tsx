// src/components/OnboardingForm.tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import TagInput from "@/components/ui/tag-input";
import type { OnboardingFormProps } from "@/types/auth";

const OnboardingForm: React.FC<OnboardingFormProps> = ({ step, defaultValues = {}, onSubmit }) => {
  const { handleSubmit, control, setValue, register, formState: { errors }, watch } = useForm({ defaultValues });

  const handleFormSubmit = (values: Record<string, any>) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof FileList) {
        if (value.length > 0) formData.append(key, value[0]);
      } else if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v)); // for tag inputs
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {step.fields.map((field) => {
        // Tag inputs
        if (["allergies", "medications", "medicalConditions"].includes(field.id)) {
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

        // Select inputs
        if (field.type === "select" && field.options) {
          return (
            <div key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              <Controller
                name={field.id}
                control={control}
                rules={{ required: field.required }}
                render={({ field: controllerField }) => (
                  <Select
                    onValueChange={controllerField.onChange}
                    value={controllerField.value || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options!.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors[field.id] && <span className="text-red-500 text-sm">This field is required</span>}
            </div>
          );
        }

        // File input
        if (field.type === "file") {
          return (
            <div key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              <input
                type="file"
                id={field.id}
                {...register(field.id, { required: field.required })}
                className="mt-1 block w-full text-sm"
              />
              {errors[field.id] && <span className="text-red-500 text-sm">This field is required</span>}
            </div>
          );
        }

        // Regular text/number/date input
        return (
          <div key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.id, { required: field.required })}
            />
            {errors[field.id] && <span className="text-red-500 text-sm">This field is required</span>}
          </div>
        );
      })}

      <Button type="submit">Next</Button>
    </form>
  );
};

export default OnboardingForm;
