/**
 * MaterialGradeType
 * Defines material properties for different wood grades
 */
export const MaterialGrade = {
  MGP10: { E: 10000, G: 690, f: 30 },
  MGP12: { E: 12000, G: 750, f: 35 },
  MGP15: { E: 15000, G: 820, f: 40 }
};

export class MaterialGradeType {
  constructor(grade = 'MGP10') {
    if (!MaterialGrade[grade]) {
      throw new Error(`Material grade ${grade} not found`);
    }
    this.grade = grade;
    this.E = MaterialGrade[grade].E; // Modulus of Elasticity (MPa)
    this.G = MaterialGrade[grade].G; // Shear Modulus (MPa)
    this.f = MaterialGrade[grade].f; // Bending Strength (MPa)
  }

  static getAvailableGrades() {
    return Object.keys(MaterialGrade);
  }
}