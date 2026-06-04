import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type LiveMapAreaMarker, type LiveMapRiskLevel } from '../../types/liveMap';

type SeoulLiveLeafletMapProps = {
  markers: LiveMapAreaMarker[];
};

const riskLabels: Record<LiveMapRiskLevel, string> = {
  veryHigh: 'Very High',
  high: 'High',
  moderate: 'Moderate',
  low: 'Low',
  noData: '데이터 없음',
};

const markerColorByClass: Record<LiveMapRiskLevel | 'retrip' | 'culture', string> = {
  culture: '#2563eb',
  high: '#f97316',
  low: '#16a34a',
  moderate: '#f59e0b',
  noData: '#64748b',
  retrip: '#8b5cf6',
  veryHigh: '#dc2626',
};

const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

function resolveMarkerClass(marker: LiveMapAreaMarker) {
  if (marker.signal === 'retrip') {
    return 'retrip';
  }

  if (marker.signal === 'culture') {
    return 'culture';
  }

  return marker.riskLevel;
}

function buildTooltip(marker: LiveMapAreaMarker) {
  const score = marker.riskScore === null ? '-' : `${marker.riskScore}/100`;

  return [
    `<strong>${escapeHtml(marker.nameKo)}</strong>`,
    `<span>${escapeHtml(marker.district)} · ${riskLabels[marker.riskLevel]} · ${score}</span>`,
  ].join('');
}

export function SeoulLiveLeafletMap({ markers }: SeoulLiveLeafletMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(containerRef.current, {
      attributionControl: false,
      center: [37.558, 126.991],
      preferCanvas: true,
      scrollWheelZoom: false,
      zoom: 11,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

    mapRef.current = map;

    const invalidateMapSize = () => map.invalidateSize();
    window.setTimeout(invalidateMapSize, 0);
    window.addEventListener('resize', invalidateMapSize);

    return () => {
      window.removeEventListener('resize', invalidateMapSize);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const layer = L.layerGroup().addTo(map);

    markers.forEach((marker) => {
      const markerClass = resolveMarkerClass(marker);
      const markerBody = marker.riskLevel === 'noData' ? '<b>×</b>' : '<span></span>';
      const icon = L.divIcon({
        className: 'live-map-marker-shell',
        html: `<span class="live-map-marker" style="color: ${markerColorByClass[markerClass]}">${markerBody}</span>`,
        iconAnchor: [12, 12],
        iconSize: [24, 24],
      });

      L.marker([marker.lat, marker.lng], { icon })
        .addTo(layer)
        .bindTooltip(buildTooltip(marker), {
          className: 'live-map-tooltip',
          direction: 'top',
          offset: [0, -10],
          opacity: 1,
        });
    });

    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((marker) => [marker.lat, marker.lng] as L.LatLngTuple));
      map.fitBounds(bounds, { maxZoom: 12, padding: [28, 28] });
    }

    return () => {
      layer.remove();
    };
  }, [markers]);

  return (
    <div
      aria-label="서울 주요 관광 권역 집계 지도"
      className="h-full min-h-[330px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
      ref={containerRef}
      role="application"
    />
  );
}
