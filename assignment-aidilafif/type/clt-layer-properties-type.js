/**
 * CLTLayerPropertiesType
 * Detailed properties for a single layer in calculations
 */
export class CLTLayerPropertiesType {
  constructor({
    layerIndex,
    thickness,
    orientation,
    E,
    G,
    gamma,
    area,
    momentOfInertia,
    distanceToNeutralAxis,
    contributionToEI,
    contributionToGA
  }) {
    this.layerIndex = layerIndex;
    this.thickness = thickness;
    this.orientation = orientation;
    this.E = E;
    this.G = G;
    this.gamma = gamma;
    this.area = area;
    this.momentOfInertia = momentOfInertia;
    this.distanceToNeutralAxis = distanceToNeutralAxis;
    this.contributionToEI = contributionToEI;
    this.contributionToGA = contributionToGA;
  }
}