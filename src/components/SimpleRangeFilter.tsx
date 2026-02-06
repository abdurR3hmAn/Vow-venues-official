import React from 'react'
import { motion } from 'framer-motion'

interface SimpleRangeFilterProps {
  min: number
  max: number
  step: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  formatValue?: (value: number) => string
  label: string
  icon: string
}

export default function SimpleRangeFilter({
  min,
  max,
  step,
  value,
  onChange,
  formatValue = (val) => val.toString(),
  label,
  icon
}: SimpleRangeFilterProps) {

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value)
    const newValue: [number, number] = [newMin, Math.max(newMin, value[1])]
    onChange(newValue)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value)
    const newValue: [number, number] = [Math.min(value[0], newMax), newMax]
    onChange(newValue)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <span className="mr-2">{icon}</span>
        {label}
      </h3>
      
      <div className="space-y-4">
        {/* Current Range Display */}
        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Range:</span>
          <span className="text-sm font-bold text-yellow-800">
            {formatValue(value[0])} - {formatValue(value[1])}
          </span>
        </div>

        {/* Minimum Value Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-600">Minimum</label>
            <span className="text-sm font-bold text-gray-800">{formatValue(value[0])}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={handleMinChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Maximum Value Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-600">Maximum</label>
            <span className="text-sm font-bold text-gray-800">{formatValue(value[1])}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[1]}
            onChange={handleMaxChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Quick Preset Buttons */}
        <div className="flex gap-2 flex-wrap">
          {label === 'Price Range' && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange([0, 500000])}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-yellow-100 rounded-full transition-colors border"
              >
                Under 5L
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange([500000, 1000000])}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-yellow-100 rounded-full transition-colors border"
              >
                5L - 10L
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange([1000000, max])}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-yellow-100 rounded-full transition-colors border"
              >
                Above 10L
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange([0, max])}
                className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded-full transition-colors border"
              >
                All Prices
              </motion.button>
            </>
          )}
          {label === 'Capacity' && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange([0, 500])}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-yellow-100 rounded-full transition-colors border"
              >
                Small (0-500)
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange([500, 1500])}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-yellow-100 rounded-full transition-colors border"
              >
                Medium (500-1500)
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange([1500, max])}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-yellow-100 rounded-full transition-colors border"
              >
                Large (1500+)
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange([0, max])}
                className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded-full transition-colors border"
              >
                All Sizes
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
