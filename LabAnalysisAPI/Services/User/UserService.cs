using LabAnalysisAPI.Models;
using Microsoft.AspNetCore.Identity;
using LabAnalysisAPI.Data;
using Microsoft.EntityFrameworkCore;

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

                    if (request.Medications != null)
                    {
                        foreach (var medication in request.Medications)
                        {
                            var medicationEntity = _dbContext.Medications.FirstOrDefault(m => m.MedicationName == medication);
                            if (medicationEntity == null)
                            {
                                medicationEntity = new Medication { MedicationName = medication };
                                _dbContext.Medications.Add(medicationEntity);
                                await _dbContext.SaveChangesAsync();
                            }
                            var userMedication = new UserMedication
                            {
                                UserId = user.Id,
                                MedicationId = medicationEntity.MedicationId
                            };
                            _dbContext.UserMedications.Add(userMedication);
                        }
                    }

                    if (request.MedicalConditions != null)
                    {
                        foreach (var condition in request.MedicalConditions)
                        {
                            var conditionEntity = _dbContext.Conditions.FirstOrDefault(c => c.ConditionName == condition);
                            if (conditionEntity == null)
                            {
                                conditionEntity = new Condition { ConditionName = condition };
                                _dbContext.Conditions.Add(conditionEntity);
                                await _dbContext.SaveChangesAsync();
                            }
                            var userCondition = new UserCondition
                            {
                                UserId = user.Id,
                                ConditionId = conditionEntity.ConditionId
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