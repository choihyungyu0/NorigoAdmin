import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type CultureQuestionHotspot } from '../../types/culture';

type CultureHotspotLeafletMapProps = {
  hotspots: CultureQuestionHotspot[];
};

const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const mapFallbackBackground = {
  backgroundColor: '#edf2f7',
  backgroundImage: [
    'linear-gradient(26deg, transparent 0 45%, rgba(148, 163, 184, 0.26) 45% 47%, transparent 47% 100%)',
    'linear-gradient(118deg, transparent 0 52%, rgba(148, 163, 184, 0.22) 52% 54%, transparent 54% 100%)',
    'linear-gradient(0deg, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.08))',
    'linear-gradient(90deg, rgba(203, 213, 225, 0.24) 1px, transparent 1px)',
    'linear-gradient(0deg, rgba(203, 213, 225, 0.24) 1px, transparent 1px)',
  ].join(', '),
  backgroundPosition: '-20px 30px, 22px -12px, 0 0, 0 0, 0 0',
  backgroundSize: '220px 160px, 260px 190px, 100% 100%, 84px 84px, 84px 84px',
};

const markerToneStyles: Record<CultureQuestionHotspot['tone'], { background: string; ring: string }> = {
  blue: {
    background: '#2563eb',
    ring: 'rgba(37, 99, 235, 0.16)',
  },
  orange: {
    background: '#f97316',
    ring: 'rgba(249, 115, 22, 0.18)',
  },
  red: {
    background: '#ef4444',
    ring: 'rgba(239, 68, 68, 0.2)',
  },
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

function buildTooltip(hotspot: CultureQuestionHotspot) {
  return [
    `<strong>${hotspot.rank}. ${escapeHtml(hotspot.place)}</strong>`,
    `<span>질문 증가율 ${hotspot.increasePercent}% · 권역 집계</span>`,
  ].join('');
}

function buildMarkerHtml(hotspot: CultureQuestionHotspot) {
  const tone = markerToneStyles[hotspot.tone];
  const style = [
    'position:relative',
    'display:grid',
    'width:36px',
    'height:36px',
    'place-items:center',
    'border:4px solid #ffffff',
    'border-radius:999px',
    `background:${tone.background}`,
    'color:#ffffff',
    'font-size:13px',
    'font-weight:900',
    'line-height:1',
    `box-shadow:0 0 0 9px ${tone.ring}, 0 12px 24px rgba(15, 23, 42, 0.18)`,
  ].join(';');

  return `<span style="${style}"><strong>${hotspot.rank}</strong></span>`;
}

export function CultureHotspotLeafletMap({ hotspots }: CultureHotspotLeafletMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(containerRef.current, {
      attributionControl: false,
      center: [37.56, 126.99],
      preferCanvas: true,
      scrollWheelZoom: false,
      zoom: 12,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

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

    hotspots.forEach((hotspot) => {
      const icon = L.divIcon({
        className: 'culture-map-marker-shell',
        html: buildMarkerHtml(hotspot),
        iconAnchor: [18, 18],
        iconSize: [36, 36],
      });

      L.marker([hotspot.lat, hotspot.lng], { icon })
        .addTo(layer)
        .bindTooltip(buildTooltip(hotspot), {
          className: 'culture-map-tooltip',
          direction: 'top',
          offset: [0, -14],
          opacity: 1,
        });
    });

    if (hotspots.length > 0) {
      const bounds = L.latLngBounds(hotspots.map((hotspot) => [hotspot.lat, hotspot.lng] as L.LatLngTuple));
      map.fitBounds(bounds, { maxZoom: 12, padding: [24, 24] });
    }

    return () => {
      layer.remove();
    };
  }, [hotspots]);

  return (
    <div
      aria-label="질문 증가 권역 집계 지도"
      className="culture-leaflet-map h-full min-h-[180px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
      ref={containerRef}
      role="application"
      style={mapFallbackBackground}
    />
  );
}
