import { CLTLayerType } from './clt-layer-type.js';

/**
 * CLTLayupType
 * Represents a complete CLT layup with multiple layers
 */
export class CLTLayupType {
  constructor(layers, method = 'shearAnalogy') {
    if (!Array.isArray(layers) || layers.length === 0) {
      throw new Error('Layers must be a non-empty array of CLTLayerType');
    }
    
    layers.forEach((layer, index) => {
      if (!(layer instanceof CLTLayerType)) {
        throw new Error(`Layer at index ${index} is not a CLTLayerType`);
      }
    });

    this.layers = layers;
    this.method = method; // 'shearAnalogy' | 'gamma'
  }

  get numberOfLayers() {
    return this.layers.length;
  }

  get totalThickness() {
    return this.layers.reduce((sum, layer) => sum + layer.thickness, 0);
  }

  get orientations() {
    return this.layers.map(layer => layer.orientation);
  }

  get thicknesses() {
    return this.layers.map(layer => layer.thickness);
  }

  /**
   * Check if layup is symmetric from top to bottom
   */
  isSymmetric() {
    const n = this.layers.length;
    for (let i = 0; i < Math.floor(n / 2); i++) {
      const top = this.layers[i];
      const bottom = this.layers[n - 1 - i];
      if (top.thickness !== bottom.thickness || 
          top.orientation !== bottom.orientation) {
        return false;
      }
    }
    return true;
  }

  /**
   * Validate layer count for selected method
   */
  validateMethod() {
    const n = this.numberOfLayers;
    if (this.method === 'gamma') {
      if (n !== 3 && n !== 5) {
        throw new Error('Gamma method requires exactly 3 or 5 layers.');
      }
    } else if (this.method === 'shearAnalogy') {
      if (n < 3 || n > 9) {
        throw new Error('Shear Analogy supports 3 to 9 layers.');
      }
      if (!this.isSymmetric()) {
        throw new Error('Shear Analogy requires symmetric layup (top to bottom).');
      }
    }
    return true;
  }

  /**
   * Get layer positions (top, mid, bottom) relative to panel
   */
  getLayerPositions() {
    let zPos = 0;
    return this.layers.map(layer => {
      const zTop = zPos;
      const zMid = zPos + layer.thickness / 2;
      const zBottom = zPos + layer.thickness;
      zPos = zBottom;
      return { zTop, zMid, zBottom };
    });
  }
}