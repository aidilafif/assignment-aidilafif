import { CLTLayerType } from './type/clt-layer-type.js';
import { CLTLayupType } from './type/clt-layup-type.js';
import { PanelProperties } from './calculation/panel-properties.js';

/**
 * CLTCalculator
 * Main controller for the CLT calculator UI
 */
export class CLTCalculator {
  constructor() {
    this.layerContainer = document.getElementById('layerContainer');
    this.outputArea = document.getElementById('outputArea');
    this.calcBtn = document.getElementById('calculateBtn');
    this.methodRadios = document.querySelectorAll('input[name="method"]');
    
    // Default 5 layers matching illustration
    this.defaultLayers = [
      { thickness: 35, orientation: 0 },
      { thickness: 35, orientation: 30 },
      { thickness: 35, orientation: 60 },
      { thickness: 35, orientation: 90 },
      { thickness: 35, orientation: 0 }
    ];
    
    this.layerData = this.defaultLayers.map((d, idx) => ({ ...d, id: idx }));
    
    this.renderLayers();
    this.bindEvents();
    
    // Auto-calculate on load
    setTimeout(() => this.calculate(), 60);
  }

  renderLayers() {
    this.layerContainer.innerHTML = '';
    this.layerData.forEach((layer, index) => {
      const row = document.createElement('div');
      row.className = 'layer-row';
      row.innerHTML = `
        <span class="layer-label">Layer ${index + 1}</span>
        <input type="number" value="${layer.thickness}" 
               min="10" max="60" step="5" 
               data-index="${index}" class="thick-input" 
               style="width:74px;">
        <select data-index="${index}" class="orient-select">
          <option value="0" ${layer.orientation === 0 ? 'selected' : ''}>0°</option>
          <option value="30" ${layer.orientation === 30 ? 'selected' : ''}>30°</option>
          <option value="60" ${layer.orientation === 60 ? 'selected' : ''}>60°</option>
          <option value="90" ${layer.orientation === 90 ? 'selected' : ''}>90°</option>
        </select>
        <span class="badge">MGP10</span>
      `;
      this.layerContainer.appendChild(row);
    });
  }

  bindEvents() {
    this.calcBtn.addEventListener('click', () => this.calculate());
    
    // Update layer data on input/change
    this.layerContainer.addEventListener('input', (e) => {
      const target = e.target;
      const idx = target.dataset.index;
      if (idx === undefined) return;
      
      if (target.classList.contains('thick-input')) {
        this.layerData[idx].thickness = parseFloat(target.value) || 35;
      }
    });
    
    this.layerContainer.addEventListener('change', (e) => {
      const target = e.target;
      const idx = target.dataset.index;
      if (idx === undefined) return;
      
      if (target.classList.contains('orient-select')) {
        this.layerData[idx].orientation = parseInt(target.value);
      }
    });
  }

  getLayupFromUI() {
    const inputs = this.layerContainer.querySelectorAll('.layer-row');
    const layers = [];
    
    inputs.forEach((row) => {
      const thickInput = row.querySelector('.thick-input');
      const orientSelect = row.querySelector('.orient-select');
      const thickness = parseFloat(thickInput.value) || 35;
      const orientation = parseInt(orientSelect.value) || 0;
      layers.push(new CLTLayerType(thickness, orientation));
    });
    
    const method = document.querySelector('input[name="method"]:checked').value;
    return new CLTLayupType(layers, method);
  }

  calculate() {
    try {
      const layup = this.getLayupFromUI();
      const result = PanelProperties.calculate(layup);
      this.renderOutput(result);
    } catch (err) {
      this.outputArea.innerHTML = `<div class="error-message">⚠️ ${err.message}</div>`;
    }
  }

  renderOutput(props) {
    const isShear = props.methodUsed === 'shearAnalogy';
    const isGamma = props.methodUsed === 'gamma';
    const summary = props.getSummary();

    let html = `
      <div class="output-row">
        <span class="output-label">Total thickness</span>
        <span class="output-value">${summary.totalThickness} mm</span>
      </div>
      <div class="output-row">
        <span class="output-label">Method</span>
        <span class="output-value">${summary.method}</span>
      </div>
      <div class="output-row">
        <span class="output-label">Layers</span>
        <span class="output-value">${summary.layers}</span>
      </div>
      <div class="output-row">
        <span class="output-label">Orientations</span>
        <span class="output-value">${summary.orientations}</span>
      </div>
      <div class="output-row">
        <span class="output-label">Thicknesses</span>
        <span class="output-value">${summary.thicknesses}</span>
      </div>
    `;

    if (isShear) {
      html += `
        <div class="section-title">▸ Shear Analogy results</div>
        <div class="output-row">
          <span class="output-label">EI<sub>eff</sub> (b=1mm)</span>
          <span class="output-value">${summary.EI} N·mm²/mm</span>
        </div>
        <div class="output-row">
          <span class="output-label">GA<sub>eff</sub> (b=1mm)</span>
          <span class="output-value">${summary.GA} N/mm</span>
        </div>
        <div class="output-row">
          <span class="output-label">Symmetry</span>
          <span class="output-value">${summary.isSymmetric}</span>
        </div>
      `;
    } else if (isGamma) {
      html += `
        <div class="section-title">▸ Gamma method results</div>
        <div class="output-row">
          <span class="output-label">EI<sub>eff</sub> (b=1mm)</span>
          <span class="output-value">${summary.EI} N·mm²/mm</span>
        </div>
        <div class="output-row">
          <span class="output-label">GA<sub>eff</sub> (b=1mm)</span>
          <span class="output-value">${summary.GA} N/mm</span>
        </div>
        <div class="gamma-list">
          <span style="font-weight:500; margin-right:8px;">γ factors:</span>
          ${props.gammaFactors.map((g, i) => 
            `<span class="gamma-item">γ<sub>${i+1}</sub> = ${g.toFixed(2)}</span>`
          ).join('')}
        </div>
      `;
    }

    this.outputArea.innerHTML = html;
  }
}