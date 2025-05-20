// lib/audioEngine.js
import * as Tone from 'tone'
import { planetSettings, filterEphemeris, normalizeDateRange, loadEphemeris } from './ephemerisService'

export class AudioEngine {
  constructor() {
    this.planetSynths = {}
    this.masterVolume = new Tone.Volume(0).toDestination()
    this.currentDateIndex = 0
    this.isPlaying = false
    this.ephemerisData = []
    this.normalizedData = []
    this.planetVolumes = {}

    // Initialize synths for each planet
    Object.keys(planetSettings).forEach(planet => {
      this.planetSynths[planet] = new Tone.Oscillator({
        frequency: 440,
        type: "sine",
        volume: -Infinity // Start muted
      }).connect(this.masterVolume)
      
      // Default volumes
      this.planetVolumes[planet] = 0.7 // 70% as default
    })
  }

  async init() {
    try {
      this.ephemerisData = await loadEphemeris()
      console.log("Ephemeris data loaded successfully")
      return true
    } catch (error) {
      console.error("Failed to load ephemeris data:", error)
      return false
    }
  }

  async start(startDate, endDate, durationSec) {
    if (!this.ephemerisData.length) {
      const loaded = await this.init()
      if (!loaded) return false
    }

    // Filter data for selected date range
    const filteredData = filterEphemeris(this.ephemerisData, startDate, endDate)
    
    if (!filteredData.length) {
      console.error("No data available for selected date range")
      return false
    }

    // Normalize data for playback duration
    this.normalizedData = normalizeDateRange(filteredData, durationSec)
    this.currentDateIndex = 0
    this.isPlaying = true

    // Start all oscillators if they aren't already running
    Object.entries(this.planetSynths).forEach(([planet, synth]) => {
      if (synth.state !== 'started') {
        synth.start()
      }
      // Set initial volume
      this.setPlanetVolume(planet, this.planetVolumes[planet] * 100)
    })

    // Start the parameter updates
    this.updateParameters()
    return true
  }

  updateParameters() {
    if (!this.isPlaying || !this.normalizedData.length) return

    const currentEntry = this.normalizedData[this.currentDateIndex]
    
    // Update each planet's frequency
    Object.entries(this.planetSynths).forEach(([planet, synth]) => {
      const degrees = currentEntry[planet]
      const baseFreq = planetSettings[planet].baseFreq
      const freq = this.degreeToFreq(degrees, baseFreq)
      
      // Use rampTo for smooth frequency changes
      synth.frequency.rampTo(freq, 0.1)
    })

    // Move to next data point
    this.currentDateIndex = (this.currentDateIndex + 1) % this.normalizedData.length

    // Schedule next update using Tone's timing system
    Tone.Draw.schedule(() => {
      this.updateParameters()
    }, Tone.now() + 0.05) // Update every 50ms for smoother transitions
  }

  degreeToFreq(deg, base) {
    const semitone = (deg % 360) / 30
    return base * Math.pow(2, semitone / 12)
  }

  setPlanetVolume(planet, volume) {
    // Convert 0-100 range to decibels (-Infinity to 0)
    const db = volume === 0 ? -Infinity : (volume / 100 * 40) - 40
    this.planetSynths[planet]?.volume.rampTo(db, 0.1)
    this.planetVolumes[planet] = volume / 100
  }

  setMasterVolume(volume) {
    // Convert 0-100 range to decibels (-40 to 0)
    const db = (volume / 100 * 40) - 40
    this.masterVolume.volume.rampTo(db, 0.1)
  }

  stop() {
    this.isPlaying = false
    // Don't stop the oscillators, just mute them
    Object.values(this.planetSynths).forEach(synth => {
      synth.volume.rampTo(-Infinity, 0.1)
    })
  }

  dispose() {
    this.stop()
    Object.values(this.planetSynths).forEach(synth => synth.dispose())
    this.masterVolume.dispose()
  }
}