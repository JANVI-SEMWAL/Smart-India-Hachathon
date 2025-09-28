# Interactive AR Maps - Jharkhand Tourism

## 🗺️ **Real Map Integration**
Now uses an actual Jharkhand map image (`jharkhand_map.webp`) from the assets folder instead of SVG graphics.

## ✨ **Interactive Features**

### 🔍 **Zoom & Pan**
- **Mouse Wheel**: Zoom in/out on the map
- **Drag**: Click and drag to pan around the map
- **Zoom Controls**: Use +/- buttons for precise zoom control
- **Reset Button**: Return to default view instantly
- **Zoom Range**: 50% to 300% for detailed exploration

### 🎯 **Smart Location Pins**
- **Strategic Positioning**: 12 tourist destinations placed based on actual Jharkhand geography
- **Hover Effects**: Pins glow and scale up when hovered
- **Selection Animation**: Selected pins bounce and pulse with ripple effects
- **Dynamic Labels**: Location names appear on hover/selection with styled tooltips

### 🎨 **Visual Enhancements**
- **Animated Pins**: Smooth transitions and hover animations
- **Glow Effects**: Selected locations have glowing shadows
- **Professional Styling**: Gradient overlays and shadows for depth
- **Responsive Design**: Works seamlessly on all screen sizes

### 📍 **Location Features**
- **Real Coordinates**: Actual GPS coordinates for each destination
- **Geographic Accuracy**: Pins positioned based on real Jharkhand geography
- **Smart Grouping**: Related locations (like Ranchi area) grouped naturally

## 🎮 **User Interactions**

### Map Controls:
- **Drag**: Grab and move the map around
- **Zoom In/Out**: Mouse wheel or control buttons
- **Reset View**: Return to original position and zoom
- **Hover**: See location details on pin hover

### Location Cards:
- **Enhanced Hover**: Cards lift up with shadow effects
- **Click Animation**: Smooth pulse animation when selected
- **Ring Highlight**: Selected cards get colored border

## 🎯 **Strategic Pin Locations**

The pins are positioned based on actual Jharkhand geography:

- **Western Region**: Netarhat, Betla National Park
- **Central Region**: Ranchi area (Hundru Falls, Jonha Falls, Dassam Falls, Birsa Zoo)
- **Northern Region**: Hazaribagh National Park
- **Eastern Region**: Deoghar Temple, Parasnath Hill
- **Southern Region**: Jamshedpur
- **Industrial Areas**: Dhanbad Coal Mines

## 🎨 **Visual Elements**

### Map Legend:
- **Blue Pins**: Regular tourist destinations
- **Red Pins**: Currently selected location
- **Orange Pins**: Hovered location
- **Live Zoom**: Shows current zoom percentage
- **Usage Tips**: Helpful interaction hints

### Coordinate Display:
- **Selected Location**: Shows current destination name
- **GPS Coordinates**: Real latitude/longitude values
- **Live Updates**: Changes when different locations are selected

## 🚀 **Performance Features**

- **Optimized Images**: Uses WebP format for faster loading
- **Smooth Animations**: 60fps transitions with CSS3
- **Efficient Rendering**: Minimal DOM updates for better performance
- **Memory Friendly**: Clean event handler management
- **Mobile Optimized**: Touch-friendly interactions

## 🎯 **Technical Implementation**

### State Management:
- Zoom level (0.5x to 3x)
- Pan position (X, Y coordinates)
- Drag state tracking
- Hover state management
- Animation triggers

### Event Handlers:
- Mouse down/up/move for dragging
- Wheel events for zooming
- Hover enter/leave for pin effects
- Click handlers for selection

### CSS Animations:
- Bounce animations for selected pins
- Pulse effects for hover states
- Smooth transitions for all interactions
- Glow effects for visual feedback

The map now provides a truly immersive and realistic experience for exploring Jharkhand's beautiful tourist destinations! 🏞️
