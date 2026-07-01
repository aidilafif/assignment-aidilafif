import { MaterialGradeType } from './material-grade-type.js';

/**
 * CLTLayerType
 * Represents a single layer in a CLT panel
 */
export class CLTLayerType {
  constructor(thickness, orientation, material = null) {
    this.thickness = thickness; // mm
    this.orientation = orientation; // degrees: 0, 30, 60, 90
    this.material = material || new MaterialGradeType('MGP10');
  }

  get E() {
    return this.material.E;
  }

  get G() {
    return this.material.G;
  }

  /**
   * Get gamma factor based on orientation
   * Used in composite action calculations
   */
  getGammaFactor() {
    const ori = this.orientation;
    if (ori === 0) return 1.0;
    if (ori === 90) return 0.3;
    if (ori === 30 || ori === 60) return 0.6;
    return 0.5;
  }

  /**
   * Check if this layer is a cross layer (perpendicular)
   */
  isCrossLayer() {
    return this.orientation === 90 || this.orientation === 0;
  }

  /**
   * Get moment of inertia for unit width (b=1)
   */
  getMomentOfInertia() {
    return (1 * Math.pow(this.thickness, 3)) / 12;
  }

  /**
   * Get area for unit width (b=1)
   */
  getArea() {
    return this.thickness * 1;
  }
}