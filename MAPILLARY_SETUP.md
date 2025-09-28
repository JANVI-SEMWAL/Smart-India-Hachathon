# Mapillary Integration for AR Maps

## Setup Instructions

### 1. Get Mapillary Access Token

Your **Mapillary Access Token** serves as the API key. Here's how to get it:

1. Go to [https://www.mapillary.com/developer](https://www.mapillary.com/developer)
2. Sign up or log in to your Mapillary account
3. Create a new application
4. Copy the **Access Token** - this is your API key

### 2. Configure Environment Variables

Create a `.env` file in your project root and add:

```bash
VITE_MAPILLARY_ACCESS_TOKEN="your_access_token_here"
VITE_GOOGLE_MAPS_API_KEY="your_google_maps_key_here"
```

**Note:** The **Access Token** is the main credential you'll use. The Client Secret and Authorization URL are for OAuth flows, which we don't need for basic image fetching.

## How It Works

### Mapillary API Integration
- **Street View Images:** Fetches real street-level photos from Mapillary contributors
- **Location-Based:** Searches for images within 1km radius of selected tourist destinations
- **High Resolution:** Uses 2048px images with fallback to 1024px
- **Multiple Views:** Shows thumbnails and allows navigation between different viewpoints

### Features Added
1. **Image Gallery:** Browse multiple street view images for each location
2. **Navigation Controls:** Arrow buttons and thumbnail selection
3. **Error Handling:** Graceful fallbacks when images aren't available
4. **Loading States:** Visual indicators while fetching images
5. **Image Counter:** Shows current position in the gallery

## Usage

1. **Select a Destination:** Choose from Jharkhand tourist locations or search for places
2. **Load Street View:** Click "Load Mapillary Images" to fetch street-level photos
3. **Browse Images:** Use arrow buttons or click thumbnails to view different perspectives
4. **High Quality:** Images load in high resolution for detailed viewing

## API Details

### Mapillary Images API Endpoint:
```
https://graph.mapillary.com/images?access_token={token}&fields=id,thumb_256_url,thumb_1024_url,thumb_2048_url,geometry,compass_angle&bbox={bbox}&limit=20
```

### What We Fetch:
- `id`: Unique image identifier
- `thumb_256_url`: Small thumbnail (256px)
- `thumb_1024_url`: Medium resolution (1024px) 
- `thumb_2048_url`: High resolution (2048px)
- `geometry`: GPS coordinates of the image
- `compass_angle`: Direction the camera was facing

## Advantages Over Google Street View

1. **Free to Use:** No per-request charges
2. **Community Driven:** Fresh, recent imagery from contributors
3. **Better Coverage:** Often covers areas where Google Street View isn't available
4. **High Resolution:** Access to multiple resolution options
5. **API Friendly:** Simple REST API with comprehensive documentation

## Error Handling

- Shows appropriate messages when no images are found
- Falls back to lower resolution if high-res images fail to load
- Provides clear instructions if API token is missing
- Handles network errors gracefully

## Next Steps

1. Add your Mapillary access token to `.env`
2. Test with different Jharkhand tourist locations
3. The integration preserves existing Google Maps functionality while adding Mapillary street view
