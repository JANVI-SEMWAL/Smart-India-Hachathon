import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Layout from "@/components/layout/Layout";
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Camera,
  Heart,
  Share2,
  Navigation,
  Info,
  Mountain,
  TreePine,
  Building,
  Calendar,
  Phone,
  Globe,
  Award,
  BookOpen,
  History,
  Sparkles
} from "lucide-react";

const Recommendations = () => {
  const [activeTab, setActiveTab] = useState("popular");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [selectedDestinations, setSelectedDestinations] = useState([]);

  const popularSpots = [
    {
      id: 1,
      name: "Netarhat - Queen of Chotanagpur",
      location: "Latehar District",
      category: "Hill Station",
      rating: 4.8,
      visitors: "50K+ annually",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      description: "Known as the 'Queen of Chotanagpur', Netarhat offers breathtaking sunrise and sunset views from Magnolia Point and Sunset Point.",
      historicalInfo: "Netarhat was discovered by British officials in the 19th century as a summer retreat. The name 'Netarhat' means 'the place where the sun sets' in local dialect.",
      bestTimeToVisit: "October to March",
      entryFee: "Free",
      distance: "156 km from Ranchi",
      highlights: ["Sunrise Point", "Sunset Point", "Magnolia Point", "Pine Forest"],
      culturalSignificance: "Sacred to local tribes, especially during Sarhul festival",
      tags: ["Hill Station", "Nature", "Photography", "Sunrise/Sunset"]
    },
    {
      id: 2,
      name: "Betla National Park",
      location: "Palamu District",
      category: "Wildlife Sanctuary",
      rating: 4.6,
      visitors: "25K+ annually",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
      description: "Jharkhand's only national park, home to tigers, elephants, and diverse wildlife in a pristine forest setting.",
      historicalInfo: "Established in 1986, Betla was once part of the Palamu Tiger Reserve. The park contains ancient ruins of the Chero dynasty from the 16th century.",
      bestTimeToVisit: "November to April",
      entryFee: "₹50 for Indians, ₹500 for foreigners",
      distance: "140 km from Ranchi",
      highlights: ["Tiger Safari", "Elephant Rides", "Ancient Ruins", "Bird Watching"],
      culturalSignificance: "Contains historical ruins of the Chero dynasty and is considered sacred by local tribes",
      tags: ["Wildlife", "Safari", "History", "Adventure"]
    },
    {
      id: 3,
      name: "Dassam Falls",
      location: "Ranchi District",
      category: "Waterfall",
      rating: 4.7,
      visitors: "100K+ annually",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
      description: "A magnificent 144-foot high waterfall formed by the Kanchi River, surrounded by lush greenery and rocky terrain.",
      historicalInfo: "The falls get their name from 'Dassam' meaning 'ten' in local language, possibly referring to ten streams that merge here. It's been a popular picnic spot since colonial times.",
      bestTimeToVisit: "July to October (monsoon season)",
      entryFee: "₹20 per person",
      distance: "40 km from Ranchi",
      highlights: ["Waterfall Viewing", "Swimming", "Picnic Spots", "Photography"],
      culturalSignificance: "Considered sacred by local communities, especially during monsoon festivals",
      tags: ["Waterfall", "Nature", "Monsoon", "Family"]
    },
    {
      id: 4,
      name: "Hundru Falls",
      location: "Ranchi District",
      category: "Waterfall",
      rating: 4.5,
      visitors: "80K+ annually",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
      description: "One of the highest waterfalls in Jharkhand at 98 meters, formed by the Subarnarekha River during monsoon.",
      historicalInfo: "Named after the local village 'Hundru', this waterfall has been a natural wonder for centuries. The Subarnarekha River, meaning 'streak of gold', has historical significance in local folklore.",
      bestTimeToVisit: "July to September",
      entryFee: "₹15 per person",
      distance: "45 km from Ranchi",
      highlights: ["High Waterfall", "River Rafting", "Rock Climbing", "Nature Trails"],
      culturalSignificance: "The Subarnarekha River is considered sacred and features in many local legends",
      tags: ["Waterfall", "Adventure", "Monsoon", "River"]
    },
    {
      id: 5,
      name: "Jagannath Temple, Ranchi",
      location: "Ranchi",
      category: "Religious Site",
      rating: 4.4,
      visitors: "200K+ annually",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      description: "A beautiful temple dedicated to Lord Jagannath, known for its unique architecture and peaceful atmosphere.",
      historicalInfo: "Built in 1691, this temple is one of the oldest in Jharkhand. It was constructed by King Thakur Ani Nath Shahdeo and is a replica of the famous Jagannath Temple in Puri.",
      bestTimeToVisit: "Year-round, especially during Rath Yatra",
      entryFee: "Free",
      distance: "5 km from Ranchi city center",
      highlights: ["Temple Architecture", "Rath Yatra Festival", "Spiritual Experience", "Cultural Events"],
      culturalSignificance: "One of the most important Hindu temples in Jharkhand, especially during the annual Rath Yatra",
      tags: ["Temple", "Religious", "Architecture", "Festival"]
    },
    {
      id: 6,
      name: "Patratu Valley",
      location: "Ramgarh District",
      category: "Valley",
      rating: 4.3,
      visitors: "30K+ annually",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      description: "A scenic valley surrounded by hills, known for its natural beauty and the Patratu Dam reservoir.",
      historicalInfo: "The valley was developed around the Patratu Dam, built in 1954 for irrigation and hydroelectric power. The area has been inhabited by tribal communities for centuries.",
      bestTimeToVisit: "October to March",
      entryFee: "Free",
      distance: "40 km from Ranchi",
      highlights: ["Dam View", "Boating", "Nature Walks", "Photography"],
      culturalSignificance: "Home to several tribal communities with rich cultural traditions",
      tags: ["Valley", "Dam", "Nature", "Boating"]
    }
  ];

  const historicalSites = [
    {
      id: 1,
      name: "Palamu Fort",
      location: "Palamu District",
      category: "Historical Fort",
      rating: 4.2,
      visitors: "15K+ annually",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      description: "Ancient fort built by the Chero dynasty in the 16th century, showcasing medieval architecture and strategic military design.",
      historicalInfo: "Built by Raja Medini Ray in 1660, this fort was the stronghold of the Chero dynasty. It witnessed several battles and was eventually captured by the British in 1771. The fort's architecture reflects a blend of Hindu and Islamic styles.",
      bestTimeToVisit: "October to March",
      entryFee: "₹25 per person",
      distance: "180 km from Ranchi",
      highlights: ["Ancient Architecture", "Historical Ruins", "Museum", "Photography"],
      culturalSignificance: "Symbol of resistance against British rule and center of Chero dynasty power",
      tags: ["Fort", "History", "Architecture", "Museum"]
    },
    {
      id: 2,
      name: "Deoghar - Baidyanath Temple",
      location: "Deoghar District",
      category: "Religious Site",
      rating: 4.9,
      visitors: "500K+ annually",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      description: "One of the twelve Jyotirlingas in India, this ancient temple is a major pilgrimage site for devotees of Lord Shiva.",
      historicalInfo: "The temple is mentioned in ancient texts and has been a pilgrimage site for over 2000 years. The current structure was built in the 18th century by Raja Bir Singh Deo. It's one of the most sacred Shiva temples in India.",
      bestTimeToVisit: "Year-round, especially during Shravan month",
      entryFee: "Free",
      distance: "250 km from Ranchi",
      highlights: ["Jyotirlinga", "Shravan Mela", "Spiritual Experience", "Cultural Festivals"],
      culturalSignificance: "One of the 12 Jyotirlingas, making it one of the most sacred Hindu pilgrimage sites",
      tags: ["Temple", "Pilgrimage", "Spiritual", "Festival"]
    }
  ];

  const culturalSites = [
    {
      id: 1,
      name: "Tribal Museum, Ranchi",
      location: "Ranchi",
      category: "Museum",
      rating: 4.5,
      visitors: "40K+ annually",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      description: "A comprehensive museum showcasing the rich tribal culture, artifacts, and traditions of Jharkhand's indigenous communities.",
      historicalInfo: "Established in 2009, the museum houses over 2000 artifacts representing the culture of 32 tribal communities of Jharkhand. It's a living testament to the state's tribal heritage.",
      bestTimeToVisit: "Year-round",
      entryFee: "₹10 per person",
      distance: "8 km from Ranchi city center",
      highlights: ["Tribal Artifacts", "Cultural Exhibits", "Traditional Crafts", "Educational Tours"],
      culturalSignificance: "Preserves and promotes the rich tribal heritage of Jharkhand",
      tags: ["Museum", "Culture", "Tribal", "Education"]
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "hill station": return Mountain;
      case "wildlife sanctuary": return TreePine;
      case "waterfall": return TreePine;
      case "religious site": return Building;
      case "valley": return Mountain;
      case "historical fort": return Building;
      case "museum": return BookOpen;
      default: return MapPin;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "hill station": return "bg-adventure-blue/10 text-adventure-blue border-adventure-blue/20";
      case "wildlife sanctuary": return "bg-eco-green/10 text-eco-green border-eco-green/20";
      case "waterfall": return "bg-primary/10 text-primary border-primary/20";
      case "religious site": return "bg-cultural-orange/10 text-cultural-orange border-cultural-orange/20";
      case "valley": return "bg-eco-green/10 text-eco-green border-eco-green/20";
      case "historical fort": return "bg-accent/10 text-accent border-accent/20";
      case "museum": return "bg-cultural-orange/10 text-cultural-orange border-cultural-orange/20";
      default: return "bg-secondary text-secondary-foreground border-border";
    }
  };

  const allSpots = [...popularSpots, ...historicalSites, ...culturalSites];

  const getFilteredSpots = (spots: any[]) => {
    if (selectedCategory === "all") return spots;
    
    return spots.filter(spot => {
      const categoryMap = {
        "hill-station": "Hill Station",
        "waterfall": "Waterfall", 
        "wildlife": "Wildlife Sanctuary",
        "temple": "Religious Site",
        "historical": "Historical Fort",
        "cultural": "Museum"
      };
      
      return spot.category === categoryMap[selectedCategory as keyof typeof categoryMap];
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/20 to-cultural-orange/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Discover Jharkhand's Hidden Gems
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore the most popular and culturally significant destinations in Jharkhand, each with its own unique history and charm
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">50+</div>
              <div className="text-sm text-muted-foreground">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">500K+</div>
              <div className="text-sm text-muted-foreground">Annual Visitors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">4.6★</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">2000+</div>
              <div className="text-sm text-muted-foreground">Years of History</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { id: "all", name: "All Places", icon: MapPin, count: "15" },
              { id: "hill-station", name: "Hill Stations", icon: Mountain, count: "3" },
              { id: "waterfall", name: "Waterfalls", icon: TreePine, count: "2" },
              { id: "wildlife", name: "Wildlife", icon: TreePine, count: "1" },
              { id: "temple", name: "Temples", icon: Building, count: "2" },
              { id: "historical", name: "Historical", icon: BookOpen, count: "2" },
              { id: "cultural", name: "Cultural", icon: History, count: "1" }
            ].map((category) => (
              <Card 
                key={category.id} 
                className={`travel-card group cursor-pointer transition-all ${
                  selectedCategory === category.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <category.icon className={`h-8 w-8 mx-auto mb-2 group-hover:scale-110 transition-transform ${
                    selectedCategory === category.id ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <p className={`text-sm font-medium ${
                    selectedCategory === category.id ? 'text-primary' : 'text-foreground'
                  }`}>{category.name}</p>
                  <p className="text-xs text-muted-foreground">{category.count} places</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommendations Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="popular">Popular Spots</TabsTrigger>
              <TabsTrigger value="historical">Historical Sites</TabsTrigger>
              <TabsTrigger value="cultural">Cultural Sites</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="popular">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {getFilteredSpots(popularSpots).map((spot) => {
                const CategoryIcon = getCategoryIcon(spot.category);
                return (
                  <Dialog key={spot.id}>
                    <DialogTrigger asChild>
                      <Card className="travel-card group overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                        <div className="relative">
                          <img 
                            src={spot.image} 
                            alt={spot.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-3 left-3">
                            <Badge className={getCategoryColor(spot.category)}>
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {spot.category}
                            </Badge>
                          </div>
                          
                          <div className="absolute top-3 right-3 flex gap-2">
                            <Badge className="bg-warning-amber text-white">
                              <Star className="h-3 w-3 mr-1" />
                              {spot.rating}
                            </Badge>
                            <Button variant="ghost" size="icon" className="bg-background/80 hover:bg-background">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <div className="space-y-3">
                            {/* Title */}
                            <h3 className="text-xl font-semibold text-foreground line-clamp-2">
                              {spot.name}
                            </h3>

                            {/* Location */}
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{spot.location}</span>
                            </div>

                            {/* Description */}
                            <p className="text-muted-foreground line-clamp-2">
                              {spot.description}
                            </p>

                            {/* Historical Info */}
                            <div className="bg-muted/50 rounded-lg p-3">
                              <div className="flex items-start space-x-2">
                                <History className="h-4 w-4 text-cultural-orange mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-foreground">Historical Significance</p>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{spot.historicalInfo}</p>
                                </div>
                              </div>
                            </div>

                            {/* Quick Info */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span>{spot.bestTimeToVisit}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span>{spot.visitors}</span>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                              {spot.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{spot.name}</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Hero Image */}
                        <div className="relative">
                          <img 
                            src={spot.image} 
                            alt={spot.name}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className={getCategoryColor(spot.category)}>
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {spot.category}
                            </Badge>
                          </div>
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-warning-amber text-white">
                              <Star className="h-3 w-3 mr-1" />
                              {spot.rating}
                            </Badge>
                          </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Location Details</h3>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{spot.location}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Best Time: {spot.bestTimeToVisit}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{spot.visitors} visitors annually</span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium">Entry Fee: {spot.entryFee}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium">Distance: {spot.distance}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {spot.highlights.map((highlight, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {highlight}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Historical Information */}
                        <div className="bg-muted/50 rounded-lg p-6">
                          <div className="flex items-start space-x-3">
                            <History className="h-6 w-6 text-cultural-orange mt-1 flex-shrink-0" />
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Historical Significance</h3>
                              <p className="text-muted-foreground leading-relaxed">{spot.historicalInfo}</p>
                            </div>
                          </div>
                        </div>

                        {/* Cultural Significance */}
                        <div className="bg-primary/5 rounded-lg p-6">
                          <div className="flex items-start space-x-3">
                            <Sparkles className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Cultural Significance</h3>
                              <p className="text-muted-foreground leading-relaxed">{spot.culturalSignificance}</p>
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {spot.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="historical">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {historicalSites.map((site) => {
                const CategoryIcon = getCategoryIcon(site.category);
                return (
                  <Card key={site.id} className="travel-card group overflow-hidden">
                    <div className="relative">
                      <img 
                        src={site.image} 
                        alt={site.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3">
                        <Badge className={getCategoryColor(site.category)}>
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {site.category}
                        </Badge>
                      </div>
                      
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Badge className="bg-warning-amber text-white">
                          <Star className="h-3 w-3 mr-1" />
                          {site.rating}
                        </Badge>
                        <Button variant="ghost" size="icon" className="bg-background/80 hover:bg-background">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {/* Title */}
                        <h3 className="text-xl font-semibold text-foreground line-clamp-2">
                          {site.name}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{site.location}</span>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground line-clamp-2">
                          {site.description}
                        </p>

                        {/* Historical Info */}
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <History className="h-4 w-4 text-cultural-orange mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Historical Background</p>
                              <p className="text-xs text-muted-foreground line-clamp-3">{site.historicalInfo}</p>
                            </div>
                          </div>
                        </div>

                        {/* Quick Info */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{site.bestTimeToVisit}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{site.visitors}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {site.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-3">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Info className="h-4 w-4 mr-1" />
                            Learn More
                          </Button>
                          <Button variant="cultural" size="sm" className="flex-1">
                            <Navigation className="h-4 w-4 mr-1" />
                            Get Directions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="cultural">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {culturalSites.map((site) => {
                const CategoryIcon = getCategoryIcon(site.category);
                return (
                  <Card key={site.id} className="travel-card group overflow-hidden">
                    <div className="relative">
                      <img 
                        src={site.image} 
                        alt={site.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3">
                        <Badge className={getCategoryColor(site.category)}>
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {site.category}
                        </Badge>
                      </div>
                      
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Badge className="bg-warning-amber text-white">
                          <Star className="h-3 w-3 mr-1" />
                          {site.rating}
                        </Badge>
                        <Button variant="ghost" size="icon" className="bg-background/80 hover:bg-background">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {/* Title */}
                        <h3 className="text-xl font-semibold text-foreground line-clamp-2">
                          {site.name}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{site.location}</span>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground line-clamp-2">
                          {site.description}
                        </p>

                        {/* Cultural Info */}
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <Sparkles className="h-4 w-4 text-cultural-orange mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Cultural Significance</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{site.culturalSignificance}</p>
                            </div>
                          </div>
                        </div>

                        {/* Quick Info */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{site.bestTimeToVisit}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{site.visitors}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {site.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-3">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Info className="h-4 w-4 mr-1" />
                            Learn More
                          </Button>
                          <Button variant="cultural" size="sm" className="flex-1">
                            <Navigation className="h-4 w-4 mr-1" />
                            Get Directions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Featured Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Featured Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="travel-card overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop" 
                      alt="Netarhat"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">Netarhat - Queen of Chotanagpur</h3>
                      <p className="text-sm opacity-90">Experience breathtaking sunrises and sunsets</p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-warning-amber text-white">
                        <Star className="h-3 w-3 mr-1" />
                        4.8
                      </Badge>
                    </div>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Netarhat - Queen of Chotanagpur</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop" 
                      alt="Netarhat"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-warning-amber text-white">
                        <Star className="h-3 w-3 mr-1" />
                        4.8
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Location Details</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Latehar District, Jharkhand</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Best Time: October to March</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>50K+ visitors annually</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Entry Fee: Free</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Distance: 156 km from Ranchi</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {["Sunrise Point", "Sunset Point", "Magnolia Point", "Pine Forest"].map((highlight, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <History className="h-6 w-6 text-cultural-orange mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Historical Significance</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Netarhat was discovered by British officials in the 19th century as a summer retreat. 
                          The name 'Netarhat' means 'the place where the sun sets' in local dialect. 
                          It's known as the 'Queen of Chotanagpur' and offers breathtaking sunrise and sunset views.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button 
                      variant="cultural" 
                      size="lg"
                      onClick={() => {
                        setSelectedDestinations([...selectedDestinations, "Netarhat"]);
                        alert("Netarhat added to your itinerary!");
                      }}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Add to Itinerary
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Card className="travel-card overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=300&fit=crop" 
                      alt="Deoghar Temple"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">Deoghar - Baidyanath Temple</h3>
                      <p className="text-sm opacity-90">One of the 12 Jyotirlingas in India</p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-warning-amber text-white">
                        <Star className="h-3 w-3 mr-1" />
                        4.9
                      </Badge>
                    </div>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Deoghar - Baidyanath Temple</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=300&fit=crop" 
                      alt="Baidyanath Temple"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-warning-amber text-white">
                        <Star className="h-3 w-3 mr-1" />
                        4.9
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Location Details</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Deoghar District, Jharkhand</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Best Time: Year-round, especially during Shravan month</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>500K+ visitors annually</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Entry Fee: Free</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Distance: 250 km from Ranchi</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {["Jyotirlinga", "Shravan Mela", "Spiritual Experience", "Cultural Festivals"].map((highlight, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <History className="h-6 w-6 text-cultural-orange mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Historical Significance</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          The temple is mentioned in ancient texts and has been a pilgrimage site for over 2000 years. 
                          The current structure was built in the 18th century by Raja Bir Singh Deo. 
                          It's one of the most sacred Shiva temples in India and one of the 12 Jyotirlingas.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button 
                      variant="cultural" 
                      size="lg"
                      onClick={() => {
                        setSelectedDestinations([...selectedDestinations, "Deoghar - Baidyanath Temple"]);
                        alert("Deoghar - Baidyanath Temple added to your itinerary!");
                      }}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Add to Itinerary
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>


        {/* Itinerary Modal */}
        <Dialog open={showItineraryModal} onOpenChange={setShowItineraryModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Plan Your Jharkhand Itinerary</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Selected Destinations ({selectedDestinations.length})</h3>
                {selectedDestinations.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDestinations.map((destination, index) => (
                      <div key={index} className="flex items-center justify-between bg-background p-2 rounded">
                        <span>{destination}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedDestinations(selectedDestinations.filter((_, i) => i !== index))}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No destinations selected yet. Click "Add to Itinerary" on any destination to get started!</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Trip Duration</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>1 Day</option>
                    <option>2 Days</option>
                    <option>3 Days</option>
                    <option>1 Week</option>
                    <option>2 Weeks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Travel Style</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Adventure</option>
                    <option>Cultural</option>
                    <option>Religious</option>
                    <option>Nature</option>
                    <option>Mixed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Special Interests</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["Photography", "Wildlife", "Temples", "Waterfalls", "Trekking", "Festivals", "Food", "History"].map((interest) => (
                    <label key={interest} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowItineraryModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="cultural" 
                  className="flex-1"
                  onClick={() => {
                    alert(`🎉 Your Jharkhand Itinerary is Ready!\n\nDestinations: ${selectedDestinations.length}\n\nWe'll send you a detailed itinerary with:\n• Day-by-day schedule\n• Transportation options\n• Accommodation suggestions\n• Local tips and recommendations\n\nCheck your email for the complete itinerary!`);
                    setShowItineraryModal(false);
                  }}
                >
                  Generate Itinerary
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Recommendations;
