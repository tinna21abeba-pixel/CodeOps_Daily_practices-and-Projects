"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

const COORDINATES = {
  Bole: [8.995, 38.785],
  Kazanchis: [9.018, 38.77],
  Megenagna: [9.022, 38.802],
  Sarbet: [8.998, 38.74],
  Piassa: [9.035, 38.752],
};

const KITCHEN_COORDS = [9.012, 38.765];

function resolveCoordinates(neighbourhood, address) {
  const query = `${neighbourhood || ""} ${address || ""}`.toLowerCase();
  for (const [key, coords] of Object.entries(COORDINATES)) {
    if (query.includes(key.toLowerCase())) {
      return { coords, label: key };
    }
  }
  return { coords: COORDINATES.Bole, label: "Bole" };
}

export default function DeliveryMap({ neighbourhood, address, status }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const { coords: deliveryCoords, label: deliveryArea } = resolveCoordinates(
    neighbourhood,
    address
  );

  let courierCoords = KITCHEN_COORDS;
  let courierStatusText = "Kitchen Dispatch";

  if (status === "delivered") {
    courierCoords = deliveryCoords;
    courierStatusText = "Delivered at Destination";
  } else if (status === "on_the_way") {
    courierCoords = [
      (KITCHEN_COORDS[0] + deliveryCoords[0]) / 2,
      (KITCHEN_COORDS[1] + deliveryCoords[1]) / 2,
    ];
    courierStatusText = "In Transit";
  } else if (status === "preparing") {
    courierStatusText = "Awaiting Pickup";
  }

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const courierIcon = L.divIcon({
      className: "marker-courier",
      html: `<div style="background:#f59e0b;color:#09090b;font-weight:700;font-size:11px;padding:3px 7px;border-radius:4px;border:2px solid #ffffff;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.5);">Courier</div>`,
      iconSize: [56, 24],
      iconAnchor: [28, 12],
    });

    const deliveryIcon = L.divIcon({
      className: "marker-delivery",
      html: `<div style="background:#10b981;color:#ffffff;font-weight:700;font-size:11px;padding:3px 7px;border-radius:4px;border:2px solid #ffffff;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.5);">Delivery</div>`,
      iconSize: [60, 24],
      iconAnchor: [30, 12],
    });

    L.marker(courierCoords, { icon: courierIcon }).addTo(map);
    L.marker(deliveryCoords, { icon: deliveryIcon }).addTo(map);

    const bounds = L.latLngBounds([courierCoords, deliveryCoords]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [
    courierCoords[0],
    courierCoords[1],
    deliveryCoords[0],
    deliveryCoords[1],
  ]);

  return (
    <div className="mt-6">
      <div
        ref={mapContainerRef}
        style={{ height: "300px" }}
        className="w-full h-[300px] rounded-xl overflow-hidden border border-zinc-800"
      />

      <div className="mt-3 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-amber-400">Courier Location</span>
          <span className="font-mono text-zinc-300">
            {courierCoords[0].toFixed(4)} N, {courierCoords[1].toFixed(4)} E ({courierStatusText})
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-emerald-400">Delivery Destination</span>
          <span className="font-mono text-zinc-300">
            {deliveryCoords[0].toFixed(4)} N, {deliveryCoords[1].toFixed(4)} E ({deliveryArea})
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-zinc-800 text-zinc-400">
          <span>Map Viewport</span>
          <span>Fitted to encompass courier and delivery markers</span>
        </div>
      </div>
    </div>
  );
}
