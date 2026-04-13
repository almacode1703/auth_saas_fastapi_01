"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Home, MapPin, Ruler, Bath, Bed, Sparkles, TrendingUp,
  Search, ChevronDown, Loader2, RefreshCw, IndianRupee,
} from "lucide-react";

import { mlService } from "@/services/ml.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function HousePricePage() {
  const [location, setLocation] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [totalSqft, setTotalSqft] = useState(1200);
  const [bath, setBath] = useState(2);
  const [bhk, setBhk] = useState(2);

  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ["ml", "house-price", "locations"],
    queryFn: mlService.housePrice.getLocations,
    staleTime: Infinity,
  });

  const allLocations = locationsData?.locations ?? [];

  const filteredLocations = useMemo(() => {
    if (!locationSearch.trim()) return allLocations.slice(0, 50);
    const q = locationSearch.toLowerCase();
    return allLocations.filter((loc) => loc.toLowerCase().includes(q)).slice(0, 50);
  }, [allLocations, locationSearch]);

  const { mutate: predict, data: result, isPending, reset } = useMutation({
    mutationFn: mlService.housePrice.predict,
    onError: (error: any) => {
      toast.error(error.detail || "Prediction failed");
    },
  });

  useEffect(() => {
    if (result) {
      document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [result]);

  const handlePredict = () => {
    if (!location) {
      toast.error("Please select a location");
      return;
    }
    predict({ location, total_sqft: totalSqft, bath, bhk });
  };

  const handleReset = () => {
    reset();
    setLocation("");
    setLocationSearch("");
    setTotalSqft(1200);
    setBath(2);
    setBhk(2);
  };

  const formatINR = (lakhs: number) => {
    if (lakhs >= 100) return `${(lakhs / 100).toFixed(2)} Cr`;
    return `${lakhs.toFixed(2)} L`;
  };

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-6 md:px-8 md:py-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-muted px-4 py-1.5 rounded-full text-xs text-muted-foreground mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Supervised ML · Linear Regression
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
              House Price
            </span>{" "}
            Predictor
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Trained on 10,000+ real property listings across 241 locations
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs">
              <TrendingUp className="w-3 h-3 text-green-500" /> Test R² 79%
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs">
              <MapPin className="w-3 h-3 text-blue-500" /> 241 Locations
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs">
              <Home className="w-3 h-3 text-purple-500" /> 10,148 Listings
            </div>
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-6"
        >
          {/* Location */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Location
            </Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setLocationOpen(!locationOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-input bg-background text-sm hover:border-primary/50 transition-colors"
              >
                <span className={location ? "" : "text-muted-foreground"}>
                  {location || (isLoadingLocations ? "Loading locations..." : "Select a location")}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${locationOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {locationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-20 mt-2 w-full rounded-lg border border-border bg-popover shadow-lg overflow-hidden"
                  >
                    <div className="p-2 border-b border-border">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          autoFocus
                          placeholder="Search locations..."
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                          className="pl-10 h-9"
                        />
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {filteredLocations.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-muted-foreground text-center">No locations found</p>
                      ) : (
                        filteredLocations.map((loc) => (
                          <button
                            key={loc}
                            onClick={() => {
                              setLocation(loc);
                              setLocationOpen(false);
                              setLocationSearch("");
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                              location === loc ? "bg-muted font-medium" : ""
                            }`}
                          >
                            {loc}
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Total sqft */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-muted-foreground" />
                Total Square Feet
              </Label>
              <span className="text-sm font-semibold text-primary">{totalSqft.toLocaleString()} sqft</span>
            </div>
            <input
              type="range"
              min="300"
              max="10000"
              step="50"
              value={totalSqft}
              onChange={(e) => setTotalSqft(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>300</span>
              <span>10,000</span>
            </div>
          </div>

          {/* BHK and Bath */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-muted-foreground" />
                  BHK
                </Label>
                <span className="text-sm font-semibold text-primary">{bhk}</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setBhk(n)}
                    className={`flex-1 h-10 rounded-lg border text-sm font-medium transition-all ${
                      bhk === n
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-muted-foreground/40"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-muted-foreground" />
                  Bathrooms
                </Label>
                <span className="text-sm font-semibold text-primary">{bath}</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setBath(n)}
                    className={`flex-1 h-10 rounded-lg border text-sm font-medium transition-all ${
                      bath === n
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-muted-foreground/40"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Predict button */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              onClick={handlePredict}
              disabled={isPending || !location}
              className="w-full h-12 text-base bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-400 hover:via-pink-400 hover:to-purple-400 shadow-lg shadow-pink-500/25 gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Predict Price
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              id="result-section"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="rounded-2xl border border-border bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10 p-6 md:p-10 shadow-lg text-center space-y-4"
            >
              <div className="inline-flex items-center gap-2 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-xs">
                <Sparkles className="w-3 h-3 text-pink-500" />
                Predicted Price
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex items-center justify-center gap-2"
              >
                <IndianRupee className="w-8 h-8 md:w-12 md:h-12 text-pink-500" />
                <span className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
                  {formatINR(result.predicted_price_lakhs)}
                </span>
              </motion.div>

              <p className="text-sm text-muted-foreground">
                ≈ ₹{result.predicted_price_rupees.toLocaleString("en-IN")}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto pt-6 mt-6 border-t border-border">
                <div>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                    <MapPin className="w-3 h-3" /> Location
                  </div>
                  <div className="text-sm font-medium truncate">{result.input.location}</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                    <Ruler className="w-3 h-3" /> Area
                  </div>
                  <div className="text-sm font-medium">{result.input.total_sqft.toLocaleString()} sqft</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                    <Bed className="w-3 h-3" /> BHK
                  </div>
                  <div className="text-sm font-medium">{result.input.bhk}</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                    <Bath className="w-3 h-3" /> Baths
                  </div>
                  <div className="text-sm font-medium">{result.input.bath}</div>
                </div>
              </div>

              <Button variant="outline" onClick={handleReset} className="gap-2 mt-6">
                <RefreshCw className="w-4 h-4" />
                Try another prediction
              </Button>

              <p className="text-xs text-muted-foreground pt-2 max-w-md mx-auto">
                Predictions are estimates based on historical listings. Actual market prices may vary.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}