using LabAnalysisAPI.Models;
using Microsoft.AspNetCore.Identity;
using LabAnalysisAPI.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace LabAnalysisAPI.Services.User
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _dbContext;

        public UserService(UserManager<ApplicationUser> userManager, AppDbContext dbContext)
        {
            _userManager = userManager;
            _dbContext = dbContext;
        }

        public async Task<ApplicationUser?> GetUserByIdAsync(string userId)
        {
            return await _userManager.FindByIdAsync(userId);
        }

        public async Task SubmitOnboardingStepAsync(ApplicationUser user, string stepId, OnboardingStepRequest request)
        {
            var medications = string.IsNullOrWhiteSpace(request.MedicationsJson)
                ? new List<MedicationRequest>()
                : JsonSerializer.Deserialize<List<MedicationRequest>>(
                    request.MedicationsJson,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true, Converters = { new JsonStringEnumConverter() } }
                );

            var conditions = string.IsNullOrWhiteSpace(request.MedicalConditionsJson)
                ? new List<ConditionRequest>()
                : JsonSerializer.Deserialize<List<ConditionRequest>>(
                    request.MedicalConditionsJson,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true, Converters = { new JsonStringEnumConverter() } }
                );
            switch (stepId.ToLower())
            {
                case "profile":
                    user.FirstName = request.FirstName;
                    user.LastName = request.LastName;
                    user.Gender = request.Gender;
                    user.DateOfBirth = request.DateOfBirth;
                    user.Height = request.Height;
                    user.Weight = request.Weight;
                    user.OnboardingStep = 1;
                    await _userManager.UpdateAsync(user);
                    break;

                case "medicalinfo":
                    if (request.Allergies != null)
                    {
                        foreach (var allergy in request.Allergies)
                        {
                            var allergyEntity = await _dbContext.Allergies.FirstOrDefaultAsync(a => a.AllergyName == allergy.Trim().ToUpper());
                            if (allergyEntity == null)
                            {
                                allergyEntity = new Allergy { AllergyName = allergy.Trim().ToUpper() };
                                _dbContext.Allergies.Add(allergyEntity);
                                await _dbContext.SaveChangesAsync();
                            }
                            var userAllergy = new UserAllergy
                            {
                                UserId = user.Id,
                                AllergyId = allergyEntity.AllergyId
                            };
                            _dbContext.UserAllergies.Add(userAllergy);
                        }
                    }

                    if (medications != null)
                    {
                        foreach (var medication in medications)
                        {
                            var medicationEntity = await _dbContext.Medications.FirstOrDefaultAsync(m => m.MedicationName == medication.Name.Trim().ToUpper());
                            if (medicationEntity == null)
                            {
                                medicationEntity = new Medication { MedicationName = medication.Name.Trim().ToUpper() };
                                _dbContext.Medications.Add(medicationEntity);
                                await _dbContext.SaveChangesAsync();
                            }
                            var userMedication = new UserMedication
                            {
                                UserId = user.Id,
                                MedicationId = medicationEntity.MedicationId,
                                Dosage = medication.Dosage,
                                Frequency = medication.Frequency,
                            };
                            _dbContext.UserMedications.Add(userMedication);
                        }
                    }

                    if (conditions != null)
                    {
                        foreach (var condition in conditions)
                        {
                            var conditionEntity = await _dbContext.Conditions.FirstOrDefaultAsync(c => c.ConditionName == condition.Name.Trim().ToUpper());
                            if (conditionEntity == null)
                            {
                                conditionEntity = new Condition { ConditionName = condition.Name.Trim().ToUpper() };
                                _dbContext.Conditions.Add(conditionEntity);
                                await _dbContext.SaveChangesAsync();
                            }
                            var userCondition = new UserCondition
                            {
                                UserId = user.Id,
                                ConditionId = conditionEntity.ConditionId,
                                DiagnosisDate = condition.DiagnosisDate,
                                Status = condition.Status,
                                Severity = condition.Severity,
                            };
                            _dbContext.UserConditions.Add(userCondition);
                        }
                    }
                    user.BloodType = request.BloodType;
                    user.OnboardingStep = 2;
                    await _userManager.UpdateAsync(user);
                    await _dbContext.SaveChangesAsync();
                    break;

                case "firstupload":
                    if (request.LabReport != null)
                    {
                        // Save file, insert Lab + UserLabResult
                    }
                    user.IsOnboarded = true;
                    user.OnboardingStep = 3;
                    await _userManager.UpdateAsync(user);
                    await _dbContext.SaveChangesAsync();
                    break;

                default:
                    throw new ArgumentException("Invalid onboarding step");
            }
        }
    }

}