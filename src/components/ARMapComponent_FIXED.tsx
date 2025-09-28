import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Navigation, Camera, Search, Compass, Eye, Image, ArrowLeft, ArrowRight, Plus, Minus, RotateCcw } from "lucide-react";
import jharkhandMapImage from "@/assets/jharkhand_map.webp";
import "./ARMapStyles.css";

// Tourist destinations with coordinates and AR visuals - Popular places in Jharkhand
const touristDestinations = [
  { 
    id: 1, 
    name: "Netarhat", 
    lat: 23.4667, 
    lng: 84.25, 
    country: "India", 
    city: "Latehar",
    arImages: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80"
    ]
  },
  { 
    id: 2, 
    name: "Betla National Park", 
    lat: 23.9167, 
    lng: 84.1833, 
    country: "India", 
    city: "Latehar",
    arImages: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80"
    ]
  },
  { 
    id: 3, 
    name: "Hundru Falls", 
    lat: 23.4167, 
    lng: 85.6167, 
    country: "India", 
    city: "Ranchi",
    arImages: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80"
    ]
  },
  { 
    id: 4, 
    name: "Jonha Falls", 
    lat: 23.3833, 
    lng: 85.4833, 
    country: "India", 
    city: "Ranchi",
    arImages: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80"
    ]
  },
  { 
    id: 5, 
    name: "Dassam Falls", 
    lat: 23.5833, 
    lng: 85.5, 
    country: "India", 
    city: "Ranchi",
    arImages: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80"
    ]
  },
  { 
    id: 6, 
    name: "Deoghar Temple", 
    lat: 24.4833, 
    lng: 86.7, 
    country: "India", 
    city: "Deoghar",
    arImages: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
      "https://images.unsplash.com/photo-1580500550469-ae45a1c9b50a?w=800&q=80"
    ]
  },
  { 
    id: 7, 
    name: "Parasnath Hill", 
    lat: 23.9667, 
    lng: 86.1667, 
    country: "India", 
    city: "Giridih",
    arImages: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80"
    ]
  },
  { 
    id: 8, 
    name: "Jamshedpur", 
    lat: 22.8046, 
    lng: 86.2029, 
    country: "India", 
    city: "Jamshedpur",
    arImages: [
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800&q=80"
    ]
  },
  { 
    id: 9, 
    name: "Hazaribagh National Park", 
    lat: 23.9833, 
    lng: 85.3667, 
    country: "India", 
    city: "Hazaribagh",
    arImages: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80"
    ]
  },
  { 
    id: 10, 
    name: "Dhanbad Coal Mines", 
    lat: 23.7957, 
    lng: 82.4304, 
    country: "India", 
    city: "Dhanbad",
    arImages: [
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&q=80",
      "https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?w=800&q=80"
    ]
  },
  { 
    id: 11, 
    name: "Rajrappa Temple", 
    lat: 23.65, 
    lng: 85.65, 
    country: "India", 
    city: "Ramgarh",
    arImages: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
      "https://images.unsplash.com/photo-1580500550469-ae45a1c9b50a?w=800&q=80"
    ]
  },
  { 
    id: 12, 
    name: "Birsa Zoological Park", 
    lat: 23.3667, 
    lng: 85.3333, 
    country: "India", 
    city: "Ranchi",
    arImages: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80"
    ]
  },
];

