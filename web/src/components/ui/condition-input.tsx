// src/components/medical/MedicationInput.tsx
import { useFieldArray, type Control } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import type { Condition, Medication, OnboardingFormValues  } from "@/types/auth"

type Props = {
    control: Control<OnboardingFormValues>
    name: "medicalConditions"
}

const STATUSES = ["Active", "Recovered", "Chronic"] as const
type Status = (typeof STATUSES)[number]

const SEVERITIES = ["Mild", "Moderate", "Severe"] as const
type Severity = (typeof SEVERITIES)[number]

export default function ConditionInput({ control, name }: Props) {
    const { fields, append, update, remove } = useFieldArray<
        OnboardingFormValues,
        "medicalConditions"
    >({
        control,
        name,
    })

    const [newCondition, setNewCondition] = useState("")

    const addCondition = () => {
        if (!newCondition.trim()) return

        append({
            name: newCondition.trim(),
            status: "active",
            severity: "mild",
            diagnosisDate: new Date().toLocaleDateString(),
        } satisfies Condition)

        setNewCondition("")
    }

    return (
        <div className="space-y-3">
            {/* Add medication */}
            <div className="flex gap-2">
                <Input
                    placeholder="Add condition (e.g. Diabetes)"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
                />
                <Button type="button" onClick={addCondition}>
                    Add
                </Button>
            </div>

            {/* Condition list */}
            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="rounded-lg border p-4 space-y-3 bg-muted/40"
                    >
                        <div className="flex justify-between items-center">
                            <strong>{field.name}</strong>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(index)}
                            >
                                Remove
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <Label>Status</Label>
                                <Select
                                    value={field.status}
                                    onValueChange={(status) =>
                                        update(index, { ...field, status: status as Condition["status"] })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUSES.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Severity</Label>
                                <Select
                                    value={field.severity}
                                    onValueChange={(severity) =>
                                        update(index, { ...field, severity: severity as Condition["severity"] })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SEVERITIES.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Diagnosis Date</Label>
                                <Input
                                    type="date"
                                    value={field.diagnosisDate ?? ""}
                                    onChange={(e) => update(index, { ...field, diagnosisDate: e.target.value })}
                                />
                                
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
