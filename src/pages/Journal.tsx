import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader as AlertHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import { 
  BookOpen,
  Plus,
  Calendar,
  MapPin,
  Camera,
  Heart,
  Star,
  Edit,
  Share2,
  Download,
  Search,
  Filter,
  Video,
  Mic,
  Lock,
  Globe,
  Tag,
  LogIn,
  Trash2,
  FileText
} from "lucide-react";

const moods = ["Happy", "Excited", "Peaceful", "Adventurous", "Grateful", "Inspired", "Creative", "Contemplative"];
const weatherOptions = ["Sunny", "Cloudy", "Rainy", "Misty", "Clear", "Pleasant"];

type JournalEntry = {
  id: number;
  title: string;
  date: string;
  location: string;
  excerpt: string;
  content: string;
  images: string[];
  videos: string[];
  audios: string[];
  mood: string;
  weather: string;
  tags: string[];
  privacy: "Private" | "Public" | "Friends";
  rating: number; // 0-5, 0 means not rated
  visited: boolean;
};

export default function Journal() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [saving, setSaving] = useState(false);

  // Filters/search
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterMood, setFilterMood] = useState("");
  const [filterWeather, setFilterWeather] = useState("");
  const [filterHasMedia, setFilterHasMedia] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [audios, setAudios] = useState<string[]>([]);
  const [mood, setMood] = useState("");
  const [weather, setWeather] = useState("");
  const [visited, setVisited] = useState(false);
  const [rating, setRating] = useState(0);

  // Audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);

  const authUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const storageKey = authUser?.email ? `journal_${authUser.email}` : null;

  useEffect(() => {
    if (!storageKey) return;
    const raw = localStorage.getItem(storageKey);
    setEntries(raw ? (JSON.parse(raw) as JournalEntry[]) : []);
  }, [storageKey]);

  const stats = {
    totalEntries: entries.length,
    placesVisited: new Set(entries.map((e) => e.location).filter(Boolean)).size,
    photosAdded: entries.reduce((n, e) => n + (e.images?.length || 0), 0),
    memoriesShared: entries.filter((e) => e.privacy !== "Private").length,
  };

  const saveEntries = (list: JournalEntry[]) => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(list));
  };

  const handleFilesToDataUrls = (files: FileList): Promise<string[]> => {
    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve) => {
          const fr = new FileReader();
          fr.onload = () => resolve(String(fr.result));
          fr.readAsDataURL(file);
        })
    );
    return Promise.all(readers);
  };

  const onAddPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const urls = await handleFilesToDataUrls(e.target.files);
    setImages((prev) => [...prev, ...urls]);
    e.target.value = "";
  };

  const onAddVideos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const urls = await handleFilesToDataUrls(e.target.files);
    setVideos((prev) => [...prev, ...urls]);
    e.target.value = "";
  };

  // Audio recording helpers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = String(reader.result);
          setAudios((prev) => [...prev, dataUrl]);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);
    } catch (e) {
      alert("Microphone permission denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setLocation("");
    setDate("");
    setContent("");
    setTags("");
    setImages([]);
    setVideos([]);
    setAudios([]);
    setMood("");
    setWeather("");
    setVisited(false);
    setRating(0);
    setRecording(false);
  };

  const handleSaveEntry = async () => {
    if (!title || !date) {
      alert("Please add a title and date.");
      return;
    }
    if (visited && (rating < 1 || rating > 5)) {
      alert("Please select a rating between 1 and 5.");
      return;
    }
    setSaving(true);
    const entry: JournalEntry = {
      id: Date.now(),
      title,
      date,
      location,
      excerpt: content.slice(0, 140) + (content.length > 140 ? "..." : ""),
      content,
      images,
      videos,
      audios,
      mood: mood || "",
      weather: weather || "",
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      privacy: "Private",
      rating: visited ? rating : 0,
      visited,
    };
    const next = [entry, ...entries];
    setEntries(next);
    saveEntries(next);
    setSaving(false);
    setIsCreateOpen(false);
    resetForm();
  };

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return entries.filter((e) => {
      const matchesText = !q || [e.title, e.location, e.content, e.tags.join(" ")].some((t) => t?.toLowerCase().includes(q));
      const matchesMood = !filterMood || e.mood === filterMood;
      const matchesWeather = !filterWeather || e.weather === filterWeather;
      const matchesMedia = !filterHasMedia || (e.images.length + e.videos.length + (e.audios?.length || 0) > 0);
      return matchesText && matchesMood && matchesWeather && matchesMedia;
    });
  }, [entries, searchQuery, filterMood, filterWeather, filterHasMedia]);

  const clearFilters = () => {
    setSearchQuery("");
    setFilterMood("");
    setFilterWeather("");
    setFilterHasMedia(false);
  };

  const downloadEntryJson = (entry: JournalEntry) => {
    const blob = new Blob([JSON.stringify(entry, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `journal_entry_${entry.id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadEntryPdf = (entry: JournalEntry) => {
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    const styles = `
      <style>
        body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 24px; color: #111827; }
        h1 { font-size: 22px; margin: 0 0 8px; }
        .meta { color: #6B7280; font-size: 12px; margin-bottom: 12px; }
        .tag { display: inline-block; padding: 2px 8px; border-radius: 9999px; background:#F3F4F6; margin-right: 6px; font-size: 11px; }
        .section { margin-top: 16px; }
        .images { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        img { width: 100%; height: auto; border-radius: 6px; }
        .rating { font-weight: 600; }
        .muted { color: #6B7280; }
      </style>
    `;
    const ratingText = entry.visited && entry.rating > 0 ? `${entry.rating}/5` : "Not rated";
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Journal Entry ${entry.id}</title>
          ${styles}
        </head>
        <body>
          <h1>${entry.title}</h1>
          <div class="meta">
            ${new Date(entry.date).toLocaleDateString()} • ${entry.location || ""}
          </div>
          <div class="meta">
            <span class="rating">Rating:</span> ${ratingText} • Mood: ${entry.mood || "-"} • Weather: ${entry.weather || "-"}
          </div>
          <div class="section">
            <div>${entry.content.replace(/\n/g, "<br/>")}</div>
          </div>
          ${entry.tags.length ? `<div class="section">${entry.tags.map(t => `<span class="tag">${t}</span>`).join(" ")}</div>` : ""}
          ${entry.images.length ? `<div class="section images">${entry.images.map(src => `<img src="${src}" />`).join("")}</div>` : ""}
          <script>window.onload = () => { window.print(); };<\/script>
        </body>
      </html>
    `;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  const deleteEntry = (id: number) => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    saveEntries(next);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-eco-green/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              My Travel Journal
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Capture and preserve your precious travel memories, experiences, and discoveries
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{stats.totalEntries}</div>
              <div className="text-sm text-muted-foreground">Journal Entries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{stats.placesVisited}</div>
              <div className="text-sm text-muted-foreground">Places Visited</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{stats.photosAdded}</div>
              <div className="text-sm text-muted-foreground">Photos Added</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{stats.memoriesShared}</div>
              <div className="text-sm text-muted-foreground">Memories Shared</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!authUser ? (
          <div className="max-w-xl mx-auto text-center p-8 border rounded-lg">
            <LogIn className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Please log in to start your travel journal.</p>
          </div>
        ) : (
        <>
        {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search your memories..." className="pl-10 w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
              <Button variant="outline" size="sm" onClick={() => setShowFilters((s) => !s)}>
              <Filter className="h-4 w-4 mr-2" />
                {showFilters ? "Hide Filters" : "Filter"}
            </Button>
          </div>
          
            <Dialog open={isCreateOpen} onOpenChange={(o) => { setIsCreateOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button variant="cultural" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Create New Journal Entry
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="Give your memory a title..." value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="Where were you?" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mood">Mood</Label>
                      <select className="w-full px-3 py-2 border border-input rounded-md" value={mood} onChange={(e) => setMood(e.target.value)}>
                      <option value="">Select mood...</option>
                      {moods.map(mood => (
                        <option key={mood} value={mood}>{mood}</option>
                      ))}
                    </select>
                  </div>
                </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weather">Weather</Label>
                      <select className="w-full px-3 py-2 border border-input rounded-md" value={weather} onChange={(e) => setWeather(e.target.value)}>
                        <option value="">Select weather...</option>
                        {weatherOptions.map(w => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input id="tags" placeholder="Add tags separated by commas..." value={tags} onChange={(e) => setTags(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={visited} onChange={(e) => { setVisited(e.target.checked); if (!e.target.checked) setRating(0); }} />
                      I visited this place
                    </label>
                    {visited && (
                      <div className="flex items-center gap-2">
                        <Label>Rating</Label>
                        <select className="px-2 py-1 border rounded" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                          <option value={0}>Select…</option>
                          {[1,2,3,4,5].map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Your Story</Label>
                  <Textarea 
                    id="content" 
                    placeholder="Tell the story of this moment..."
                    className="min-h-[120px]"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                
                  <div className="flex items-center space-x-2">
                    <Button asChild variant="outline" className="flex-1">
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" multiple className="hidden" onChange={onAddPhotos} />
                        <span className="inline-flex items-center">
                    <Camera className="h-4 w-4 mr-2" />
                    Add Photos
                        </span>
                      </label>
                  </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <label className="cursor-pointer">
                        <input type="file" accept="video/*" multiple className="hidden" onChange={onAddVideos} />
                        <span className="inline-flex items-center">
                    <Video className="h-4 w-4 mr-2" />
                    Add Video
                        </span>
                      </label>
                    </Button>
                    {!recording ? (
                      <Button variant="outline" className="flex-1" onClick={startRecording}>
                        <Mic className="h-4 w-4 mr-2" />
                        Record Audio
                  </Button>
                    ) : (
                      <Button variant="destructive" className="flex-1" onClick={stopRecording}>
                    <Mic className="h-4 w-4 mr-2" />
                        Stop Recording
                  </Button>
                    )}
                </div>

                  {(images.length > 0 || videos.length > 0 || audios.length > 0) && (
                    <div className="grid grid-cols-3 gap-3">
                      {images.map((src, i) => (
                        <div key={`img-${i}`} className="relative">
                          <img src={src} alt={`upload-${i}`} className="w-full h-24 object-cover rounded" />
                          <a href={src} download className="absolute bottom-1 right-1 bg-background/80 text-xs p-1 rounded">Download</a>
                        </div>
                      ))}
                      {videos.map((src, i) => (
                        <div key={`vid-${i}`} className="relative">
                          <video src={src} className="w-full h-24 object-cover rounded" controls />
                          <a href={src} download className="absolute bottom-1 right-1 bg-background/80 text-xs p-1 rounded">Download</a>
                        </div>
                      ))}
                      {audios.map((src, i) => (
                        <div key={`aud-${i}`} className="relative bg-muted p-2 rounded">
                          <audio src={src} controls className="w-full" />
                          <a href={src} download className="absolute bottom-1 right-1 bg-background/80 text-xs p-1 rounded">Download</a>
                        </div>
                      ))}
                    </div>
                  )}
                
                <div className="flex justify-between items-center pt-4">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Privacy: Private</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                      <Button variant="cultural" onClick={handleSaveEntry} disabled={saving}>
                        {saving ? "Saving..." : "Save Entry"}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

          {/* Filters UI */}
          {showFilters && (
            <div className="border rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm">Mood</Label>
                <select className="w-full px-3 py-2 border border-input rounded-md" value={filterMood} onChange={(e) => setFilterMood(e.target.value)}>
                  <option value="">Any</option>
                  {moods.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm">Weather</Label>
                <select className="w-full px-3 py-2 border border-input rounded-md" value={filterWeather} onChange={(e) => setFilterWeather(e.target.value)}>
                  <option value="">Any</option>
                  {weatherOptions.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={filterHasMedia} onChange={(e) => setFilterHasMedia(e.target.checked)} />
                  Has media (photos/videos/audio)
                </label>
              </div>
              <div className="flex items-end gap-2">
                <Button variant="outline" onClick={clearFilters}>Clear</Button>
                <Button onClick={() => setShowFilters(false)}>Apply</Button>
              </div>
            </div>
          )}

        {/* Journal Entries */}
          {filteredEntries.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">No memories found. Try adjusting your filters or create a new entry.</div>
          ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEntries.map((entry) => (
            <Card key={entry.id} className="travel-card group overflow-hidden">
              {/* Entry Header */}
              <div className="relative">
                {entry.images.length > 0 && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={entry.images[0]} 
                      alt={entry.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {entry.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        +{entry.images.length - 1} more
                      </div>
                    )}
                  </div>
                )}
                
                <div className="absolute top-3 left-3 flex space-x-2">
                  <Badge className="bg-background/90 text-foreground">
                      {entry.mood || ""}
                  </Badge>
                  <Badge variant="outline" className="bg-background/90">
                      {entry.weather || ""}
                  </Badge>
                </div>
                
                <div className="absolute top-3 right-3 flex space-x-1">
                  <div className="flex">
                      {entry.rating > 0 ? (
                        [...Array(entry.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))
                      ) : (
                        <span className="text-xs bg-background/80 px-2 py-0.5 rounded">Not rated</span>
                      )}
                  </div>
                  <div className="bg-background/90 rounded-full p-1">
                    {entry.privacy === "Private" ? (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <Globe className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Date and Location */}
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(entry.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {entry.location}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-foreground line-clamp-1">
                    {entry.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-muted-foreground line-clamp-3">
                    {entry.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.slice(0, 4).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {entry.tags.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{entry.tags.length - 4} more
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-2">
                      <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      Read More
                    </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertHeader>
                              <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteEntry(entry.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
          )}

        {/* Entry Detail Modal */}
        {selectedEntry && (
          <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedEntry.title}</DialogTitle>
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(selectedEntry.date).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedEntry.location}
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Images */}
                {selectedEntry.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedEntry.images.map((image: string, index: number) => (
                        <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`${selectedEntry.title} - ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                          <a href={image} download className="absolute bottom-2 right-2 bg-background/80 text-xs px-2 py-1 rounded">Download</a>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedEntry.videos?.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedEntry.videos.map((src: string, index: number) => (
                        <div key={index} className="relative">
                          <video src={src} className="w-full h-64 object-cover rounded-lg" controls />
                          <a href={src} download className="absolute bottom-2 right-2 bg-background/80 text-xs px-2 py-1 rounded">Download</a>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedEntry.audios?.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedEntry.audios.map((src: string, index: number) => (
                        <div key={index} className="relative bg-muted p-2 rounded">
                          <audio src={src} className="w-full" controls />
                          <a href={src} download className="absolute bottom-2 right-2 bg-background/80 text-xs px-2 py-1 rounded">Download</a>
                        </div>
                    ))}
                  </div>
                )}
                
                {/* Mood and Weather */}
                <div className="flex items-center space-x-4">
                  <Badge className="bg-primary/10 text-primary">
                      {selectedEntry.visited && selectedEntry.rating > 0 ? `Rating: ${selectedEntry.rating}/5` : "Not rated"}
                    </Badge>
                    <Badge className="bg-primary/10 text-primary">
                      Mood: {selectedEntry.mood || "-"}
                  </Badge>
                  <Badge variant="outline">
                      Weather: {selectedEntry.weather || "-"}
                  </Badge>
                </div>
                
                {/* Content */}
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedEntry.content}
                  </p>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedEntry.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                      {selectedEntry && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                    </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertHeader>
                              <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => { deleteEntry(selectedEntry.id); setSelectedEntry(null); }}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                  </div>
                  <Button variant="outline" onClick={() => setSelectedEntry(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        </>
        )}
      </div>
    </Layout>
  );
}