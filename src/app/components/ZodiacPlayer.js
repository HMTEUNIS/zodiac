"use client"
import { useState, useEffect, useRef } from 'react'
import { planetSettings } from '../lib/ephemerisService'
import { AudioEngine } from '../lib/audioEngine'
import ZodiacWheel from './ZodiacWheel'
import DateControls from './DateControls'
import PlanetControls from './PlanetControls'

export default function ZodiacPlayer() {
  const [startDate, setStartDate] = useState("2000-01-01")
  const [endDate, setEndDate] = useState("2012-12-21")
  const [duration, setDuration] = useState(30)
  const [planetVolumes, setPlanetVolumes] = useState(Object.fromEntries(Object.keys(planetSettings).map(p => [p, 70])))
  const [isPlaying, setIsPlaying] = useState(false)
  
  const audioEngineRef = useRef(null)
  const visualizationDataRef = useRef(null)

  useEffect(() => {
    audioEngineRef.current = new AudioEngine()
    audioEngineRef.current.init()
    
    return () => {
      audioEngineRef.current?.stop()
    }
  }, [])

  const handleStart = async () => {
    if (audioEngineRef.current) {
      setIsPlaying(true)
      await audioEngineRef.current.start(startDate, endDate, duration)
      visualizationDataRef.current = audioEngineRef.current.normalizedData
    }
  }

  const handleStop = () => {
    setIsPlaying(false)
    audioEngineRef.current?.stop()
  }

  const handleVolumeChange = (planet, value) => {
    setPlanetVolumes(prev => ({...prev, [planet]: value}))
    audioEngineRef.current?.setPlanetVolume(planet, value)
  }

  return (
    <div id='zodiac-player' >
      <h1>Zodiac Sound Generator</h1>
      
      <DateControls
        startDate={startDate}
        endDate={endDate}
        duration={duration}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onDurationChange={setDuration}
        onStart={handleStart}
        onStop={handleStop}
      />
      
      <div >
        <ZodiacWheel 
          data={visualizationDataRef.current} 
          currentIndex={audioEngineRef.current?.currentDateIndex || 0}
          isPlaying={isPlaying}
        />
        
        <PlanetControls
          volumes={planetVolumes}
          onVolumeChange={handleVolumeChange}
        />
      </div>
    </div>
  )
}