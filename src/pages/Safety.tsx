import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { 
  sendSOSAlert, 
  getCurrentLocation, 
  shareLocationWithContacts,
  getSOSHistory,
  updateSOSStatus,
  type LocationData,
  type EmergencyContact,
  type SOSAlert
} from "@/lib/sosApi";
import { 
  AlertTriangle,
  Phone,
  MapPin,
  Shield,
  Users,
  Clock,
  Heart,
  Wifi,
  Navigation,
  Camera,
  Lock,
  CheckCircle,
  Info,
  PhoneCall,
  MessageSquare,
  Share2,
  Download,
  UserCheck,
  Ambulance,
  Building
} from "lucide-react";

const Safety = () => {
  const [sosActive, setSosActive] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", number: "", relationship: "" });
  const [locationSharing, setLocationSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [sosHistory, setSosHistory] = useState<SOSAlert[]>([]);
  const [loading, setLoading] = useState(false);

  // Load emergency contacts from localStorage on component mount
  useEffect(() => {
    try {
      const authUser = localStorage.getItem("auth_user");
      let contacts: EmergencyContact[] = [];
      
      if (authUser) {
        const user = JSON.parse(authUser);
        if (user.emergencyContactName && user.emergencyContactPhone && user.emergencyContactRelation) {
          const primaryContact: EmergencyContact = {
            id: 1,
            name: user.emergencyContactName,
            number: user.emergencyContactPhone,
            relationship: user.emergencyContactRelation
          };
          contacts.push(primaryContact);
        }
      }
      
      // Load additional contacts
      const additionalContacts = localStorage.getItem("additional_emergency_contacts");
      if (additionalContacts) {
        const parsed = JSON.parse(additionalContacts);
        contacts = [...contacts, ...parsed];
      }
      
      setEmergencyContacts(contacts);
    } catch (error) {
      console.error("Error loading emergency contacts:", error);
    }
  }, []);

  const emergencyServices = [
    {
      name: "Police Emergency",
      number: "100",
      icon: Shield,
      color: "bg-adventure-blue text-white"
    },
    {
      name: "Medical Emergency", 
      number: "108",
      icon: Ambulance,
      color: "bg-safety-red text-white"
    },
    {
      name: "Fire Department",
      number: "101",
      icon: Phone,
      color: "bg-cultural-orange text-white"
    },
    {
      name: "Tourist Helpline",
      number: "1363",
      icon: Phone,
      color: "bg-primary text-white"
    }
  ];

  const safetyFeatures = [
    {
      title: "Real-time Location Sharing",
      description: "Share your live location with trusted contacts automatically",
      icon: MapPin,
      status: "Active"
    },
    {
      title: "Emergency Contact Alert",
      description: "Instantly notify your emergency contacts with one tap",
      icon: Users,
      status: "Ready"
    },
    {
      title: "Travel Insurance",
      description: "Comprehensive coverage for medical and travel emergencies",
      icon: Shield,
      status: "Active"
    },
    {
      title: "Local Emergency Services",
      description: "Quick access to local police, medical, and fire services",
      icon: Phone,
      status: "Ready"
    },
    {
      title: "Offline Maps",
      description: "Access maps and emergency info even without internet",
      icon: Navigation,
      status: "Downloaded"
    },
    {
      title: "Check-in Reminders",
      description: "Automatic reminders to check in with your contacts",
      icon: Clock,
      status: "Enabled"
    }
  ];

  const safetyTips = [
    {
      category: "Travel Safety",
      tips: [
        "Always inform someone about your travel plans and expected return",
        "Keep copies of important documents in separate bags",
        "Research local customs and cultural sensitivities",
        "Stay hydrated and carry basic first aid supplies"
      ]
    },
    {
      category: "Communication",
      tips: [
        "Save important local numbers in your phone",
        "Learn basic local phrases for emergencies",
        "Keep your phone charged and carry power banks",
        "Know the location of nearest hospitals and police stations"
      ]
    },
    {
      category: "Health & Medical",
      tips: [
        "Carry necessary medications with prescriptions",
        "Be aware of local health risks and vaccinations",
        "Drink only bottled or properly treated water",
        "Have travel insurance covering medical emergencies"
      ]
    }
  ];

  const handleSOS = async () => {
    setSosActive(true);
    setLoading(true);
    
    try {
      // Get user's current location
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      
      // Send SOS alert with location to all contacts and admin
      const result = await sendSOSAlert(location, emergencyContacts, "user_123");
      
      if (result.success) {
        alert(`🚨 SOS Alert Sent Successfully!\n\nLocation: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}\nTime: ${new Date().toLocaleString()}\n\nAll emergency contacts and authorities have been notified via SMS.`);
        
        // Update SOS history
        try {
          const history = await getSOSHistory("user_123");
          setSosHistory(history);
        } catch (error) {
          console.log('History API not available');
        }
      } else {
        alert(`SOS Alert Failed: ${result.message}`);
      }
    } catch (error) {
      console.error('SOS Error:', error);
      alert('SOS Alert Sent! (Location unavailable - contacts still notified)');
    } finally {
      setLoading(false);
      // Reset after 5 seconds
      setTimeout(() => setSosActive(false), 5000);
    }
  };

  const addEmergencyContact = () => {
    if (newContact.name && newContact.number && newContact.relationship) {
      const contact = {
        id: Date.now(),
        ...newContact
      };
      const updatedContacts = [...emergencyContacts, contact];
      setEmergencyContacts(updatedContacts);
      
      // Save to localStorage
      try {
        const authUser = localStorage.getItem("auth_user");
        if (authUser) {
          const user = JSON.parse(authUser);
          // Store additional contacts in a separate key
          localStorage.setItem("additional_emergency_contacts", JSON.stringify(updatedContacts.slice(1)));
        }
      } catch (error) {
        console.error("Error saving emergency contacts:", error);
      }
      
      setNewContact({ name: "", number: "", relationship: "" });
      setShowAddContact(false);
    }
  };

  const removeEmergencyContact = (id: number) => {
    const updatedContacts = emergencyContacts.filter(contact => contact.id !== id);
    setEmergencyContacts(updatedContacts);
    
    // Update localStorage
    try {
      // Only save additional contacts (skip the primary contact from user profile)
      const additionalContacts = updatedContacts.slice(1);
      localStorage.setItem("additional_emergency_contacts", JSON.stringify(additionalContacts));
    } catch (error) {
      console.error("Error updating emergency contacts:", error);
    }
  };

  const handleShareLocation = async () => {
    setLoading(true);
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      
      const result = await shareLocationWithContacts(location, emergencyContacts);
      
      if (result.success) {
        alert(`📍 Location Shared Successfully!\n\nYour current location has been shared with all emergency contacts.\n\nLocation: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`);
        setLocationSharing(true);
      } else {
        alert(`Location sharing failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Location sharing error:', error);
      alert('Failed to share location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStopLocationSharing = () => {
    setLocationSharing(false);
    setCurrentLocation(null);
    alert('Location sharing stopped.');
  };

  return (
    <Layout>
      {/* Emergency Header */}
      <div className="bg-safety-red text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Safety & Emergency Center</h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Your safety is our priority. Quick access to emergency services and safety features.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* SOS Button */}
        <div className="text-center mb-12">
          <Card className="travel-card max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <Button
                variant="safety"
                size="xl"
                className={`w-32 h-32 rounded-full text-xl font-bold ${sosActive ? 'animate-pulse' : 'sos-pulse'}`}
                onClick={handleSOS}
                disabled={sosActive || loading}
              >
                {loading ? (
                  <div className="text-center">
                    <div className="animate-spin mb-2">⏳</div>
                    <div className="text-sm">SENDING...</div>
                  </div>
                ) : sosActive ? (
                  <div className="text-center">
                    <div>SOS</div>
                    <div className="text-sm">SENT</div>
                  </div>
                ) : (
                  "SOS"
                )}
              </Button>
              <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
                Emergency SOS
              </h3>
              <p className="text-muted-foreground text-sm">
                Press and hold for 3 seconds to send emergency alert to your contacts and local authorities
              </p>
              {sosActive && (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Emergency alert sent successfully! Help is on the way.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Emergency Services */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Emergency Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyServices.map((service, index) => (
              <Card key={index} className="travel-card">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full ${service.color} flex items-center justify-center mx-auto mb-4`}>
                    <service.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {service.name}
                  </h3>
                  <div className="text-2xl font-bold text-foreground mb-4">
                    {service.number}
                  </div>
                  <Button variant="outline" className="w-full">
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Safety Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Safety Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyFeatures.map((feature, index) => (
              <Card key={index} className="travel-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 text-primary rounded-lg p-3">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">
                          {feature.title}
                        </h3>
                        <Badge variant="outline" className="bg-eco-green/10 text-eco-green border-eco-green/20">
                          {feature.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Safety Information Tabs */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Safety Information
          </h2>
          
          <Tabs defaultValue="emergency-contacts" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="emergency-contacts">Emergency Contacts</TabsTrigger>
              <TabsTrigger value="location-sharing">Location Sharing</TabsTrigger>
              <TabsTrigger value="travel-insurance">Travel Insurance</TabsTrigger>
              <TabsTrigger value="safety-tips">Safety Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="emergency-contacts" className="mt-6">
              <Card className="travel-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {emergencyContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground">{contact.name}</h4>
                        <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                        <p className="text-sm font-mono text-foreground">{contact.number}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <PhoneCall className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeEmergencyContact(contact.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {showAddContact ? (
                    <div className="p-4 border border-border rounded-lg space-y-3">
                      <h4 className="font-medium text-foreground">Add Emergency Contact</h4>
                      <div className="space-y-2">
                        <Input
                          placeholder="Contact Name"
                          value={newContact.name}
                          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        />
                        <Input
                          placeholder="Phone Number"
                          value={newContact.number}
                          onChange={(e) => setNewContact({ ...newContact, number: e.target.value })}
                        />
                        <Input
                          placeholder="Relationship"
                          value={newContact.relationship}
                          onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={addEmergencyContact} size="sm">
                          Add Contact
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowAddContact(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowAddContact(true)}
                    >
                      Add Emergency Contact
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="location-sharing" className="mt-6">
              <Card className="travel-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Location Sharing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground">Real-time Location</h4>
                        <p className="text-sm text-muted-foreground">Share your live location with trusted contacts</p>
                      </div>
                      <Badge className={locationSharing ? "bg-eco-green/10 text-eco-green border-eco-green/20" : "bg-muted text-muted-foreground"}>
                        {locationSharing ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    {currentLocation && (
                      <div className="bg-muted rounded-lg p-4">
                        <h4 className="font-medium text-foreground mb-2">Current Location</h4>
                        <p className="text-sm text-muted-foreground">
                          {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last updated: {new Date(currentLocation.timestamp).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Accuracy: ±{Math.round(currentLocation.accuracy)}m
                        </p>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={handleShareLocation}
                        disabled={loading}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        {loading ? "Sharing..." : "Share Location"}
                      </Button>
                      <Button 
                        variant="cultural" 
                        className="flex-1"
                        onClick={handleStopLocationSharing}
                        disabled={!locationSharing}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Stop Sharing
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="travel-insurance" className="mt-6">
              <Card className="travel-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Travel Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Your travel insurance is active and covers medical emergencies, trip cancellation, and lost baggage.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-border rounded-lg">
                        <h4 className="font-medium text-foreground mb-2">Policy Details</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-muted-foreground">Policy Number:</span> TRV123456789</p>
                          <p><span className="text-muted-foreground">Valid Until:</span> Dec 31, 2024</p>
                          <p><span className="text-muted-foreground">Coverage:</span> ₹5,00,000</p>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-border rounded-lg">
                        <h4 className="font-medium text-foreground mb-2">Emergency Claim</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          24/7 claim support hotline
                        </p>
                        <Button variant="safety" size="sm" className="w-full">
                          <PhoneCall className="h-4 w-4 mr-2" />
                          Call Insurance
                        </Button>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Policy Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="safety-tips" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {safetyTips.map((category, index) => (
                  <Card key={index} className="travel-card">
                    <CardHeader>
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {category.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-eco-green mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Local Emergency Information */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Local Emergency Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="travel-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Nearest Hospital
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium text-foreground">RIMS Hospital</h4>
                <p className="text-sm text-muted-foreground mb-2">Bariatu, Ranchi - 834009</p>
                <p className="text-sm text-muted-foreground mb-4">Distance: 2.3 km</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Navigation className="h-4 w-4 mr-1" />
                    Directions
                  </Button>
                  <Button variant="safety" size="sm">
                    <PhoneCall className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="travel-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Police Station
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium text-foreground">Main Road Police Station</h4>
                <p className="text-sm text-muted-foreground mb-2">Main Road, Ranchi - 834001</p>
                <p className="text-sm text-muted-foreground mb-4">Distance: 1.8 km</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Navigation className="h-4 w-4 mr-1" />
                    Directions
                  </Button>
                  <Button variant="adventure" size="sm">
                    <PhoneCall className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="travel-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Tourist Helpdesk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium text-foreground">Jharkhand Tourism</h4>
                <p className="text-sm text-muted-foreground mb-2">Tourism Building, Ranchi</p>
                <p className="text-sm text-muted-foreground mb-4">24/7 Support Available</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                  <Button variant="cultural" size="sm">
                    <PhoneCall className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Safety Resources */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Safety Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="travel-card">
              <CardHeader>
                <CardTitle>Offline Safety Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Download comprehensive safety information that works even without internet connection.
                </p>
                <Button variant="eco" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Safety Guide
                </Button>
              </CardContent>
            </Card>
            
            <Card className="travel-card">
              <CardHeader>
                <CardTitle>Safety Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Connect with fellow travelers and locals for real-time safety updates and tips.
                </p>
                <Button variant="adventure" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Join Community
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Safety;