import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Navigation, Camera, Search, Compass, Eye, Image, ArrowLeft, ArrowRight } from "lucide-react";

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
    lng: 86.4304, 
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

  // Create a realistic Jharkhand map with pinned locations
  const createJharkhandMap = () => {
    const mapStyle = {
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='800' height='600' viewBox='0 0 800 600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='800' height='600' fill='%23f0f8ff'/%3E%3Cpath d='M120 150 Q200 120 300 140 T500 160 Q600 180 680 200 Q700 250 690 320 Q680 400 650 450 Q600 480 520 470 Q450 460 380 450 Q300 440 220 420 Q150 380 130 320 Q110 250 120 150' fill='%23d4edda' stroke='%236b7280' stroke-width='2'/%3E%3Ctext x='400' y='320' text-anchor='middle' fill='%23374151' font-family='sans-serif' font-size='20' font-weight='bold'%3EJHARKHAND%3C/text%3E%3C/svg%3E")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };

    return (
      <div className="relative h-96 rounded-lg overflow-hidden border" style={mapStyle}>
        {/* Add location pins */}
        {touristDestinations.map((dest, index) => (
          <div
            key={dest.id}
            className={`absolute w-6 h-6 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              selectedLocation.id === dest.id ? 'z-20' : 'z-10'
            }`}
            style={{
              left: `${20 + (index % 4) * 20}%`,
              top: `${25 + Math.floor(index / 4) * 15}%`
            }}
            onClick={() => setSelectedLocation(dest)}
          >
            <div className={`relative ${selectedLocation.id === dest.id ? 'animate-bounce' : ''}`}>
              <MapPin 
                className={`w-6 h-6 ${
                  selectedLocation.id === dest.id 
                    ? 'text-red-500 drop-shadow-lg' 
                    : 'text-blue-500 hover:text-red-400'
                } transition-colors`}
              />
              {selectedLocation.id === dest.id && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-semibold whitespace-nowrap border">
                  {dest.name}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
          <h4 className="font-semibold text-sm mb-2">Jharkhand Tourism Map</h4>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Tourist Destinations</span>
          </div>
          <div className="flex items-center gap-2 text-xs mt-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Selected Location</span>
          </div>
        </div>
        
        {/* Coordinates Display */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded shadow text-xs">
          <div className="flex items-center gap-1">
            <Navigation className="w-3 h-3" />
            <span>{selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</span>
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
              {createJharkhandMap()}
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
