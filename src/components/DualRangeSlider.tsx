import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface DualRangeSliderProps {
  min: number
  max: number
  step: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  formatValue?: (value: number) => string
  label: string
  icon: string
}

export default function DualRangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  formatValue = (val) => val.toString(),
  label,
  icon
}: DualRangeSliderProps) {
  const [localValue, setLocalValue] = useState(value)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value)
    const newValue: [number, number] = [Math.min(newMin, localValue[1]), localValue[1]]
    setLocalValue(newValue)
    onChange(newValue)
    console.log('Min changed:', newValue)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value)
    const newValue: [number, number] = [localValue[0], Math.max(newMax, localValue[0])]
    setLocalValue(newValue)
    onChange(newValue)
    console.log('Max changed:', newValue)
  }

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100
  }

  const minPercent = getPercentage(localValue[0])
  const maxPercent = getPercentage(localValue[1])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <span className="mr-2">{icon}</span>
        {label}
      </h3>
      
      <div className="space-y-4">
        {/* Value Display */}
        <div className="flex justify-between text-sm font-medium text-gray-700">
          <span className="px-3 py-1 bg-yellow-100 rounded-lg">
            {formatValue(localValue[0])}
          </span>
          <span className="text-gray-400">to</span>
          <span className="px-3 py-1 bg-yellow-100 rounded-lg">
            {formatValue(localValue[1])}
          </span>
        </div>

        {/* Slider Container */}
        <div ref={sliderRef} className="relative h-6">
          {/* Track Background */}
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-lg" />
          
          {/* Active Track */}
          <div
            className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`
            }}
          />

          {/* Min Range Input */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue[0]}
            onChange={handleMinChange}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10"
            style={{
              background: 'transparent',
              pointerEvents: 'auto'
            }}
          />

          {/* Max Range Input */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue[1]}
            onChange={handleMaxChange}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10"
            style={{
              background: 'transparent',
              pointerEvents: 'auto'
            }}
          />

          {/* Min Thumb */}
          <motion.div
            className="absolute w-5 h-5 bg-white border-2 border-yellow-500 rounded-full shadow-md cursor-pointer z-20"
            style={{
              left: `calc(${minPercent}% - 10px)`,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
            whileHover={{ scale: 1.2 }}
            whileDrag={{ scale: 1.2 }}
          />

          {/* Max Thumb */}
          <motion.div
            className="absolute w-5 h-5 bg-white border-2 border-yellow-500 rounded-full shadow-md cursor-pointer z-20"
            style={{
              left: `calc(${maxPercent}% - 10px)`,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
            whileHover={{ scale: 1.2 }}
            whileDrag={{ scale: 1.2 }}
          />
        </div>

        {/* Quick Preset Buttons */}
        <div className="flex gap-2 flex-wrap">
          {label === 'Price Range' && (
            <>
              <button
                onClick={() => onChange([0, 500000])}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-yellow-100 rounded-full transition-colors"
              >
                Under 5L
              </button>
              <button
                onClick={() => onChange([500000, 1000000])}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-yellow-100 rounded-full transition-colors"
              >
                5L - 10L
              </button>
              <button
                onClick={() => onChange([1000000, max])}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-yellow-100 rounded-full transition-colors"
              >
                Above 10L
              </button>
            </>
          )}
          {label === 'Capacity' && (
            <>
              <button
                onClick={() => onChange([0, 500])}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-yellow-100 rounded-full transition-colors"
              >
                Small (0-500)
              </button>
              <button
                onClick={() => onChange([500, 1500])}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-yellow-100 rounded-full transition-colors"
              >
                Medium (500-1500)
              </button>
              <button
                onClick={() => onChange([1500, max])}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-yellow-100 rounded-full transition-colors"
              >
                Large (1500+)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
