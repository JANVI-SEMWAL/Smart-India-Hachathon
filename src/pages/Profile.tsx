import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/layout/Layout";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  X,
  Camera,
  Award,
  Heart,
  Star,
  BookOpen,
  Settings
} from "lucide-react";

const Profile = () => {
  const [authUser, setAuthUser] = useState<{
    fullName?: string; 
    email?: string; 
    phone?: string; 
    role?: string; 
    joinDate?: string;
    location?: string;
    address?: string;
    gender?: string;
    dateOfBirth?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
    profileImage?: string;
    bio?: string;
    interests?: string[];
  } | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    address: "",
    gender: "",
    dateOfBirth: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    bio: "",
    interests: [] as string[]
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      const user = raw ? JSON.parse(raw) : null;
      setAuthUser(user);
      if (user) {
        setEditForm({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          location: user.location || "",
          address: user.address || "",
          gender: user.gender || "",
          dateOfBirth: user.dateOfBirth || "",
          emergencyContactName: user.emergencyContactName || "",
          emergencyContactPhone: user.emergencyContactPhone || "",
          emergencyContactRelation: user.emergencyContactRelation || "",
          bio: user.bio || "",
          interests: user.interests || []
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  const handleSave = () => {
    const updatedUser = {
      ...authUser,
      ...editForm
    };
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    setAuthUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (authUser) {
      setEditForm({
        fullName: authUser.fullName || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        location: authUser.location || "",
        address: authUser.address || "",
        gender: authUser.gender || "",
        dateOfBirth: authUser.dateOfBirth || "",
        emergencyContactName: authUser.emergencyContactName || "",
        emergencyContactPhone: authUser.emergencyContactPhone || "",
        emergencyContactRelation: authUser.emergencyContactRelation || "",
        bio: authUser.bio || "",
        interests: authUser.interests || []
      });
    }
    setIsEditing(false);
  };

  const addInterest = (interest: string) => {
    if (interest.trim() && !editForm.interests.includes(interest.trim())) {
      setEditForm(prev => ({
        ...prev,
        interests: [...prev.interests, interest.trim()]
      }));
    }
  };

  const removeInterest = (interest: string) => {
    setEditForm(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  if (!authUser) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 flex items-center justify-center">
          <Card className="w-full max-w-md bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold text-white mb-2">Not Logged In</h2>
              <p className="text-gray-400 mb-6">Please log in to view your profile.</p>
              <Button className="w-full">
                <User className="h-4 w-4 mr-2" />
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - User Summary Card */}
            <div className="lg:col-span-1">
              <Card className="travel-card h-fit">
                <CardContent className="p-6 text-center">
                  {/* Avatar */}
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {authUser.profileImage ? (
                      <img src={authUser.profileImage} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-green-600" />
                    )}
                  </div>
                  
                  {/* Name */}
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {isEditing ? (
                      <Input
                        value={editForm.fullName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                        className="text-center"
                      />
                    ) : (
                      authUser.fullName || "Esha Rawat"
                    )}
                  </h2>
                  
                  {/* Date of Birth */}
                  <p className="text-sm text-muted-foreground mb-2">
                    Born: {authUser.dateOfBirth ? new Date(authUser.dateOfBirth).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    }) : "Not specified"}
                  </p>
                  
                  {/* Role Badge */}
                  <Badge className="bg-green-100 text-green-700 border-green-200 mb-4">
                    <User className="h-3 w-3 mr-1" />
                    {authUser.role || "Tourist"}
                  </Badge>
                  
                  {/* Member Since */}
                  <p className="text-sm text-muted-foreground mb-4">
                    Member since {authUser.joinDate || "9/27/2025"}
                  </p>
                  
                  {/* Account Status */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Account Status</p>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      Active
                    </Badge>
                  </div>
                  
                  {/* Edit Button */}
                  <div className="mt-6">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button onClick={handleCancel} size="sm" variant="outline">
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Information Cards */}
            <div className="lg:col-span-3 space-y-6">
              {/* Personal Information Card */}
              <Card className="travel-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="text-foreground font-medium">
                        {isEditing ? (
                          <Input
                            value={editForm.fullName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                            className="mt-1"
                          />
                        ) : (
                          authUser.fullName || "Esha Rawat"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="text-foreground font-medium">
                        {isEditing ? (
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={editForm.gender}
                            onChange={(e) => setEditForm(prev => ({ ...prev, gender: e.target.value }))}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                          </select>
                        ) : (
                          authUser.gender || "Not specified"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="text-foreground font-medium">
                        {isEditing ? (
                          <Input
                            type="date"
                            value={editForm.dateOfBirth}
                            onChange={(e) => setEditForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                            className="mt-1"
                          />
                        ) : (
                          authUser.dateOfBirth ? new Date(authUser.dateOfBirth).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          }) : "Not specified"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <Badge className="bg-green-100 text-green-700 border-green-200 mt-1">
                        <User className="h-3 w-3 mr-1" />
                        {authUser.role || "Tourist"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information Card */}
              <Card className="travel-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email Address</p>
                        <p className="text-foreground font-medium">
                          {isEditing ? (
                            <Input
                              value={editForm.email}
                              onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                              className="mt-1"
                            />
                          ) : (
                            authUser.email || "esharawat3@gmail.com"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                        <p className="text-foreground font-medium">
                          {isEditing ? (
                            <Input
                              value={editForm.phone}
                              onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                              className="mt-1"
                            />
                          ) : (
                            authUser.phone || "7618158325"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="text-foreground font-medium">
                          {isEditing ? (
                            <Textarea
                              value={editForm.address}
                              onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                              className="mt-1"
                              rows={2}
                            />
                          ) : (
                            authUser.address || "Not specified"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact Card */}
              <Card className="travel-card border-red-200 bg-red-50/30">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="text-foreground font-medium">
                        {isEditing ? (
                          <Input
                            value={editForm.emergencyContactName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                            className="mt-1"
                          />
                        ) : (
                          authUser.emergencyContactName || "Not specified"
                        )}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="text-foreground font-medium">
                          {isEditing ? (
                            <Input
                              value={editForm.emergencyContactPhone}
                              onChange={(e) => setEditForm(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                              className="mt-1"
                            />
                          ) : (
                            authUser.emergencyContactPhone || "Not specified"
                          )}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Relation</p>
                      <p className="text-foreground font-medium">
                        {isEditing ? (
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={editForm.emergencyContactRelation}
                            onChange={(e) => setEditForm(prev => ({ ...prev, emergencyContactRelation: e.target.value }))}
                          >
                            <option value="">Select Relationship</option>
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Sibling">Sibling</option>
                            <option value="Friend">Friend</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          authUser.emergencyContactRelation || "Not specified"
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

