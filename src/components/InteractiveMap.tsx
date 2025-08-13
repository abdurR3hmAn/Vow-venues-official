import React, { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Locate, AlertCircle } from 'lucide-react'

interface InteractiveMapProps {
  venue: {
    name: string
    latitude?: number
    longitude?: number
    address: string
  }
}

interface UserLocation {
  lat: number
  lng: number
}

// Google Maps API key from environment variables
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'demo-key'

export default function InteractiveMap({ venue }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false)
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)

  // Default location (Peshawar, Pakistan) if venue coordinates not available
  const defaultLocation = { lat: 34.0151, lng: 71.5249 }
  const venueLocation = venue.latitude && venue.longitude 
    ? { lat: venue.latitude, lng: venue.longitude }
    : defaultLocation

  useEffect(() => {
    initializeMap()
  }, [])

  const initializeMap = async () => {
    if (!mapRef.current) return

    try {
      setIsLoading(true)
      setError(null)

      const loader = new Loader({
        apiKey: GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places', 'geometry']
      })

      const google = await loader.load()
      
      // Initialize map
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: venueLocation,
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'poi.business',
            stylers: [{ visibility: 'on' }]
          }
        ]
      })

      setMap(mapInstance)

      // Add venue marker
      const venueMarker = new google.maps.Marker({
        position: venueLocation,
        map: mapInstance,
        title: venue.name,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#f59e0b" stroke="#ffffff" stroke-width="3"/>
              <circle cx="20" cy="20" r="8" fill="#ffffff"/>
              <text x="20" y="25" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">🏛️</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20)
        }
      })

      // Add info window for venue
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px; font-weight: 600;">${venue.name}</h3>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${venue.address}</p>
            <div style="display: flex; gap: 8px; margin-top: 12px;">
              <a href="https://www.google.com/maps/dir/?api=1&destination=${venueLocation.lat},${venueLocation.lng}" 
                 target="_blank" 
                 style="padding: 6px 12px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 12px;">
                Get Directions
              </a>
              <a href="https://maps.google.com/?q=${venueLocation.lat},${venueLocation.lng}" 
                 target="_blank" 
                 style="padding: 6px 12px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; font-size: 12px;">
                View on Maps
              </a>
            </div>
          </div>
        `
      })

      venueMarker.addListener('click', () => {
        infoWindow.open(mapInstance, venueMarker)
      })

      // Initialize directions service
      const directionsServiceInstance = new google.maps.DirectionsService()
      const directionsRendererInstance = new google.maps.DirectionsRenderer({
        draggable: false,
        panel: null,
        polylineOptions: {
          strokeColor: '#f59e0b',
          strokeWeight: 4,
          strokeOpacity: 0.8
        }
      })

      directionsRendererInstance.setMap(mapInstance)
      setDirectionsService(directionsServiceInstance)
      setDirectionsRenderer(directionsRendererInstance)

      setIsLoading(false)
      
      // Request location permission and get current location
      getCurrentLocation()

    } catch (err) {
      console.error('Error initializing map:', err)
      setError('Failed to load map. Please check your internet connection.')
      setIsLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setUserLocation(location)
        setLocationPermissionGranted(true)
        
        if (map) {
          // Add user location marker
          const userMarker = new google.maps.Marker({
            position: location,
            map: map,
            title: 'Your Location',
            icon: {
              url: 'data:image/svg+xml;base64,' + btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="14" fill="#3b82f6" stroke="#ffffff" stroke-width="3"/>
                  <circle cx="16" cy="16" r="6" fill="#ffffff"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 16)
            }
          })

          // Add info window for user location
          const userInfoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px;">
                <h4 style="margin: 0 0 4px 0; color: #374151;">Your Current Location</h4>
                <p style="margin: 0; color: #6b7280; font-size: 12px;">Latitude: ${location.lat.toFixed(6)}</p>
                <p style="margin: 0; color: #6b7280; font-size: 12px;">Longitude: ${location.lng.toFixed(6)}</p>
              </div>
            `
          })

          userMarker.addListener('click', () => {
            userInfoWindow.open(map, userMarker)
          })
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        setLocationPermissionGranted(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions.')
            break
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.')
            break
          case error.TIMEOUT:
            setError('Location request timed out.')
            break
          default:
            setError('An unknown error occurred while retrieving location.')
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  const showDirections = () => {
    if (!directionsService || !directionsRenderer || !userLocation || !map) {
      alert('Directions not available. Please ensure location access is enabled.')
      return
    }

    directionsService.route(
      {
        origin: userLocation,
        destination: venueLocation,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      },
      (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result)
          
          // Show route info
          const route = result.routes[0]
          const leg = route.legs[0]
          alert(`Route found!\nDistance: ${leg.distance?.text}\nDuration: ${leg.duration?.text}`)
        } else {
          console.error('Directions request failed:', status)
          alert('Could not calculate route. Please try again.')
        }
      }
    )
  }

  const centerOnVenue = () => {
    if (map) {
      map.setCenter(venueLocation)
      map.setZoom(17)
    }
  }

  const centerOnUser = () => {
    if (map && userLocation) {
      map.setCenter(userLocation)
      map.setZoom(16)
    } else {
      getCurrentLocation()
    }
  }

  if (isLoading) {
    return (
      <div className="h-80 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-yellow-200 border-t-yellow-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading interactive map...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-80 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center text-red-600 p-6">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="font-medium mb-2">Map Error</p>
          <p className="text-sm">{error}</p>
          <motion.button
            onClick={initializeMap}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Retry
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="h-80 bg-gray-200 rounded-xl overflow-hidden relative">
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <motion.button
            onClick={centerOnVenue}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            title="Center on venue"
          >
            <MapPin className="w-5 h-5 text-yellow-600" />
          </motion.button>
          
          {locationPermissionGranted && (
            <motion.button
              onClick={centerOnUser}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              title="Center on your location"
            >
              <Locate className="w-5 h-5 text-blue-600" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        {locationPermissionGranted && userLocation ? (
          <motion.button
            onClick={showDirections}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>Show Directions</span>
          </motion.button>
        ) : (
          <motion.button
            onClick={getCurrentLocation}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center space-x-2 bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors"
          >
            <Locate className="w-4 h-4" />
            <span>Enable Location</span>
          </motion.button>
        )}
        
        <motion.a
          href={`https://www.google.com/maps/dir/?api=1&destination=${venueLocation.lat},${venueLocation.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          <span>Open in Maps</span>
        </motion.a>
      </div>

      {locationPermissionGranted && userLocation && (
        <div className="text-center text-sm text-gray-600">
          <p>📍 Your location detected. Click "Show Directions" for turn-by-turn navigation.</p>
        </div>
      )}
    </div>
  )
}
