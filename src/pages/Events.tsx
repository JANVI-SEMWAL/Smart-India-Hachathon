import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star,
  Ticket,
  Filter,
  Search,
  Heart,
  Share2,
  Music,
  Camera,
  Utensils,
  TreePine,
  Mountain,
  Building,
  Sparkles,
  Info
} from "lucide-react";

const Events = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState("2024-03-15");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const events = [
    {
      id: 1,
      title: "Sarhul Festival Celebration",
      date: "2024-03-15",
      time: "06:00 AM - 10:00 PM",
      location: "Ranchi, Various Villages",
      category: "Cultural Festival",
      price: "Free",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&q=80",
      description: "Join the grand celebration of spring and nature worship by tribal communities. Experience traditional dances, music, and rituals that have been passed down for generations.",
      organizer: "Jharkhand Tourism Board",
      attendees: 5000,
      rating: 4.9,
      featured: true,
      tags: ["Cultural", "Free", "Family-friendly", "Traditional"],
      eventType: "Festival",
      culturalSignificance: "Sarhul is the most important festival of the Sarna religion, celebrating the marriage of Earth and Sun. It marks the beginning of the agricultural year.",
      activities: ["Traditional Dance Performances", "Folk Music", "Ritual Ceremonies", "Local Food Stalls", "Artisan Markets"],
      duration: "Full Day",
      ageGroup: "All Ages",
      language: "Hindi, Santhali, Mundari"
    },
    {
      id: 2,
      title: "Eco-Tourism Photography Workshop",
      date: "2024-03-20",
      time: "07:00 AM - 05:00 PM",
      location: "Netarhat, Jharkhand",
      category: "Workshop",
      price: "₹2,500",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&q=80",
      description: "Learn wildlife and landscape photography in Jharkhand's scenic locations",
      organizer: "Nature Lens Studio",
      attendees: 25,
      rating: 4.8,
      featured: true,
      tags: ["Photography", "Nature", "Small Group", "Skill Building"]
    },
    {
      id: 3,
      title: "Tribal Cooking Masterclass",
      date: "2024-03-25",
      time: "10:00 AM - 04:00 PM",
      location: "Khunti Village",
      category: "Culinary Experience",
      price: "₹1,200",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&q=80",
      description: "Learn authentic tribal recipes and traditional cooking methods",
      organizer: "Munda Cultural Center",
      attendees: 15,
      rating: 4.9,
      featured: false,
      tags: ["Food", "Cultural", "Hands-on", "Traditional"]
    },
    {
      id: 4,
      title: "Lodh Falls Trekking Expedition",
      date: "2024-03-30",
      time: "05:00 AM - 08:00 PM",
      location: "Lodh Falls, Latehar",
      category: "Adventure",
      price: "₹800",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop&q=80",
      description: "Guided trek to Jharkhand's highest waterfall with local experts",
      organizer: "Adventure Jharkhand",
      attendees: 30,
      rating: 4.7,
      featured: false,
      tags: ["Adventure", "Trekking", "Nature", "Guide Included"]
    },
    {
      id: 5,
      title: "Dhokra Art Workshop",
      date: "2024-04-05",
      time: "09:00 AM - 05:00 PM",
      location: "Chaibasa Art Center",
      category: "Art Workshop",
      price: "₹1,800",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&q=80",
      description: "Learn the ancient lost-wax casting technique from master artisans",
      organizer: "Traditional Arts Collective",
      attendees: 12,
      rating: 4.8,
      featured: true,
      tags: ["Art", "Traditional", "Handicraft", "Small Group"]
    },
    {
      id: 6,
      title: "Karma Festival Folk Music Concert",
      date: "2024-08-15",
      time: "06:00 PM - 11:00 PM",
      location: "Jamshedpur Cultural Complex",
      category: "Music Festival",
      price: "₹500",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&q=80",
      description: "Experience traditional folk music and dance performances celebrating the Karma festival, a major tribal festival of Jharkhand",
      organizer: "Folk Music Society",
      attendees: 800,
      rating: 4.6,
      featured: false,
      tags: ["Music", "Dance", "Cultural", "Evening Event"],
      eventType: "Festival",
      culturalSignificance: "Karma is a major tribal festival celebrated in Jharkhand, marking the worship of the Karma tree and celebrating nature's bounty.",
      activities: ["Folk Music Performances", "Traditional Dance", "Cultural Exhibitions", "Local Cuisine", "Artisan Workshops"],
      duration: "5 Hours",
      ageGroup: "All Ages",
      language: "Hindi, Santhali, Mundari, Ho"
    },
    {
      id: 7,
      title: "Chhau Dance Festival",
      date: "2024-04-10",
      time: "07:00 PM - 10:00 PM",
      location: "Seraikela, Jharkhand",
      category: "Dance Festival",
      price: "₹300",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&q=80",
      description: "Witness the mesmerizing Chhau dance, a UNESCO Intangible Cultural Heritage, performed by master artists from Seraikela",
      organizer: "Seraikela Chhau Academy",
      attendees: 1200,
      rating: 4.8,
      featured: true,
      tags: ["Dance", "UNESCO Heritage", "Traditional", "Cultural"],
      eventType: "Cultural Performance",
      culturalSignificance: "Chhau dance is a UNESCO Intangible Cultural Heritage, representing the rich martial arts and dance traditions of Jharkhand.",
      activities: ["Chhau Dance Performances", "Martial Arts Display", "Traditional Music", "Cultural Workshops", "Heritage Exhibition"],
      duration: "3 Hours",
      ageGroup: "All Ages",
      language: "Hindi, Odia"
    },
    {
      id: 8,
      title: "Jharkhand Handicrafts Fair",
      date: "2024-12-01",
      time: "10:00 AM - 08:00 PM",
      location: "Morabadi Ground, Ranchi",
      category: "Craft Fair",
      price: "₹50",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&q=80",
      description: "Explore the rich handicraft traditions of Jharkhand with live demonstrations, workshops, and direct purchases from artisans",
      organizer: "Jharkhand Handicrafts Development Corporation",
      attendees: 3000,
      rating: 4.7,
      featured: true,
      tags: ["Handicrafts", "Artisan", "Shopping", "Cultural"],
      eventType: "Exhibition",
      culturalSignificance: "Showcases the traditional handicrafts of Jharkhand including Dhokra, Tasar silk, and tribal art forms.",
      activities: ["Live Craft Demonstrations", "Artisan Workshops", "Cultural Performances", "Food Stalls", "Shopping"],
      duration: "10 Hours",
      ageGroup: "All Ages",
      language: "Hindi, English"
    },
    {
      id: 9,
      title: "Tusu Festival Celebration",
      date: "2024-01-15",
      time: "06:00 AM - 06:00 PM",
      location: "Various Villages, Jharkhand",
      category: "Harvest Festival",
      price: "Free",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&q=80",
      description: "Celebrate the Tusu harvest festival with traditional songs, dances, and community feasts in tribal villages",
      organizer: "Local Tribal Communities",
      attendees: 2000,
      rating: 4.9,
      featured: false,
      tags: ["Harvest", "Community", "Traditional", "Village"],
      eventType: "Festival",
      culturalSignificance: "Tusu is a major harvest festival celebrated by tribal communities, marking the end of the agricultural season.",
      activities: ["Traditional Songs", "Community Dances", "Harvest Rituals", "Village Feasts", "Cultural Games"],
      duration: "12 Hours",
      ageGroup: "All Ages",
      language: "Santhali, Mundari, Ho"
    },
    {
      id: 10,
      title: "Jharkhand Food Festival",
      date: "2024-11-20",
      time: "11:00 AM - 09:00 PM",
      location: "Albert Ekka Chowk, Ranchi",
      category: "Food Festival",
      price: "₹100",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&q=80",
      description: "Savor the authentic flavors of Jharkhand with traditional dishes, cooking demonstrations, and cultural performances",
      organizer: "Jharkhand Tourism & Food Department",
      attendees: 5000,
      rating: 4.6,
      featured: true,
      tags: ["Food", "Traditional", "Cultural", "Family"],
      eventType: "Food Festival",
      culturalSignificance: "Celebrates the diverse culinary heritage of Jharkhand, featuring traditional tribal and regional cuisines.",
      activities: ["Food Stalls", "Cooking Demonstrations", "Cultural Performances", "Food Competitions", "Cultural Workshops"],
      duration: "10 Hours",
      ageGroup: "All Ages",
      language: "Hindi, English"
    },
    {
      id: 11,
      title: "Sohrai Festival - Tribal Art Exhibition",
      date: "2024-11-01",
      time: "09:00 AM - 06:00 PM",
      location: "Hazaribagh, Jharkhand",
      category: "Art Exhibition",
      price: "Free",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&q=80",
      description: "Celebrate the Sohrai festival with traditional tribal wall paintings, folk art demonstrations, and cultural performances by local artists",
      organizer: "Hazaribagh Tribal Art Society",
      attendees: 1500,
      rating: 4.8,
      featured: true,
      tags: ["Art", "Tribal", "Traditional", "Cultural"],
      eventType: "Cultural Exhibition",
      culturalSignificance: "Sohrai is a harvest festival where tribal women create beautiful wall paintings using natural colors, representing their connection with nature and ancestors.",
      activities: ["Wall Painting Workshops", "Folk Art Demonstrations", "Cultural Performances", "Artisan Markets", "Traditional Music"],
      duration: "9 Hours",
      ageGroup: "All Ages",
      language: "Hindi, Santhali, Mundari"
    },
    {
      id: 12,
      title: "Jharkhand Tribal Dance Competition",
      date: "2024-05-20",
      time: "06:00 PM - 10:00 PM",
      location: "JRD Tata Sports Complex, Jamshedpur",
      category: "Dance Competition",
      price: "₹200",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&q=80",
      description: "Witness the most authentic tribal dance performances from across Jharkhand, featuring traditional dances like Jhumair, Paika, and Chhau",
      organizer: "Jharkhand Cultural Department",
      attendees: 2500,
      rating: 4.9,
      featured: true,
      tags: ["Dance", "Competition", "Traditional", "Cultural"],
      eventType: "Cultural Performance",
      culturalSignificance: "Showcases the rich diversity of tribal dance forms in Jharkhand, preserving and promoting traditional cultural expressions.",
      activities: ["Traditional Dance Performances", "Cultural Competitions", "Folk Music", "Tribal Costume Display", "Cultural Workshops"],
      duration: "4 Hours",
      ageGroup: "All Ages",
      language: "Hindi, Santhali, Mundari, Ho, Kurukh"
    },
    {
      id: 13,
      title: "Baba Baidyanath Dham Yatra",
      date: "2024-07-15",
      time: "04:00 AM - 11:00 PM",
      location: "Deoghar, Jharkhand",
      category: "Religious Pilgrimage",
      price: "Free",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&q=80",
      description: "Join the sacred pilgrimage to one of the 12 Jyotirlingas, experiencing the spiritual journey and cultural traditions of devotees",
      organizer: "Baba Baidyanath Temple Trust",
      attendees: 10000,
      rating: 4.9,
      featured: true,
      tags: ["Pilgrimage", "Religious", "Spiritual", "Traditional"],
      eventType: "Religious Festival",
      culturalSignificance: "One of the most sacred Hindu pilgrimage sites, attracting millions of devotees during the Shravan month for the holy yatra.",
      activities: ["Temple Darshan", "Religious Rituals", "Cultural Processions", "Spiritual Discourses", "Community Feasts"],
      duration: "19 Hours",
      ageGroup: "All Ages",
      language: "Hindi, Sanskrit, Bengali"
    },
    {
      id: 14,
      title: "Jharkhand Traditional Music Festival",
      date: "2024-09-10",
      time: "05:00 PM - 11:00 PM",
      location: "Birsa Munda Park, Ranchi",
      category: "Music Festival",
      price: "₹300",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&q=80",
      description: "Experience the soulful traditional music of Jharkhand featuring folk songs, tribal instruments, and cultural performances",
      organizer: "Jharkhand Music Academy",
      attendees: 3000,
      rating: 4.7,
      featured: false,
      tags: ["Music", "Folk", "Traditional", "Cultural"],
      eventType: "Music Festival",
      culturalSignificance: "Celebrates the rich musical heritage of Jharkhand's tribal communities, featuring traditional instruments and folk songs passed down through generations.",
      activities: ["Folk Music Performances", "Traditional Instrument Showcase", "Cultural Singing", "Music Workshops", "Cultural Exchange"],
      duration: "6 Hours",
      ageGroup: "All Ages",
      language: "Hindi, Santhali, Mundari, Ho"
    },
    {
      id: 15,
      title: "Jharkhand Tribal Cuisine Festival",
      date: "2024-10-05",
      time: "11:00 AM - 09:00 PM",
      location: "Albert Ekka Chowk, Ranchi",
      category: "Food Festival",
      price: "₹150",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&q=80",
      description: "Savor authentic tribal cuisine from different communities of Jharkhand, prepared using traditional methods and local ingredients",
      organizer: "Jharkhand Tribal Food Society",
      attendees: 4000,
      rating: 4.8,
      featured: true,
      tags: ["Food", "Tribal", "Traditional", "Cuisine"],
      eventType: "Food Festival",
      culturalSignificance: "Showcases the diverse culinary traditions of Jharkhand's tribal communities, featuring traditional cooking methods and indigenous ingredients.",
      activities: ["Traditional Cooking Demonstrations", "Tribal Food Stalls", "Culinary Workshops", "Cultural Performances", "Food Competitions"],
      duration: "10 Hours",
      ageGroup: "All Ages",
      language: "Hindi, English"
    }
  ];

  const categories = [
    { id: "all", name: "All Events", icon: Calendar },
    { id: "cultural", name: "Cultural", icon: Music },
    { id: "adventure", name: "Adventure", icon: Mountain },
    { id: "workshop", name: "Workshops", icon: Camera },
    { id: "food", name: "Food & Culinary", icon: Utensils },
    { id: "nature", name: "Nature & Eco", icon: TreePine },
    { id: "dance", name: "Dance", icon: Music },
    { id: "religious", name: "Religious", icon: Building },
    { id: "art", name: "Art & Craft", icon: Camera }
  ];

  const getFilteredEvents = (eventsList: any[]) => {
    let filtered = eventsList;
    
    // Filter by category
    if (selectedCategory !== "all") {
      const categoryMap = {
        "cultural": ["Cultural Festival", "Music Festival", "Dance Festival", "Cultural Performance", "Cultural Exhibition"],
        "adventure": ["Adventure"],
        "workshop": ["Workshop", "Art Workshop"],
        "food": ["Food Festival", "Culinary Experience"],
        "nature": ["Eco-Tourism"],
        "dance": ["Dance Festival", "Dance Competition"],
        "religious": ["Religious Pilgrimage"],
        "art": ["Art Exhibition", "Art Workshop"]
      };
      
      const categoryTypes = categoryMap[selectedCategory as keyof typeof categoryMap] || [];
      filtered = filtered.filter(event => categoryTypes.includes(event.category));
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.organizer.toLowerCase().includes(query) ||
        event.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  const getEventIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "cultural festival": return Music;
      case "workshop": return Camera;
      case "culinary experience": return Utensils;
      case "adventure": return Mountain;
      case "art workshop": return Camera;
      case "music festival": return Music;
      default: return Calendar;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "cultural festival": return "bg-cultural-orange/10 text-cultural-orange border-cultural-orange/20";
      case "workshop": return "bg-primary/10 text-primary border-primary/20";
      case "culinary experience": return "bg-eco-green/10 text-eco-green border-eco-green/20";
      case "adventure": return "bg-adventure-blue/10 text-adventure-blue border-adventure-blue/20";
      case "art workshop": return "bg-accent/10 text-accent border-accent/20";
      case "music festival": return "bg-cultural-orange/10 text-cultural-orange border-cultural-orange/20";
      default: return "bg-secondary text-secondary-foreground border-border";
    }
  };

  const getTabFilteredEvents = (eventsList: any[]) => {
    return eventsList.filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      
      if (activeTab === "upcoming") {
        return eventDate >= today;
      } else if (activeTab === "past") {
        return eventDate < today;
      } else {
        return event.featured;
      }
    });
  };

  const filteredEvents = getFilteredEvents(getTabFilteredEvents(events));

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/20 to-cultural-orange/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Cultural Events & Experiences
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover festivals, workshops, and unique experiences that celebrate Jharkhand's rich heritage
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">50+</div>
              <div className="text-sm text-muted-foreground">Events Monthly</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">15K+</div>
              <div className="text-sm text-muted-foreground">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">25+</div>
              <div className="text-sm text-muted-foreground">Locations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">4.8★</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Events Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {showCalendar ? "Hide Calendar" : "View Calendar"}
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredEvents.map((event) => {
                const EventIcon = getEventIcon(event.category);
                return (
                  <Dialog key={event.id}>
                    <DialogTrigger asChild>
                      <Card className="travel-card group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                        <div className="relative">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Event Type Badge */}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                              {event.eventType || event.category}
                            </Badge>
                          </div>
                          
                          <div className="absolute top-3 right-3 flex gap-2">
                            <Badge className="bg-yellow-500 text-white">
                              <Star className="h-3 w-3 mr-1" />
                              {event.rating}
                            </Badge>
                            <Button variant="ghost" size="icon" className="bg-background/80 hover:bg-background">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {/* Title */}
                            <h3 className="text-2xl font-bold text-foreground line-clamp-2">
                              {event.title}
                            </h3>

                            {/* Location */}
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{event.location}</span>
                            </div>

                            {/* Description Snippet */}
                            <p className="text-muted-foreground line-clamp-2">
                              {event.description}
                            </p>

                            {/* Cultural Significance */}
                            <div className="bg-muted/30 rounded-lg p-4">
                              <div className="flex items-start space-x-2">
                                <Clock className="h-4 w-4 text-cultural-orange mt-1 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-foreground mb-1">Cultural Significance</p>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {event.culturalSignificance || "A celebration of Jharkhand's rich cultural heritage and traditional practices."}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Best Time to Visit / Duration */}
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{event.duration || "Full Day"}</span>
                            </div>

                            {/* Annual Visitors / Attendees */}
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{event.attendees}+ attending</span>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                              {event.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-3">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="flex-1">
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
                                  </DialogHeader>
                                  
                                  <div className="space-y-6">
                                    {/* Hero Image */}
                                    <div className="relative">
                                      <img 
                                        src={event.image} 
                                        alt={event.title}
                                        className="w-full h-64 object-cover rounded-lg"
                                      />
                                      <div className="absolute top-4 left-4">
                                        <Badge className={getCategoryColor(event.category)}>
                                          <EventIcon className="h-3 w-3 mr-1" />
                                          {event.category}
                                        </Badge>
                                      </div>
                                      <div className="absolute top-4 right-4">
                                        <Badge className="bg-warning-amber text-white">
                                          <Star className="h-3 w-3 mr-1" />
                                          {event.rating}
                                        </Badge>
                                      </div>
                                    </div>

                                    {/* Event Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <h3 className="text-lg font-semibold mb-3">Event Information</h3>
                                        <div className="space-y-2">
                                          <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>{new Date(event.date).toLocaleDateString('en-IN', { 
                                              day: 'numeric', 
                                              month: 'long', 
                                              year: 'numeric' 
                                            })}</span>
                                          </div>
                                          <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>{event.time}</span>
                                          </div>
                                          <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>{event.location}</span>
                                          </div>
                                          <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>{event.attendees} going</span>
                                          </div>
                                          <div className="flex items-center">
                                            <span className="font-medium">Price: {event.price}</span>
                                          </div>
                                          <div className="flex items-center">
                                            <span className="font-medium">Duration: {event.duration}</span>
                                          </div>
                                          <div className="flex items-center">
                                            <span className="font-medium">Age Group: {event.ageGroup}</span>
                                          </div>
                                          <div className="flex items-center">
                                            <span className="font-medium">Language: {event.language}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <h3 className="text-lg font-semibold mb-3">Activities</h3>
                                        <div className="grid grid-cols-1 gap-2">
                                          {event.activities.map((activity, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                              {activity}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Cultural Significance */}
                                    <div className="bg-muted/50 rounded-lg p-6">
                                      <div className="flex items-start space-x-3">
                                        <Sparkles className="h-6 w-6 text-cultural-orange mt-1 flex-shrink-0" />
                                        <div>
                                          <h3 className="text-lg font-semibold mb-3">Cultural Significance</h3>
                                          <p className="text-muted-foreground leading-relaxed">{event.culturalSignificance}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-3">Description</h3>
                                      <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                                    </div>

                                    {/* Tags */}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-3">Tags</h3>
                                      <div className="flex flex-wrap gap-2">
                                        {event.tags.map((tag, index) => (
                                          <Badge key={index} variant="secondary">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Booking Button */}
                                    <div className="flex justify-center pt-4">
                                      <Button 
                                        variant="cultural" 
                                        size="lg"
                                        onClick={() => {
                                          setSelectedEvent(event);
                                          setShowBookingModal(true);
                                        }}
                                      >
                                        <Ticket className="h-5 w-5 mr-2" />
                                        {event.price === "Free" ? "Register Now" : "Book Now - " + event.price}
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <Button 
                                variant="cultural" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setShowBookingModal(true);
                                }}
                              >
                                <Ticket className="h-4 w-4 mr-1" />
                                {event.price === "Free" ? "Register" : "Book Now"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Hero Image */}
                        <div className="relative">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className={getCategoryColor(event.category)}>
                              <EventIcon className="h-3 w-3 mr-1" />
                              {event.category}
                            </Badge>
                          </div>
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-warning-amber text-white">
                              <Star className="h-3 w-3 mr-1" />
                              {event.rating}
                            </Badge>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Event Information</h3>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{new Date(event.date).toLocaleDateString('en-IN', { 
                                  day: 'numeric', 
                                  month: 'long', 
                                  year: 'numeric' 
                                })}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{event.attendees} going</span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium">Price: {event.price}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium">Duration: {event.duration}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium">Age Group: {event.ageGroup}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium">Language: {event.language}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-3">Activities</h3>
                            <div className="grid grid-cols-1 gap-2">
                              {event.activities.map((activity, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {activity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Cultural Significance */}
                        <div className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg p-6 border border-border/50">
                          <div className="flex items-start space-x-3">
                            <Sparkles className="h-6 w-6 text-cultural-orange mt-1 flex-shrink-0" />
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Cultural Significance</h3>
                              <p className="text-muted-foreground leading-relaxed">{event.culturalSignificance}</p>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Description</h3>
                          <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                        </div>

                        {/* Tags */}
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {event.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Booking Button */}
                        <div className="flex justify-center pt-4">
                          <Button 
                            variant="cultural" 
                            size="lg"
                            className="bg-gradient-to-r from-primary to-cultural-orange hover:from-primary/90 hover:to-cultural-orange/90 transition-all"
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowBookingModal(true);
                            }}
                          >
                            <Ticket className="h-5 w-5 mr-2" />
                            {event.price === "Free" ? "Register Now" : "Book Now - " + event.price}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Events
          </Button>
        </div>

        {/* Event Calendar Section */}
        {showCalendar && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Event Calendar</h2>
            <Card className="travel-card">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Calendar View */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">March 2024</h3>
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 31 }, (_, i) => {
                        const day = i + 1;
                        const dayDate = `2024-03-${day.toString().padStart(2, '0')}`;
                        const hasEvent = events.some(event => event.date === dayDate);
                        const isSelected = selectedDate === dayDate;
                        return (
                          <div 
                            key={day} 
                            className={`text-center p-2 rounded-lg cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-primary text-primary-foreground font-semibold' 
                                : hasEvent 
                                  ? 'bg-primary/10 text-primary font-semibold hover:bg-primary/20' 
                                  : 'hover:bg-accent'
                            }`}
                            onClick={() => setSelectedDate(dayDate)}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Event Details for Selected Date */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Events on {new Date(selectedDate).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</h3>
                    <div className="space-y-4">
                      {events.filter(event => event.date === selectedDate).map(event => (
                        <Card key={event.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground">{event.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                <div className="flex items-center mt-2 space-x-4 text-xs text-muted-foreground">
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {event.time}
                                  </span>
                                  <span className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {event.location}
                                  </span>
                                  <span className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {event.attendees} going
                                  </span>
                                </div>
                              </div>
                              <Badge className="bg-primary/10 text-primary">
                                {event.price}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}


        {/* Booking Modal */}
        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {selectedEvent ? `Book ${selectedEvent.title}` : 'Book Event'}
              </DialogTitle>
            </DialogHeader>
            
            {selectedEvent && (
              <div className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Event Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <p className="font-medium">{new Date(selectedEvent.date).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time:</span>
                      <p className="font-medium">{selectedEvent.time}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <p className="font-medium">{selectedEvent.location}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price:</span>
                      <p className="font-medium">{selectedEvent.price}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="Enter your email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input placeholder="Enter your phone number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Tickets</label>
                    <Input type="number" placeholder="1" min="1" max="10" />
                  </div>
                  {selectedEvent.price !== "Free" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Payment Method</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Credit/Debit Card</option>
                        <option>UPI</option>
                        <option>Net Banking</option>
                        <option>Wallet</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowBookingModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="cultural" 
                    className="flex-1"
                    onClick={() => {
                      alert(`🎉 Booking Successful!\n\nEvent: ${selectedEvent.title}\nDate: ${new Date(selectedEvent.date).toLocaleDateString('en-IN')}\nTime: ${selectedEvent.time}\n\nYou will receive a confirmation email shortly.`);
                      setShowBookingModal(false);
                    }}
                  >
                    {selectedEvent.price === "Free" ? "Register" : "Pay & Book"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Events;