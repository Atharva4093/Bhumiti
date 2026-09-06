"use client";

import { MapContainer, TileLayer, Polygon, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { PUNE_COORDS, LAND_DATABASE } from "../lib/mockData";
import { useEffect } from "react";
import L from "leaflet";

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.9.4/dist/images/";

interface MapProps {
  selectedZone: string | null;
  year?: number;
  layerMode?: "satellite" | "thermal" | "moisture";
}

function MapController({ selectedZone }: { selectedZone: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (selectedZone && LAND_DATABASE[selectedZone]) {
      const bounds = L.latLngBounds(LAND_DATABASE[selectedZone].outerBoundary as [number, number][]);
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    } else {
      map.flyTo(PUNE_COORDS, 11, { duration: 1.5 });
    }
  }, [selectedZone, map]);
  return null;
}

export default function MapVisualizer({ selectedZone, layerMode = "satellite" }: MapProps) {
  const activeData = selectedZone ? LAND_DATABASE[selectedZone] : null;

  // Dynamic color coding based on selected sensor raster mode
  const getColors = () => {
    if (layerMode === "thermal") {
      return { agri: "#F59E0B", forest: "#D97706", built: "#DC2626", water: "#3B82F6" }; // Thermal Heatmap colors
    }
    if (layerMode === "moisture") {
      return { agri: "#059669", forest: "#047857", built: "#9CA3AF", water: "#2563EB" }; // Moisture NDWI index colors
    }
    return { agri: "#10B981", forest: "#059669", built: "#EF4444", water: "#3B82F6" }; // Standard RGB
  };

  const palette = getColors();

  return (
    <MapContainer center={PUNE_COORDS} zoom={11} className="w-full h-full z-0 bg-[#060911]" zoomControl={false}>
      <TileLayer 
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
      />
      <MapController selectedZone={selectedZone} />

      {activeData && (
        <>
          {activeData.agriClusters.map((cluster, index) => (
            <Polygon 
              key={`agri-${index}`}
              positions={cluster as [number, number][]} 
              pathOptions={{ color: palette.agri, weight: 1, fillOpacity: 0.4, fillColor: palette.agri }} 
            />
          ))}

          {activeData.plantations.map((forest, index) => (
            <Polygon 
              key={`forest-${index}`}
              positions={forest as [number, number][]} 
              pathOptions={{ color: palette.forest, weight: 1, fillOpacity: 0.5, fillColor: palette.forest }} 
            />
          ))}
          
          {activeData.builtUpClusters.map((cluster, index) => (
            <Polygon 
              key={`built-${index}`}
              positions={cluster as [number, number][]} 
              pathOptions={{ color: palette.built, weight: 1, fillOpacity: 0.5, fillColor: palette.built }} 
            />
          ))}

          {activeData.waterBodies.map((water, index) => (
            <Polygon 
              key={`water-${index}`}
              positions={water as [number, number][]} 
              pathOptions={{ color: palette.water, weight: 1, fillOpacity: 0.55, fillColor: palette.water }} 
            />
          ))}
          
          <Polyline 
            positions={[...activeData.outerBoundary, activeData.outerBoundary[0]] as [number, number][]} 
            pathOptions={{ color: "#FBBF24", weight: 3, dashArray: "6, 8" }} 
          />
        </>
      )}
    </MapContainer>
  );
}