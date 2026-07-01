/**
 * PanelPropertiesType
 * Complete panel properties result from calculation
 */
export class PanelPropertiesType {
  constructor({
    totalThickness,
    effectiveBendingStiffness,
    effectiveShearStiffness,
    gammaFactors,
    methodUsed,
    layerOrientations,
    layerThicknesses,
    isSymmetric,
    neutralAxisPosition,
    layerProperties
  }) {
    this.totalThickness = totalThickness; // mm
    this.effectiveBendingStiffness = effectiveBendingStiffness; // N·mm²/mm
    this.effectiveShearStiffness = effectiveShearStiffness; // N/mm
    this.gammaFactors = gammaFactors || [];
    this.methodUsed = methodUsed; // 'shearAnalogy' | 'gamma'
    this.layerOrientations = layerOrientations || [];
    this.layerThicknesses = layerThicknesses || [];
    this.isSymmetric = isSymmetric || false;
    this.neutralAxisPosition = neutralAxisPosition || 0;
    this.layerProperties = layerProperties || [];
  }

  /**
   * Get formatted summary for display
   */
  getSummary() {
    return {
      totalThickness: this.totalThickness.toFixed(1),
      method: this.methodUsed === 'shearAnalogy' ? 'Shear Analogy' : 'Gamma',
      layers: this.layerOrientations.length,
      orientations: this.layerOrientations.map(o => o + '°').join(' / '),
      thicknesses: this.layerThicknesses.map(t => t + 'mm').join(' / '),
      EI: this.effectiveBendingStiffness.toFixed(1),
      GA: this.effectiveShearStiffness.toFixed(1),
      isSymmetric: this.isSymmetric ? '✓ symmetric' : '⚠️ not symmetric'
    };
  }
}