const ARMapComponent = () => {
  const [selectedLocation, setSelectedLocation] = useState(touristDestinations[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isStreetViewActive, setIsStreetViewActive] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Map interaction states
  const [scale, setScale] = useState(1.2);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredLocation, setHoveredLocation] = useState<number | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapImageRef = useRef<HTMLDivElement>(null);

  const filteredDestinations = touristDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const initializeStreetView = () => {
    if (selectedLocation.arImages && selectedLocation.arImages.length > 0) {
      setIsStreetViewActive(true);
      setCurrentImageIndex(0);
    }
  };

  const closeStreetView = () => {
    setIsStreetViewActive(false);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedLocation.arImages && currentImageIndex < selectedLocation.arImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const previousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Auto-adjust position when zoom changes to keep image visible
  const adjustPositionForZoom = (newScale: number) => {
    const maxMovement = Math.max(50, (newScale - 0.5) * 100);
    setPosition(prevPos => ({
      x: Math.max(-maxMovement, Math.min(maxMovement, prevPos.x)),
      y: Math.max(-maxMovement, Math.min(maxMovement, prevPos.y))
    }));
  };

  // Map interaction handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Dynamic constraints based on zoom level
    // More movement allowed when zoomed in, less when zoomed out
    const maxMovement = Math.max(50, (scale - 0.5) * 100);
    const maxX = maxMovement;
    const maxY = maxMovement;
    const minX = -maxMovement;
    const minY = -maxMovement;
    
    setPosition({
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY))
    });
  }, [isDragging, dragStart, scale]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.5, Math.min(3, scale + delta));
    setScale(newScale);
    adjustPositionForZoom(newScale);
  }, [scale]);

  const zoomIn = () => {
    const newScale = Math.min(3, scale + 0.2);
    setScale(newScale);
    adjustPositionForZoom(newScale);
  };

  const zoomOut = () => {
    const newScale = Math.max(0.5, scale - 0.2);
    setScale(newScale);
    adjustPositionForZoom(newScale);
  };

  const resetView = () => {
    setScale(1.2);
    setPosition({ x: 0, y: 0 });
  };

  const handleLocationClick = (dest: typeof touristDestinations[0]) => {
    setSelectedLocation(dest);
    // Add a subtle animation when selecting
    const element = document.getElementById(`location-${dest.id}`);
    if (element) {
      element.style.animation = 'pulse 0.6s ease-in-out';
      setTimeout(() => {
        element.style.animation = '';
      }, 600);
    }
  };

  // Create an interactive Jharkhand map using the real map image
  const createInteractiveJharkhandMap = () => {
    return (
      <div 
        ref={mapContainerRef}
        className="ar-map-container relative h-96 rounded-lg overflow-hidden border bg-gradient-to-br from-blue-50 to-slate-100 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {/* Expanded Map Image Container with Padding */}
        <div
          ref={mapImageRef}
          className="ar-map-image absolute inset-0"
          style={{
            padding: '10%', // Add 10% padding around the image
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
        >
          <div className="relative w-full h-full">
            <img
              src={jharkhandMapImage}
              alt="Jharkhand Tourism Map"
              className="w-full h-full object-contain" // Changed from object-cover to object-contain
              draggable={false}
              onLoad={() => setIsMapLoaded(true)}
              style={{
                opacity: isMapLoaded ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out'
              }}
            />
            
            {/* Loading State */}
            {!isMapLoaded && (
              <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading Jharkhand Map...</p>
                </div>
              </div>
            )}
            
            {/* Overlay for better pin visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
            
            {/* Tourist Location Pins with Strategic Positioning */}
            {isMapLoaded && touristDestinations.map((dest, index) => {
              // Strategic positioning based on actual Jharkhand geography
              const positions = [
                { left: '45%', top: '25%' }, // Netarhat (Western Jharkhand)
                { left: '40%', top: '35%' }, // Betla National Park
                { left: '65%', top: '45%' }, // Hundru Falls (Near Ranchi)
                { left: '70%', top: '50%' }, // Jonha Falls
                { left: '68%', top: '42%' }, // Dassam Falls
                { left: '85%', top: '20%' }, // Deoghar Temple (Eastern)
                { left: '80%', top: '35%' }, // Parasnath Hill
                { left: '75%', top: '70%' }, // Jamshedpur (Southeastern)
                { left: '55%', top: '30%' }, // Hazaribagh National Park
                { left: '78%', top: '55%' }, // Dhanbad Coal Mines
                { left: '60%', top: '55%' }, // Rajrappa Temple
                { left: '62%', top: '50%' }, // Birsa Zoological Park (Ranchi)
              ];
              
              const pos = positions[index] || { left: '50%', top: '50%' };
              const isSelected = selectedLocation.id === dest.id;
              const isHovered = hoveredLocation === dest.id;
              
              return (
                <div
                  key={dest.id}
                  id={`location-${dest.id}`}
                  className={`ar-map-pin absolute w-8 h-8 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                    isSelected ? 'z-30 scale-125 selected' : isHovered ? 'z-20 scale-110' : 'z-10'
                  }`}
                  style={{
                    left: pos.left,
                    top: pos.top,
                  }}
                  onClick={() => handleLocationClick(dest)}
                  onMouseEnter={() => setHoveredLocation(dest.id)}
                  onMouseLeave={() => setHoveredLocation(null)}
                >
                  {/* Pin Shadow */}
                  <div className={`absolute inset-0 bg-black/30 rounded-full blur-sm transform translate-y-1 ${
                    isSelected || isHovered ? 'scale-150' : ''
                  } transition-all duration-300`} />
                  
                  {/* Animated Pin */}
                  <div className={`relative ${isSelected ? 'animate-bounce' : isHovered ? 'animate-pulse' : ''}`}>
                    <MapPin 
                      className={`w-8 h-8 transition-all duration-300 filter drop-shadow-lg ${
                        isSelected 
                          ? 'text-red-500 animate-pulse' 
                          : isHovered
                          ? 'text-orange-500' 
                          : 'text-blue-500 hover:text-blue-600'
                      }`}
                    />
                    
                    {/* Ripple Effect for Selected */}
                    {isSelected && (
                      <div className="absolute inset-0 -m-2">
                        <div className="w-12 h-12 border-2 border-red-400 rounded-full animate-ping opacity-75" />
                        <div className="absolute inset-0 w-12 h-12 border-2 border-red-300 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.2s' }} />
                      </div>
                    )}
                  </div>
                  
                  {/* Location Label */}
                  {(isSelected || isHovered) && (
                    <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-lg text-xs font-semibold whitespace-nowrap border-2 transition-all duration-200 ${
                      isSelected ? 'border-red-300 bg-red-50' : 'border-blue-300 bg-blue-50'
                    }`}>
                      <div className="text-center">
                        <div className="font-bold">{dest.name}</div>
                        <div className="text-muted-foreground text-xs">{dest.city}</div>
                      </div>
                      {/* Arrow pointing down */}
                      <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                        isSelected ? 'border-t-red-300' : 'border-t-blue-300'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
          <Button
            variant="outline"
            size="sm"
            className="ar-map-control w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={zoomIn}
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ar-map-control w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={zoomOut}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ar-map-control w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={resetView}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Map Legend */}
        <div className="ar-map-legend absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border z-40">
          <h4 className="font-bold text-sm mb-3 text-gray-800">Jharkhand Tourism Map</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">Tourist Destinations</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">Selected Location</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">Hovered Location</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              <div>🔍 Zoom: {(scale * 100).toFixed(0)}%</div>
              <div>🖱️ Drag to explore</div>
            </div>
          </div>
        </div>
        
        {/* Coordinates Display */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg z-40 border">
          <div className="flex items-center gap-2 text-sm">
            <Navigation className="w-4 h-4 text-blue-600" />
            <div>
              <div className="font-semibold text-gray-800">{selectedLocation.name}</div>
              <div className="text-xs text-gray-600">
                {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Grid Overlay for better spatial awareness */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="grid grid-cols-8 grid-rows-6 w-full h-full">
            {Array.from({ length: 48 }, (_, i) => (
              <div key={i} className="border border-gray-400" />
            ))}
          </div>
        </div>
      </div>
    );
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
                  placeholder="Search Jharkhand destinations... (e.g., Netarhat, Ranchi)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm("")}
                disabled={!searchTerm}
              >
                Clear
              </Button>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                {searchTerm ? 'Filtered Destinations' : 'Popular Jharkhand Destinations'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredDestinations.map((dest) => (
                  <Card 
                    key={dest.id}
                    className={`ar-location-card cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      selectedLocation.id === dest.id ? 'ring-2 ring-primary shadow-lg scale-105' : 'hover:shadow-md'
                    }`}
                    onClick={() => handleLocationClick(dest)}
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
              
              {filteredDestinations.length === 0 && searchTerm && (
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
              {createInteractiveJharkhandMap()}
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
                    className="flex items-center gap-2"
                  >
                    <Image className="h-4 w-4" />
                    View AR Images
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
                        <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">AR Street View Ready</p>
                        <p className="text-xs text-muted-foreground">
                          Click "View AR Images" to explore {selectedLocation.name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative h-96 rounded-lg overflow-hidden border">
                        <img
                          src={selectedLocation.arImages[currentImageIndex]}
                          alt={`AR view of ${selectedLocation.name}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Navigation Controls */}
                        {selectedLocation.arImages.length > 1 && (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                              onClick={previousImage}
                              disabled={currentImageIndex === 0}
                            >
                              <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                              onClick={nextImage}
                              disabled={currentImageIndex === selectedLocation.arImages.length - 1}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                            
                            {/* Image Counter */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                              {currentImageIndex + 1} / {selectedLocation.arImages.length}
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Image Thumbnails */}
                      {selectedLocation.arImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {selectedLocation.arImages.map((image, index) => (
                            <div
                              key={index}
                              className={`flex-shrink-0 w-20 h-16 rounded border-2 cursor-pointer overflow-hidden ${
                                index === currentImageIndex ? 'border-primary' : 'border-border'
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            >
                              <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isStreetViewActive && (
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">AR Street View Controls</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use arrow buttons to navigate between AR images</li>
                      <li>• Click thumbnails to jump to specific views</li>
                      <li>• High-quality imagery from tourist locations</li>
                      <li>• Immersive visual experience of {selectedLocation.name}</li>
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
              <Image className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">Visual Exploration</h4>
              <p className="text-sm text-muted-foreground">
                Stunning imagery of Jharkhand destinations
              </p>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <Navigation className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">Interactive Map</h4>
              <p className="text-sm text-muted-foreground">
                Click on map pins to explore locations
              </p>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">Location Details</h4>
              <p className="text-sm text-muted-foreground">
                Coordinates and regional information
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ARMapComponent;
