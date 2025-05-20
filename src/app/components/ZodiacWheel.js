"use client"
// ZodiacWheel.js
import * as d3 from 'd3'
import React, { useEffect, useRef, useState } from 'react'
export default function ZodiacWheel({ data }) {
  const svgRef = useRef()
  const [currentPositions, setCurrentPositions] = useState(null)
  
  useEffect(() => {
    if (!svgRef.current) return
    
    const svg = d3.select(svgRef.current)
    const width = 400, height = 400
    const center = { x: width/2, y: height/2 }
    const radius = 150
    
    // Draw zodiac signs
    const signs = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"]
    signs.forEach((sign, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180)
      const pos = {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle)
      }
      svg.append("text")
        .attr("x", pos.x)
        .attr("y", pos.y)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(sign)
    })
    
    // Draw planet positions when data changes
    if (currentPositions) {
      Object.entries(currentPositions).forEach(([planet, deg]) => {
        const angle = (deg - 90) * (Math.PI / 180)
        const r = radius * 0.7
        const pos = {
          x: center.x + r * Math.cos(angle),
          y: center.y + r * Math.sin(angle)
        }
        
        svg.select(`.planet-${planet}`).remove()
        svg.append("text")
          .attr("class", `planet-${planet}`)
          .attr("x", pos.x)
          .attr("y", pos.y)
          .attr("fill", planetSettings[planet].color)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .text(planetSettings[planet].glyph)
      })
    }
  }, [currentPositions])
  
  return <svg ref={svgRef} width="400" height="400"></svg>
}