export interface Exercise {
  id: string;
  name: string;
  description?: string; // Необов'язкове поле
  muscleGroup: string;  // Група м'язів
}