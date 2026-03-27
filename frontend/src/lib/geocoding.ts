export const forwardGeocode = async (place: string) => {
  const query = String(place || "").trim();
  if (!query) {
    return undefined;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=1`
    );

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();
    const first = Array.isArray(data) ? data[0] : undefined;
    const latitude = Number(first?.lat);
    const longitude = Number(first?.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return undefined;
    }

    return { latitude, longitude };
  } catch {
    return undefined;
  }
};
