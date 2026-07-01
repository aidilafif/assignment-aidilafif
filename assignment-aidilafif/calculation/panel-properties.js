import { CLTLayupType } from '../type/clt-layup-type.js';
import { PanelPropertiesType } from '../type/panel-properties-type.js';
import { CLTLayerPropertiesType } from '../type/clt-layer-properties-type.js';

/**
 * PanelProperties
 * Main calculation engine for CLT panel properties
 */
export class PanelProperties {
  /**
   * Calculate panel properties from layup definition
   * @param {CLTLayupType} layup - The CLT layup definition
   * @returns {PanelPropertiesType} Calculated panel properties
   */
  static calculate(layup) {
    // Validate layup and method
    layup.validateMethod();

    const layers = layup.layers;
    const n = layers.length;
    const method = layup.method;

    // Extract layer data
    const t = layers.map(l => l.thickness);
    const E = layers.map(l => l.E);
    const G = layers.map(l => l.G);
    const orientations = layers.map(l => l.orientation);

    // Get layer positions
    const positions = layup.getLayerPositions();

    // Calculate gamma factors
    const gamma = layers.map(l => l.getGammaFactor());

    // Calculate neutral axis position (stiffness weighted)
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) {
      const Ai = t[i] * 1;
      num += E[i] * Ai * positions[i].zMid;
      den += E[i] * Ai;
    }
    const neutralAxis = den !== 0 ? num / den : layup.totalThickness / 2;

    // Calculate effective bending stiffness (EI)
    let EI_eff = 0;
    const layerProps = [];

    for (let i = 0; i < n; i++) {
      const ti = t[i];
      const Ei = E[i];
      const Gi = G[i];
      const Ai = ti * 1;
      const d = positions[i].zMid - neutralAxis;
      const I_i = (1 * Math.pow(ti, 3)) / 12;
      const gamma_i = gamma[i] || 0.5;

      const contributionEI = Ei * I_i + gamma_i * Ei * Ai * d * d;
      EI_eff += contributionEI;

      // Store layer properties for detailed output
      layerProps.push(new CLTLayerPropertiesType({
        layerIndex: i,
        thickness: ti,
        orientation: orientations[i],
        E: Ei,
        G: Gi,
        gamma: gamma_i,
        area: Ai,
        momentOfInertia: I_i,
        distanceToNeutralAxis: d,
        contributionToEI: contributionEI,
        contributionToGA: Gi * Ai * (1 - gamma_i * 0.25)
      }));
    }

    // Calculate effective shear stiffness (GA)
    let GA_eff = 0;
    for (let i = 0; i < n; i++) {
      const Gi = G[i];
      const Ai = t[i] * 1;
      const gamma_i = gamma[i] || 0.5;
      GA_eff += Gi * Ai * (1 - gamma_i * 0.25);
    }
    GA_eff = Math.max(GA_eff, 0.5);

    // Check symmetry
    const isSymmetric = layup.isSymmetric();

    return new PanelPropertiesType({
      totalThickness: layup.totalThickness,
      effectiveBendingStiffness: EI_eff,
      effectiveShearStiffness: GA_eff,
      gammaFactors: gamma,
      methodUsed: method,
      layerOrientations: orientations,
      layerThicknesses: t,
      isSymmetric: isSymmetric,
      neutralAxisPosition: neutralAxis,
      layerProperties: layerProps
    });
  }

  /**
   * Get detailed layer-by-layer breakdown
   */
  static getLayerBreakdown(layup) {
    const result = this.calculate(layup);
    return result.layerProperties;
  }
}