import { parseStringPromise } from 'xml2js';

export const parseGpxFile = async (gpxString: string) => {
  const result = await parseStringPromise(gpxString);
  const trackpoints = result.gpx.trk[0].trkseg[0].trkpt;

  const coordinates = trackpoints.map((point: any) => ({
    lat: parseFloat(point.$.lat),
    lon: parseFloat(point.$.lon),
    ele: point.ele ? parseFloat(point.ele[0]) : null,
  }));

  let totalDistance = 0;
  let totalAscent = 0;
  let totalDescent = 0;

  for (let i = 1; i < coordinates.length; i++) {
    const prevPoint = coordinates[i - 1];
    const currentPoint = coordinates[i];

    // Bereken de afstand tussen twee punten
    totalDistance += haversineDistance(
      prevPoint.lat, prevPoint.lon,
      currentPoint.lat, currentPoint.lon
    );

    // Bereken de stijging en daling
    if (currentPoint.ele !== null && prevPoint.ele !== null) {
      const elevationChange = currentPoint.ele - prevPoint.ele;

      if (elevationChange > 0) {
        totalAscent += elevationChange; // Stijging
      } else if (elevationChange < 0) {
        totalDescent += Math.abs(elevationChange); // Daling
      }
    }
  }

  return {
    coordinates,
    totalDistance: Math.round(totalDistance * 10) / 10, // Afronden naar 1 decimaal
    totalAscent: Math.round(totalAscent), // Totale stijging in meters
    totalDescent: Math.round(totalDescent), // Totale daling in meters
  };
};

// Haversine formule om de afstand tussen twee coördinaten te berekenen
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Straal van de aarde in kilometers
  const latDiff = (lat2 - lat1) * Math.PI / 180;
  const lonDiff = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Afstand in kilometers
};
