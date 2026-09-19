'use client'

import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerLabel,
} from '@/components/ui/map'

/** Contact-page coordinates: factory (Çaycuma) + Istanbul office (Başakşehir). */
export const TURKEY_SALES_LOCATIONS = [
  {
    id: 'factory',
    longitude: 32.134079,
    latitude: 41.404388,
  },
  {
    id: 'istanbul',
    longitude: 28.79902,
    latitude: 41.096494,
  },
] as const

type TurkeySalesMapProps = {
  title: string
  factoryLabel: string
  istanbulLabel: string
  className?: string
}

const TURKEY_BOUNDS: [[number, number], [number, number]] = [
  [25.6, 35.7],
  [45.2, 42.4],
]

export function TurkeySalesMap({
  title,
  factoryLabel,
  istanbulLabel,
  className = '',
}: TurkeySalesMapProps) {
  const labels = {
    factory: factoryLabel,
    istanbul: istanbulLabel,
  } as const

  return (
    <div
      className={`turkey-sales-map relative overflow-hidden border border-border bg-background ${className}`.trim()}
      role="img"
      aria-label={title}
    >
      <Map
        theme="dark"
        bounds={TURKEY_BOUNDS}
        fitBoundsOptions={{padding: 28, maxZoom: 5.8}}
        minZoom={4.6}
        maxZoom={8}
        dragRotate={false}
        pitchWithRotate={false}
        className="absolute inset-0 h-full w-full"
      >
        <MapControls position="top-right" showZoom showCompass={false} />
        {TURKEY_SALES_LOCATIONS.map((location) => (
          <MapMarker
            key={location.id}
            longitude={location.longitude}
            latitude={location.latitude}
            anchor="center"
          >
            <MarkerContent className="turkey-sales-marker">
              <span className="turkey-sales-marker__pulse" aria-hidden />
              <span
                className="turkey-sales-marker__pulse turkey-sales-marker__pulse--delay"
                aria-hidden
              />
              <span
                className="turkey-sales-marker__pulse turkey-sales-marker__pulse--delay-2"
                aria-hidden
              />
              <span className="turkey-sales-marker__dot" aria-hidden />
            </MarkerContent>
            <MarkerLabel
              position="bottom"
              className="rounded-none border border-border bg-background/90 px-1.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.08em] text-foreground uppercase"
            >
              {labels[location.id]}
            </MarkerLabel>
          </MapMarker>
        ))}
      </Map>
    </div>
  )
}
