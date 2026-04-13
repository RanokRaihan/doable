"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, Loader2, MapPin, Navigation, Search } from "lucide-react";
import { useCallback, useRef, useState } from "react";

type LocationData = {
  location: string;
  latitude?: number;
  longitude?: number;
};

type LocationPickerProps = {
  value: string;
  onLocationChange: (data: LocationData) => void;
  isInvalid?: boolean;
};

type Mode = "current" | "manual";

type NominatimAddressDetail = {
  house_number?: string;
  road?: string;
  suburb?: string;
  neighbourhood?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  state?: string;
  postcode?: string;
  country?: string;
};

type NominatimResult = {
  lat: string;
  lon: string;
  address: NominatimAddressDetail;
};

type Suggestion = {
  label: string;
  lat: string;
  lon: string;
};

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

function formatAddress(addr: NominatimAddressDetail): string {
  // console.log({ address: addr });
  const parts: string[] = [];
  const street = [addr.house_number, addr.road].filter(Boolean).join(" ");
  if (street) parts.push(street);
  const city =
    addr.town ??
    addr.city ??
    addr.village ??
    addr.municipality ??
    addr.suburb ??
    addr.neighbourhood;
  if (city) parts.push(city);
  if (addr.state) parts.push(addr.state);
  if (addr.postcode) parts.push(addr.postcode);
  return parts.join(", ");
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const res = await fetch(
    `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
    { headers: { Accept: "application/json" } },
  );
  if (!res.ok) throw new Error("Reverse geocode failed");
  const data = await res.json();
  return formatAddress(data.address) || data.display_name || "";
}

async function searchAddresses(query: string): Promise<Suggestion[]> {
  const res = await fetch(
    `${NOMINATIM_BASE}/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
    { headers: { Accept: "application/json" } },
  );
  if (!res.ok) return [];
  const results: NominatimResult[] = await res.json();
  return results.map((r) => ({
    label: formatAddress(r.address),
    lat: r.lat,
    lon: r.lon,
  }));
}

const LocationPicker = ({
  value,
  onLocationChange,
  isInvalid,
}: LocationPickerProps) => {
  const [mode, setMode] = useState<Mode>("manual");
  const [addressInput, setAddressInput] = useState(value);
  const [geoStatus, setGeoStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUseCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setGeoStatus("loading");
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const address = await reverseGeocode(latitude, longitude);
          setAddressInput(address);
          onLocationChange({ location: address, latitude, longitude });
          setGeoStatus("success");
        } catch {
          setGeoError(
            "Could not retrieve your address. Please enter it manually.",
          );
          setGeoStatus("error");
        }
      },
      (err) => {
        setGeoStatus("error");
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError(
            "Location access denied. Please enter your address manually.",
          );
        } else {
          setGeoError("Could not get your location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }, [onLocationChange]);

  const handleAddressChange = (val: string) => {
    setAddressInput(val);

    if (!val) {
      onLocationChange({ location: "" });
      setSuggestions([]);
      setShowSuggestions(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    // Debounce Nominatim search
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (val.trim().length < 3) return;
      setSuggestionsLoading(true);
      try {
        const results = await searchAddresses(val.trim());
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        // silent — autocomplete is best-effort
      } finally {
        setSuggestionsLoading(false);
      }
    }, 400);
  };

  const handleSelectSuggestion = (s: Suggestion) => {
    const lat = parseFloat(s.lat);
    const lon = parseFloat(s.lon);
    setAddressInput(s.label);
    setSuggestions([]);
    setShowSuggestions(false);
    onLocationChange({ location: s.label, latitude: lat, longitude: lon });
  };

  // Fallback geocode on blur when user typed manually without picking a suggestion
  const handleAddressBlur = useCallback(async () => {
    setShowSuggestions(false);
    const trimmed = addressInput.trim();
    if (!trimmed) return;
    // Notify parent with text immediately
    onLocationChange({ location: trimmed });
    // Try to resolve coords in background
    setGeocodeLoading(true);
    try {
      const results = await searchAddresses(trimmed);
      if (results.length > 0) {
        onLocationChange({
          location: trimmed,
          latitude: parseFloat(results[0].lat),
          longitude: parseFloat(results[0].lon),
        });
      }
    } catch {
      // silent
    } finally {
      setGeocodeLoading(false);
    }
  }, [addressInput, onLocationChange]);

  return (
    <div className="space-y-3">
      {/* Mode tabs */}
      <div className="flex rounded-lg border p-1">
        <button
          type="button"
          onClick={() => setMode("current")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            mode === "current"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Navigation className="size-3.5" />
          Use My Location
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            mode === "manual"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <MapPin className="size-3.5" />
          Enter Address
        </button>
      </div>

      {/* Current location mode */}
      {mode === "current" && (
        <div className="space-y-2">
          <button
            type="button"
            disabled={geoStatus === "loading"}
            onClick={handleUseCurrentLocation}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {geoStatus === "loading" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Detecting location…
              </>
            ) : (
              <>
                <Navigation className="size-4" />
                {geoStatus === "success"
                  ? "Update My Location"
                  : "Detect My Location"}
              </>
            )}
          </button>

          {geoError && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {geoError}
            </div>
          )}

          {geoStatus === "success" && addressInput && (
            <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span className="line-clamp-2">{addressInput}</span>
            </div>
          )}
        </div>
      )}

      {/* Manual address mode */}
      {mode === "manual" && (
        <div className="relative">
          <input
            type="text"
            value={addressInput}
            onChange={(e) => handleAddressChange(e.target.value)}
            onBlur={handleAddressBlur}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowSuggestions(false);
            }}
            placeholder="e.g. 123 Main Street, Dhaka, Bangladesh"
            aria-invalid={isInvalid}
            aria-autocomplete="list"
            className={cn(
              "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex h-9 w-full rounded-md border bg-transparent px-3 py-2 pr-9 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm",
            )}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {geocodeLoading || suggestionsLoading ? (
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
            ) : (
              <Search className="text-muted-foreground size-4" />
            )}
          </span>

          {/* Suggestions dropdown */}
          {showSuggestions && (
            <ul className="bg-popover text-popover-foreground absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border shadow-md">
              {suggestions.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    // Prevent input blur from closing the dropdown before click fires
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectSuggestion(s)}
                    className="hover:bg-accent hover:text-accent-foreground flex w-full items-start gap-2 px-3 py-2 text-left text-sm"
                  >
                    <MapPin className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
                    <span className="line-clamp-2">{s.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
