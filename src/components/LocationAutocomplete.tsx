import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Loader, X } from 'lucide-react'

interface PlacePrediction {
  placePrediction: {
    placeId: string
    text: {
      text: string
    }
    structuredFormat: {
      mainText: {
        text: string
      }
      secondaryText: {
        text: string
      }
    }
    types: string[]
  }
}

interface AutocompleteResponse {
  suggestions: PlacePrediction[]
}

interface LocationAutocompleteProps {
  onLocationSelect: (location: {
    placeId: string
    mainText: string
    secondaryText: string
    fullText: string
  }) => void
  placeholder?: string
  initialValue?: string
  className?: string
}

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || 'demo-key'
const RAPIDAPI_HOST = 'google-map-places-new-v2.p.rapidapi.com'

export default function LocationAutocomplete({ 
  onLocationSelect, 
  placeholder = "Search for locations...",
  initialValue = "",
  className = ""
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(initialValue)
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionToken, setSessionToken] = useState('')
  
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Generate session token for Places API
  useEffect(() => {
    const generateSessionToken = () => {
      return 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }
    setSessionToken(generateSessionToken())
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const searchPlaces = async (input: string) => {
    if (!input.trim() || input.length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'demo-key') {
      setError('RapidAPI key not configured')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('https://google-map-places-new-v2.p.rapidapi.com/v1/places:autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-FieldMask': '*',
          'x-rapidapi-host': RAPIDAPI_HOST,
          'x-rapidapi-key': RAPIDAPI_KEY
        },
        body: JSON.stringify({
          input: input,
          locationBias: {
            circle: {
              center: {
                latitude: 34.0151, // Peshawar, Pakistan
                longitude: 71.5249
              },
              radius: 50000 // 50km radius
            }
          },
          includedPrimaryTypes: [
            "establishment",
            "geocode",
            "locality",
            "sublocality",
            "political"
          ],
          includedRegionCodes: ["PK"], // Pakistan
          languageCode: "en",
          regionCode: "PK",
          origin: {
            latitude: 34.0151,
            longitude: 71.5249
          },
          inputOffset: input.length,
          includeQueryPredictions: true,
          sessionToken: sessionToken
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data: AutocompleteResponse = await response.json()
      
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions)
        setIsOpen(true)
      } else {
        setSuggestions([])
        setIsOpen(false)
      }
    } catch (err) {
      console.error('Places autocomplete error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch suggestions')
      setSuggestions([])
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Debounce API calls
    debounceRef.current = setTimeout(() => {
      searchPlaces(value)
    }, 300)
  }

  const handleSuggestionClick = (suggestion: PlacePrediction) => {
    const prediction = suggestion.placePrediction
    const mainText = prediction.structuredFormat?.mainText?.text || prediction.text.text
    const secondaryText = prediction.structuredFormat?.secondaryText?.text || ''
    const fullText = prediction.text.text

    setQuery(fullText)
    setIsOpen(false)
    setSuggestions([])

    onLocationSelect({
      placeId: prediction.placeId,
      mainText,
      secondaryText,
      fullText
    })
  }

  const clearInput = () => {
    setQuery('')
    setSuggestions([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const getIconForType = (types: string[]) => {
    if (types.includes('locality') || types.includes('political')) {
      return '🏙️'
    }
    if (types.includes('establishment')) {
      return '🏢'
    }
    if (types.includes('geocode')) {
      return '📍'
    }
    return '📍'
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-yellow-500" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-14 pr-12 py-5 text-lg border-2 border-yellow-200 rounded-2xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg"
        />

        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader className="h-5 w-5 text-yellow-500" />
            </motion.div>
          ) : query && (
            <button
              onClick={clearInput}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm z-50"
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-yellow-200 overflow-hidden z-50 max-h-80 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => {
              const prediction = suggestion.placePrediction
              const mainText = prediction.structuredFormat?.mainText?.text || prediction.text.text
              const secondaryText = prediction.structuredFormat?.secondaryText?.text || ''
              const icon = getIconForType(prediction.types)

              return (
                <motion.button
                  key={prediction.placeId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-6 py-4 text-left hover:bg-yellow-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-start space-x-3"
                >
                  <span className="text-xl mt-1 flex-shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {mainText}
                    </div>
                    {secondaryText && (
                      <div className="text-sm text-gray-500 truncate">
                        {secondaryText}
                      </div>
                    )}
                  </div>
                  <MapPin className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      {isOpen && !isLoading && query.length >= 2 && suggestions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 p-6 bg-white rounded-2xl shadow-lg border border-gray-200 text-center text-gray-500 z-50"
        >
          <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>No locations found for "{query}"</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </motion.div>
      )}
    </div>
  )
}
