import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Navigation, Camera, Search, Compass, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Tourist destinations with coordinates - Popular places in Jharkhand
const touristDestinations = [
  { id: 1, name: "Netarhat", lat: 23.4667, lng: 84.25, country: "India", city: "Latehar" },
  { id: 2, name: "Betla National Park", lat: 23.9167, lng: 84.1833, country: "India", city: "Latehar" },
  { id: 3, name: "Hundru Falls", lat: 23.4167, lng: 85.6167, country: "India", city: "Ranchi" },
  { id: 4, name: "Jonha Falls", lat: 23.3833, lng: 85.4833, country: "India", city: "Ranchi" },
  { id: 5, name: "Dassam Falls", lat: 23.5833, lng: 85.5, country: "India", city: "Ranchi" },
  { id: 6, name: "Deoghar Temple", lat: 24.4833, lng: 86.7, country: "India", city: "Deoghar" },
  { id: 7, name: "Parasnath Hill", lat: 23.9667, lng: 86.1667, country: "India", city: "Giridih" },
  { id: 8, name: "Jamshedpur", lat: 22.8046, lng: 86.2029, country: "India", city: "Jamshedpur" },
  { id: 9, name: "Hazaribagh National Park", lat: 23.9833, lng: 85.3667, country: "India", city: "Hazaribagh" },
  { id: 10, name: "Dhanbad Coal Mines", lat: 23.7957, lng: 86.4304, country: "India", city: "Dhanbad" },
  { id: 11, name: "Rajrappa Temple", lat: 23.65, lng: 85.65, country: "India", city: "Ramgarh" },
  { id: 12, name: "Birsa Zoological Park", lat: 23.3667, lng: 85.3333, country: "India", city: "Ranchi" },
];

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface PlaceSuggestion {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const ARMapComponent = () => {
  const [selectedLocation, setSelectedLocation] = useState(touristDestinations[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isStreetViewActive, setIsStreetViewActive] = useState(false);
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const streetViewRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapInstance = useRef<any>(null);
  const streetViewInstance = useRef<any>(null);
  const currentMarker = useRef<any>(null);

  const filteredDestinations = touristDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY'}&libraries=geometry,places,marker`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsMapLoaded(true);
      };
      
      script.onerror = () => {
        toast({
          title: "Google Maps Error",
          description: "Failed to load Google Maps. Please check your API key configuration.",
          variant: "destructive",
        });
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map when loaded
  useEffect(() => {
    if (isMapLoaded && mapRef.current && !mapInstance.current) {
      try {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: selectedLocation.lat, lng: selectedLocation.lng },
          zoom: 15,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        // Add marker for the location using AdvancedMarkerElement
        if (currentMarker.current) {
          currentMarker.current.map = null;
        }
        currentMarker.current = new window.google.maps.marker.AdvancedMarkerElement({
          position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
          map: mapInstance.current,
          title: selectedLocation.name,
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        toast({
          title: "Map Initialization Error",
          description: "Failed to initialize the map. Using demo mode.",
          variant: "destructive",
        });
      }
    }
  }, [isMapLoaded, selectedLocation]);

  // Update map when location changes
  useEffect(() => {
    if (mapInstance.current) {
      const newCenter = { lat: selectedLocation.lat, lng: selectedLocation.lng };
      mapInstance.current.setCenter(newCenter);
      mapInstance.current.setZoom(15);

      // Update marker position using AdvancedMarkerElement
      if (currentMarker.current) {
        currentMarker.current.map = null;
      }
      currentMarker.current = new window.google.maps.marker.AdvancedMarkerElement({
        position: newCenter,
        map: mapInstance.current,
        title: selectedLocation.name,
      });
    }
  }, [selectedLocation]);

  // Handle search input change with debouncing
  useEffect(() => {
    const searchPlacesInner = async (query: string) => {
      if (!query.trim() || !isMapLoaded) {
        setPlaceSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      
      try {
        const request = {
          input: query,
          includedPrimaryTypes: ['tourist_attraction', 'establishment'],
          language: 'en',
          region: 'in'
        };

        const { suggestions } = await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
        
        if (suggestions && suggestions.length > 0) {
          // Convert to our PlaceSuggestion format
          const formattedSuggestions = suggestions.slice(0, 8).map((suggestion: any) => ({
            description: suggestion.placePrediction.text.text,
            place_id: suggestion.placePrediction.placeId,
            structured_formatting: {
              main_text: suggestion.placePrediction.structuredFormat.mainText.text,
              secondary_text: suggestion.placePrediction.structuredFormat.secondaryText?.text || ''
            }
          }));
          
          setPlaceSuggestions(formattedSuggestions);
          setShowSuggestions(true);
        } else {
          setPlaceSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
        setPlaceSuggestions([]);
        setShowSuggestions(false);
        toast({
          title: "Search Error",
          description: "Failed to fetch place suggestions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (searchTerm.length > 2) {
        searchPlacesInner(searchTerm);
      } else {
        setPlaceSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, isMapLoaded]);

  // Handle selecting a place suggestion using new Places API
  const selectPlace = async (suggestion: PlaceSuggestion) => {
    if (!isMapLoaded) return;

    setIsSearching(true);
    setSearchTerm(suggestion.structured_formatting.main_text);
    setShowSuggestions(false);

    try {
      const request = {
        placeId: suggestion.place_id,
        fields: ['id', 'displayName', 'location', 'formattedAddress']
      };

      const { place } = await window.google.maps.places.Place.fetchFields(request);

      if (place && place.location) {
        const newLocation = {
          id: Date.now(), // Generate unique ID
          name: place.displayName?.text || suggestion.structured_formatting.main_text,
          lat: place.location.lat(),
          lng: place.location.lng(),
          country: extractCountryFromAddress(place.formattedAddress || ''),
          city: extractCityFromAddress(place.formattedAddress || '')
        };
        
        setSelectedLocation(newLocation);
        toast({
          title: "Location Selected",
          description: `Now viewing ${newLocation.name}`,
        });
      } else {
        throw new Error('Invalid place data received');
      }
    } catch (error) {
      console.error('Error getting place details:', error);
      toast({
        title: "Location Error",
        description: "Failed to get details for this location.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Helper functions to extract city and country from formatted address
  const extractCityFromAddress = (address: string): string => {
    const parts = address.split(', ');
    return parts.length > 1 ? parts[parts.length - 3] || parts[0] : parts[0];
  };

  const extractCountryFromAddress = (address: string): string => {
    const parts = address.split(', ');
    return parts[parts.length - 1] || 'Unknown';
  };

  const initializeStreetView = () => {
    if (!isMapLoaded || !streetViewRef.current) {
      toast({
        title: "Street View Unavailable",
        description: "Google Maps is not loaded yet. Please wait and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const streetViewService = new window.google.maps.StreetViewService();
      const location = { lat: selectedLocation.lat, lng: selectedLocation.lng };

      streetViewService.getPanorama(
        { location: location, radius: 100 },
        (data: any, status: any) => {
          if (status === 'OK') {
            streetViewInstance.current = new window.google.maps.StreetViewPanorama(
              streetViewRef.current!,
              {
                position: location,
                pov: { heading: 0, pitch: 0 },
                zoom: 1,
                addressControl: true,
                linksControl: true,
                panControl: true,
                enableCloseButton: true,
              }
            );
            setIsStreetViewActive(true);
            toast({
              title: "Street View Activated",
              description: `Now viewing ${selectedLocation.name}`,
            });
          } else {
            toast({
              title: "Street View Unavailable",
              description: "Street View is not available for this location.",
              variant: "destructive",
            });
          }
        }
      );
    } catch (error) {
      console.error('Error initializing Street View:', error);
      toast({
        title: "Street View Error",
        description: "Failed to initialize Street View for this location.",
        variant: "destructive",
      });
    }
  };

  const closeStreetView = () => {
    setIsStreetViewActive(false);
    streetViewInstance.current = null;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Search and Location Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5" />
            Jharkhand Tourist Destinations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search Jharkhand destinations... (e.g., Netarhat, Ranchi)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => {
                    if (placeSuggestions.length > 0) setShowSuggestions(true);
                  }}
                  onBlur={() => {
                    // Delay hiding suggestions to allow for clicking
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  className="pl-8"
                />
                {isSearching && (
                  <div className="absolute right-2 top-2.5">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                )}
                
                {/* Autocomplete Suggestions Dropdown */}
                {showSuggestions && placeSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {placeSuggestions.map((suggestion, index) => (
                      <div
                        key={suggestion.place_id}
                        className="px-3 py-2 cursor-pointer hover:bg-muted transition-colors border-b border-border last:border-b-0"
                        onClick={() => selectPlace(suggestion)}
                      >
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm truncate">
                              {suggestion.structured_formatting.main_text}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {suggestion.structured_formatting.secondary_text}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setPlaceSuggestions([]);
                  setShowSuggestions(false);
                }}
                disabled={!searchTerm}
              >
                Clear
              </Button>
            </div>
            
            {/* Show preset destinations when no search term, otherwise show filtered results */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                {searchTerm ? 'Filtered Destinations' : 'Popular Jharkhand Destinations'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredDestinations.map((dest) => (
                  <Card 
                    key={dest.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedLocation.id === dest.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedLocation(dest)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm">{dest.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{dest.city}, {dest.country}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Navigation className="h-3 w-3" />
                          <span>{dest.lat.toFixed(4)}, {dest.lng.toFixed(4)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredDestinations.length === 0 && searchTerm && !showSuggestions && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2" />
                  <p>No destinations found for "{searchTerm}"</p>
                  <p className="text-xs">Try searching for a specific place or attraction</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currently Selected Location */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{selectedLocation.name}</h2>
              <p className="text-muted-foreground">
                {selectedLocation.city}, {selectedLocation.country}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Selected
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map and Street View Tabs */}
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Map View
          </TabsTrigger>
          <TabsTrigger value="streetview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            AR Street View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Interactive Map - {selectedLocation.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {!isMapLoaded ? (
                  <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-muted-foreground">Loading Google Maps...</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Note: Requires Google Maps API key configuration
                      </p>
                    </div>
                  </div>
                ) : (
                  <div ref={mapRef} className="h-96 rounded-lg overflow-hidden border"></div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streetview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                AR Street View - {selectedLocation.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={initializeStreetView} 
                    disabled={!isMapLoaded}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Activate Street View
                  </Button>
                  {isStreetViewActive && (
                    <Button onClick={closeStreetView} variant="outline">
                      Close Street View
                    </Button>
                  )}
                </div>

                <div className="relative">
                  {!isStreetViewActive ? (
                    <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">Street View Ready</p>
                        <p className="text-xs text-muted-foreground">
                          Click "Activate Street View" to start exploring {selectedLocation.name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div ref={streetViewRef} className="h-96 rounded-lg overflow-hidden border"></div>
                  )}
                </div>

                {isStreetViewActive && (
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">AR Street View Controls</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Drag to look around in 360°</li>
                      <li>• Click arrows on the street to move forward/backward</li>
                      <li>• Use zoom controls to get closer views</li>
                      <li>• Click on blue highlighted areas to explore nearby locations</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AR Features Info */}
      <Card>
        <CardHeader>
          <CardTitle>AR Enhanced Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <Navigation className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">360° Navigation</h4>
              <p className="text-sm text-muted-foreground">
                Immersive street-level exploration
              </p>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">Real Imagery</h4>
              <p className="text-sm text-muted-foreground">
                Authentic street view photography
              </p>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">Smart Search</h4>
              <p className="text-sm text-muted-foreground">
                Google Places autocomplete suggestions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ARMapComponent;
