const api = "url";
const options = {
  method: "GET",
  headers: {
    Authorization: "Auth_token"
  },
}
const response = fetch(api, options) 
console.log(response.json())



// src/lib/api/foursquare/fetchNearbyPlaces.ts

import { FoursquarePlace, UserLocation, UserPreferences } from '@/types';

const FOURSQUARE_API_BASE_URL = 'https://api.foursquare.com/v3/places/';

export async function fetchNearbyPlaces(
  // The 'location' object is passed, but its lat/lng are within preferences.location
  // So, we only need the 'preferences' object as per your updated UserPreferences.
  preferences: UserPreferences
): Promise<FoursquarePlace[] | null> {
  const apiKey = process.env.FOURSQUARE_API_KEY;
  if (!apiKey) {
    console.error("FOURSQUARE_API_KEY is not set.");
    return null;
  }

  // Extract latitude and longitude directly from preferences.location
  const latitude = preferences.location.coords.latitude;
  const longitude = preferences.location.coords.longitude;

  // Destructure all relevant fields from preferences, with defaults
  const {
    category, // This will be the Foursquare ID (e.g., "13065")
    radius = 10000, // Default to 10000 if not provided in preferences
    min_price,
    max_price, // Not directly used in Foursquare API, but kept for clarity
  } = preferences;

  const params = new URLSearchParams({
    ll: `${latitude},${longitude}`,
    radius: radius.toString(), // Ensure radius is passed as string
    limit: '10', // Default limit as per your code
  });

  if (category) params.append('categories', category);

  // Foursquare API's search endpoint takes a single 'price' parameter (1-4).
  // We will use min_price if it's provided and valid.
  if (min_price) {
    params.append('price', min_price);
  }
  if (max_price) {
    params.append('max_price', max_price);
  }
  // If you also need to use max_price, you'd have to filter results client-side
  // or use a more advanced Foursquare endpoint if one supports price ranges directly.

  const url = `${FOURSQUARE_API_BASE_URL}search?${params.toString()}`;
  console.log(`Fetching Foursquare places with URL: ${url}`);

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json', Authorization: apiKey },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error(`Foursquare API error: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Failed to fetch places: ${errorBody.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.results as FoursquarePlace[];
  } catch (error) {
    console.error("Error in fetchNearbyPlaces:", error);
    return null;
  }
}