import ephemerisData from '../../../public/data/ephemeris.json'

export const planetSettings = {
  "Saturn": { glyph: "♄", color: "black", baseFreq: 55 },
  "Jupiter": { glyph: "♃", color: "orange", baseFreq: 110 },
  "Mars": { glyph: "♂", color: "red", baseFreq: 220 },
  "Sun": { glyph: "☉", color: "yellow", baseFreq: 440 },
  "Venus": { glyph: "♀", color: "green", baseFreq: 880 },
  "Mercury": { glyph: "☿", color: "blue", baseFreq: 1760 },
  "Moon": { glyph: "☽", color: "gray", baseFreq: 3520 }
}

export function filterEphemeris(data, startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return data.filter(entry => {
    const date = new Date(entry.Date)
    return date >= start && date <= end
  })
}

export function normalizeDateRange(data, durationSec, sampleRate = 44100) {
  if (!data.length) return []
  
  const totalSamples = durationSec * sampleRate
  const interpolatedData = []
  
  for (let i = 0; i < totalSamples; i++) {
    const progress = i / totalSamples
    const sourceIndex = progress * (data.length - 1)
    const prevIndex = Math.floor(sourceIndex)
    const nextIndex = Math.min(Math.ceil(sourceIndex), data.length - 1)
    const weight = sourceIndex - prevIndex
    
    const interpolatedEntry = {}
    
    // Interpolate all planet positions
    Object.keys(planetSettings).forEach(planet => {
      const prevValue = data[prevIndex][planet]
      const nextValue = data[nextIndex][planet]
      interpolatedEntry[planet] = prevValue + (nextValue - prevValue) * weight
    })
    
    interpolatedEntry.Date = new Date(
      data[prevIndex].Date.getTime() + 
      (data[nextIndex].Date.getTime() - data[prevIndex].Date.getTime()) * weight
    )
    
    interpolatedData.push(interpolatedEntry)
  }
  
  return interpolatedData
}

export async function loadEphemeris() {
  // In a real app, you might fetch this from an API
  return ephemerisData.map(entry => ({
    ...entry,
    Date: new Date(entry.Date) // Convert string dates to Date objects
  }))
}