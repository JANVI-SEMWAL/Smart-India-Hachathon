import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Compass, Menu, User, AlertTriangle, LogOut, UserCircle2, NotebookPen, Settings, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Itinerary Planner", href: "/itinerary" },
  { name: "Events", href: "/events" },
  { name: "Recommendations", href: "/recommendations" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [authUser, setAuthUser] = useState<{ 
    fullName?: string; 
    email?: string; 
    phone?: string; 
    role?: string; 
    joinDate?: string;
    location?: string;
    profileImage?: string;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      setAuthUser(raw ? JSON.parse(raw) : null);
    } catch {}
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("auth_user");
    setAuthUser(null);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <Compass className="h-8 w-8 text-primary group-hover:text-primary-dark transition-colors" />
              <span className="ml-2 text-xl font-bold text-foreground">KalpanaX</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActivePath(item.href)
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  {item.name === "Itinerary Planner" ? (
                    <span className="inline-flex items-baseline gap-1">
                      <span>Itinerary Planner</span>
                      <sup className="text-[10px] leading-none text-primary">AI</sup>
                    </span>
                  ) : (
                    item.name
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions: Search | SOS | Login/User */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="w-64">
              <Input placeholder="Search" className="w-full" />
            </div>
            <Link to="/safety">
              <Button variant="safety" size="sm" className="sos-pulse">
                <AlertTriangle className="h-4 w-4" />
                SOS
              </Button>
            </Link>
            {authUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-gradient-to-r from-primary/10 to-cultural-orange/10 border-primary/20 hover:from-primary/20 hover:to-cultural-orange/20">
                    <User className="h-4 w-4" />
                    {authUser.fullName || "Account"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-0 bg-background border-border shadow-2xl">
                  {/* User Profile Header */}
                  <div className="bg-gradient-to-r from-primary to-cultural-orange p-4 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        {authUser.profileImage ? (
                          <img src={authUser.profileImage} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <UserCircle2 className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{authUser.fullName || "User"}</h3>
                        <p className="text-white/80 text-sm">{authUser.email || "user@example.com"}</p>
                      </div>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Quick Actions */}
                  <div className="p-2">
                    <Link to="/journal">
                      <DropdownMenuItem className="cursor-pointer hover:bg-accent rounded-lg p-3 text-foreground">
                        <NotebookPen className="h-4 w-4 mr-3 text-primary" />
                        Travel Journal
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/profile">
                      <DropdownMenuItem className="cursor-pointer hover:bg-accent rounded-lg p-3 text-foreground">
                        <UserCircle2 className="h-4 w-4 mr-3 text-primary" />
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="cursor-pointer hover:bg-accent rounded-lg p-3 text-foreground">
                      <Settings className="h-4 w-4 mr-3 text-primary" />
                      Settings
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator />

                  <div className="p-2">
                    <DropdownMenuItem className="cursor-pointer hover:bg-red-50 rounded-lg p-3 text-red-600 hover:text-red-700" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline">
                  <User className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile SOS */}
            <Link to="/safety">
              <Button variant="safety" size="sm" className="sos-pulse">
                <AlertTriangle className="h-4 w-4" />
              </Button>
            </Link>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <div className="flex flex-col space-y-4 pt-6">
                  <div className="flex items-center space-x-2 pb-4 border-b border-border">
                    <Compass className="h-6 w-6 text-primary" />
                    <span className="text-lg font-bold">KalpanaX</span>
                  </div>
                  <div className="px-1">
                    <Input placeholder="Search" />
                  </div>
                  
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActivePath(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {item.name === "Itinerary Planner" ? (
                        <span className="inline-flex items-baseline gap-1">
                          <span>Itinerary Planner</span>
                          <sup className="text-[10px] leading-none">AI</sup>
                        </span>
                      ) : (
                        item.name
                      )}
                    </Link>
                  ))}
                  
                  <div className="pt-4 border-t border-border space-y-2">
                    <Link to="/safety" onClick={() => setIsOpen(false)}>
                      <Button variant="safety" className="w-full justify-start">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        SOS
                      </Button>
                    </Link>
                    {authUser ? (
                      <>
                        <Link to="/journal" onClick={() => setIsOpen(false)}>
                          <Button className="w-full justify-start" variant="outline">
                            <NotebookPen className="h-4 w-4 mr-2" />
                            Travel Journal
                          </Button>
                        </Link>
                        <Button className="w-full justify-start" variant="ghost" onClick={() => { handleLogout(); setIsOpen(false); }}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start">
                          <User className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}