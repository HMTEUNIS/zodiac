// components/PlanetControl.js
import { planetSettings } from '../lib/ephemerisService'

export default function PlanetControls({ volumes, onVolumeChange }) {
  return (
    <div className="planet-controls">
      {Object.entries(planetSettings).map(([planet, { glyph, color }]) => (
        <div key={planet} className="planet-control-group">
          <label className="planet-label" style={{ color }}>
            <span className="planet-glyph">{glyph}</span>
            <span className="planet-name">{planet}</span>
          </label>
          
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="100"
              value={volumes[planet]}
              onChange={(e) => onVolumeChange(planet, parseInt(e.target.value))}
              className="planet-slider"
              style={{ '--planet-color': color }}
            />
            <span className="volume-value">{volumes[planet]}%</span>
          </div>
        </div>
      ))}
    </div>
  )
}