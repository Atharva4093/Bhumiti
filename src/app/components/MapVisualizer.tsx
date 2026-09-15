"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { PUNE_COORDS, LAND_DATABASE } from "../lib/mockData";
import L from "leaflet";

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.9.4/dist/images/";

interface MapProps {
  selectedZone: string | null;
  year?: number;
  layerMode?: "satellite" | "thermal" | "moisture";
}

export default function MapVisualizer({ selectedZone, layerMode = "satellite" }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: PUNE_COORDS,
        zoom: 11,
        zoomControl: false,
      });

      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      layerGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    const activeData = selectedZone ? LAND_DATABASE[selectedZone] : null;

    if (activeData) {
      const getColors = () => {
        if (layerMode === "thermal") return { agri: "#F59E0B", forest: "#D97706", built: "#DC2626", water: "#3B82F6" };
        if (layerMode === "moisture") return { agri: "#059669", forest: "#047857", built: "#9CA3AF", water: "#2563EB" };
        return { agri: "#10B981", forest: "#059669", built: "#EF4444", water: "#3B82F6" };
      };
      const palette = getColors();

      activeData.agriClusters.forEach((cluster) => {
        L.polygon(cluster as [number, number][], { color: palette.agri, weight: 1, fillOpacity: 0.4, fillColor: palette.agri }).addTo(layerGroup);
      });

      activeData.plantations.forEach((forest) => {
        L.polygon(forest as [number, number][], { color: palette.forest, weight: 1, fillOpacity: 0.5, fillColor: palette.forest }).addTo(layerGroup);
      });

      activeData.builtUpClusters.forEach((cluster) => {
        L.polygon(cluster as [number, number][], { color: palette.built, weight: 1, fillOpacity: 0.5, fillColor: palette.built }).addTo(layerGroup);
      });

      activeData.waterBodies.forEach((water) => {
        L.polygon(water as [number, number][], { color: palette.water, weight: 1, fillOpacity: 0.55, fillColor: palette.water }).addTo(layerGroup);
      });

      const polylineCoords = [...activeData.outerBoundary, activeData.outerBoundary[0]] as [number, number][];
      L.polyline(polylineCoords, { color: "#FBBF24", weight: 3, dashArray: "6, 8" }).addTo(layerGroup);

      const bounds = L.latLngBounds(activeData.outerBoundary as [number, number][]);
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    } else {
      map.flyTo(PUNE_COORDS, 11, { duration: 1.5 });
    }
  }, [selectedZone, layerMode]);

  return <div ref={mapRef} className="w-full h-full z-0 bg-[#060911]" />;
}