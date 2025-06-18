const api = "url";
const options = {
  method: "GET",
  headers: {
    Authorization: "Auth_token",
  },
};
const response = fetch(api, options);
console.log(response.json());

// src/lib/api/foursquare/fetchNearbyPlaces.ts

import { FoursquarePlace, UserLocation, UserPreferences } from "@/types";

const FOURSQUARE_API_BASE_URL = "https://api.foursquare.com/v3/places/";
