"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const NearbyHospitalsButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLoading(false);
        // Force a hard navigation to ensure consistent state and data fetching
        window.location.href = `/hospitals?lat=${latitude}&lng=${longitude}`;
      },
      (error) => {
        console.error("Error getting location", error);
        alert("Unable to retrieve your location. Please check your browser settings.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50 md:w-auto"
    >
      {loading ? "Locating..." : "Find Nearby Hospitals"}
    </button>
  );
};
