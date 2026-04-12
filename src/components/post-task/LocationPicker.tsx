"use client";

import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Loader2,
  MapPin,
  Navigation,
  Search,
} from "lucide-react";
import { useCallback, useState } from "react";

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

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const res = await fetch(
    `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lon}&format=json`,
    {
      headers: { Accept: "application/json" },
    },
  );
  if (!res.ok) throw new Error("Reverse geocode failed");
  const data = await res.json();
  return data.display_name ?? "";
}

async function forwardGeocode(
  query: string,
): Promise<{ lat: number; lon: number } | null> {
  const res = await fetch(
    `${NOMINATIM_BASE}/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
    {
      headers: { Accept: "application/json" },
    },
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.length) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
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
          setGeoError("Could not retrieve your address. Please enter it manually.");
          setGeoStatus("error");
        }
      },
      (err) => {
        setGeoStatus("error");
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError("Location access denied. Please enter your address manually.");
        } else {
          setGeoError("Could not get your location. Please try again.");
        }
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  }, [onLocationChange]);

  const handleAddressBlur = useCallback(async () => {
    const trimmed = addressInput.trim();
    if (!trimmed) return;
    // Update location immediately
    onLocationChange({ location: trimmed });
    // Then try to geocode in background
    setGeocodeLoading(true);
    try {
      const coords = await forwardGeocode(trimmed);
      if (coords) {
        onLocationChange({
          location: trimmed,
          latitude: coords.lat,
          longitude: coords.lon,
        });
      }
    } catch {
      // Geocoding is best-effort; silent failure
    } finally {
      setGeocodeLoading(false);
    }
  }, [addressInput, onLocationChange]);

  const handleAddressChange = (val: string) => {
    setAddressInput(val);
    if (!val) {
      onLocationChange({ location: "" });
    }
  };

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
            placeholder="e.g. 123 Main Street, Dhaka, Bangladesh"
            aria-invalid={isInvalid}
            className={cn(
              "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex h-9 w-full rounded-md border bg-transparent px-3 py-2 pr-9 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm",
            )}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {geocodeLoading ? (
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
            ) : (
              <Search className="text-muted-foreground size-4" />
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
