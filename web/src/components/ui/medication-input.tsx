// src/components/medical/MedicationInput.tsx
import { useFieldArray, type Control } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import type { Medication, OnboardingFormValues  } from "@/types/auth"

type Props = {
    control: Control<OnboardingFormValues>
    name: "medications"
}

const FREQUENCIES = ["Once daily", "Twice daily", "As needed"] as const
type Frequency = (typeof FREQUENCIES)[number]

const UNITS = ["mg", "mcg", "g", "ml"] as const
type Unit = (typeof UNITS)[number]

export default function MedicationInput({ control, name }: Props) {
    const { fields, append, update, remove } = useFieldArray<
        OnboardingFormValues,
        "medications"
    >({
        control,
        name,
    })

    const [newMedication, setNewMedication] = useState("")

    const addMedication = () => {
        if (!newMedication.trim()) return

        append({
            name: newMedication.trim(),
            unit: "mg",
            frequency: "Once daily",
        } satisfies Medication)

        setNewMedication("")
    }

    return (
        <div className="space-y-3">
            {/* Add medication */}
            <div className="flex gap-2">
                <Input
                    placeholder="Add medication (e.g. Metformin)"
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMedication())}
                />
                <Button type="button" onClick={addMedication}>
                    Add
                </Button>
            </div>

            {/* Medication list */}
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
                                <Label>Dosage</Label>
                                <Input
                                    type="number"
                                    value={field.dosage ?? ""}
                                    onChange={(e) =>
                                        update(index, {
                                            ...field,
                                            dosage: Number(e.target.value),
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Unit</Label>
                                <Select
                                    value={field.unit}
                                    onValueChange={(unit) =>
                                        update(index, { ...field, unit: unit as Unit })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {UNITS.map((u) => (
                                            <SelectItem key={u} value={u}>
                                                {u}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Frequency</Label>
                                <Select
                                    value={field.frequency}
                                    onValueChange={(frequency) =>
                                        update(index, { ...field, frequency: frequency as Frequency })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FREQUENCIES.map((f) => (
                                            <SelectItem key={f} value={f}>
                                                {f}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
