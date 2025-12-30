// src/pages/Onboarding.tsx
import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import OnboardingForm from "@/components/authentication/OnboardingForm";
import { onboardingSteps } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import api from "@/api";
import type { Step } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";

const Onboarding: React.FC = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [currentStepIndex, setCurrentStepIndex] = useState(user ? user.onboardingStep : 0);
    const currentStep = onboardingSteps[currentStepIndex] as Step;

    const handleStepSubmit = async (formData: FormData) => {
        try {
            var endpoint = currentStepIndex < 2 ? `/user/onboarding/${currentStep.id}` : `/lab/upload-lab`;
            await api.post(endpoint, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setUser({ ...user!, onboardingStep: currentStepIndex + 1 });
            const nextIndex = currentStepIndex + 1;
            if (nextIndex < onboardingSteps.length) {
                setCurrentStepIndex(nextIndex);
            } else {
                setUser({ ...user!, isOnboarded: true });
                navigate({ to: "/dashboard" });
            }
        } catch (error) {
            console.error("Failed to submit onboarding step:", error);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-12 px-4">
            <h1 className="text-2xl font-bold mb-2">{currentStep.title}</h1>
            {currentStep.description && <p className="text-muted-foreground mb-4">{currentStep.description}</p>}

            <Progress value={((currentStepIndex) / onboardingSteps.length) * 100} className="mb-6" />

            <OnboardingForm step={currentStep} onSubmit={handleStepSubmit} />
        </div>
    );
};

export default Onboarding;
