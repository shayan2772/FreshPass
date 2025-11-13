import * as Location from "expo-location";
import {
  Coordinates,
  ResolvedLocationDetails,
  GoogleGeocodeComponent,
  GoogleGeocodeResponse,
  ParsedAddress,
  ResolveCurrentLocationArgs,
  ResolveCurrentLocationResult,
} from "@/src/types/location";

export const parseAddressComponents = (
  components: GoogleGeocodeComponent[] = []
): ParsedAddress => {
  let streetNumber = "";
  let route = "";
  let locality = "";
  let administrativeArea = "";
  let postalCode = "";

  components.forEach((component) => {
    const types = component.types ?? [];
    if (types.includes("street_number")) {
      streetNumber = component.long_name ?? "";
    }
    if (types.includes("route")) {
      route = component.long_name ?? "";
    }
    if (
      types.includes("locality") ||
      types.includes("sublocality") ||
      types.includes("postal_town")
    ) {
      locality = component.long_name ?? locality;
    }
    if (
      types.includes("administrative_area_level_2") ||
      types.includes("administrative_area_level_1")
    ) {
      administrativeArea = component.long_name ?? administrativeArea;
    }
    // Check for postal_code - some countries use different types
    if (
      types.includes("postal_code") ||
      types.includes("postal_code_prefix") ||
      types.includes("postal_code_suffix")
    ) {
      // Try short_name first (often used for postal codes), fallback to long_name
      postalCode = component.short_name ?? component.long_name ?? postalCode;
    }
  });

  return {
    street: [streetNumber, route].filter(Boolean).join(" "),
    areaName: locality || administrativeArea,
    postal: postalCode,
  };
};


const tryGetPosition = async (): Promise<Location.LocationObject> => {
  const attempts: Array<{ accuracy: Location.Accuracy; timeout: number }> = [
    { accuracy: Location.Accuracy.High, timeout: 10000 },
    { accuracy: Location.Accuracy.Balanced, timeout: 10000 },
    { accuracy: Location.Accuracy.Low, timeout: 8000 },
  ];

  for (const attempt of attempts) {
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: attempt.accuracy,
        timeout: attempt.timeout,
        maximumAge: 0,
        mayAllowReducedAccuracy: true,
      });
      return position;
    } catch (error) {
      console.warn("getCurrentPosition retry failed", error);
    }
  }

  throw new Error("LOCATION_UNAVAILABLE");
};

const resolveAddressViaGoogle = async (
  coordinates: Coordinates,
  apiKey: string
) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=${apiKey}`
    );
    const payload = (await response.json()) as GoogleGeocodeResponse;
    if (payload.status !== "OK" || !payload.results?.length) {
      console.warn(
        "Google geocode did not return results",
        payload.status,
        payload.error_message
      );
      return null;
    }

    const primaryResult = payload.results[0];
    const parsedComponents = parseAddressComponents(
      primaryResult.address_components ?? []
    );

    return {
      street: parsedComponents.street,
      area: parsedComponents.areaName,
      postal: parsedComponents.postal,
      formatted: primaryResult.formatted_address,
    };
  } catch (error) {
    console.warn("Google geocode request failed", error);
    return null;
  }
};

export const resolveCurrentLocation = async ({
  apiKey,
}: ResolveCurrentLocationArgs): Promise<ResolveCurrentLocationResult> => {
  const servicesEnabled = await Location.hasServicesEnabledAsync();
  if (!servicesEnabled) {
    return {
      status: "error",
      message:
        "Location services are turned off. Please enable them and try again.",
    };
  }

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== Location.PermissionStatus.GRANTED) {
    return {
      status: "error",
      message: "Location permission is required to continue.",
    };
  }

  try {
    const cachedPosition = await Location.getLastKnownPositionAsync();
    const currentPosition = cachedPosition ?? (await tryGetPosition());

    const coordinates: Coordinates = {
      latitude: currentPosition.coords.latitude,
      longitude: currentPosition.coords.longitude,
    };

    let reverseAddress: Location.ReverseGeocodeAddress | undefined;
    let googleParsed: {
      street?: string;
      area?: string;
      postal?: string;
      formatted?: string;
    } | null = null;
    let notice: string | null = null;

    try {
      const reverseResults = await Location.reverseGeocodeAsync(coordinates, {
        useGoogleMaps: true,
        timeout: 15000,
      });
      [reverseAddress] = reverseResults;
    } catch (reverseError) {
      console.warn("Reverse geocode failed", reverseError);
      const providerStatus = await Location.getProviderStatusAsync();
      console.warn("Provider status", providerStatus);
      notice =
        "We found your coordinates but couldn’t fetch the address. Please confirm the details below.";
    }

    if (!reverseAddress && apiKey) {
      googleParsed = await resolveAddressViaGoogle(coordinates, apiKey);
      if (!googleParsed) {
        notice =
          "We found your coordinates but couldn’t fetch the address. Please confirm the details below.";
      }
    }

    const derivedStreetFromReverse = [
      reverseAddress?.name,
      reverseAddress?.street,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();
    const derivedAreaFromReverse =
      reverseAddress?.city ??
      reverseAddress?.subregion ??
      reverseAddress?.region ??
      "";
    const derivedPostalFromReverse = reverseAddress?.postalCode ?? "";

    const street = derivedStreetFromReverse || googleParsed?.street || "";
    const area = derivedAreaFromReverse || googleParsed?.area || "";
    const postal = derivedPostalFromReverse || googleParsed?.postal || "";
    const formattedAddress =
      googleParsed?.formatted ||
      (reverseAddress
        ? [derivedStreetFromReverse, derivedAreaFromReverse]
            .filter(Boolean)
            .join(", ")
        : undefined);

    return {
      status: "success",
      details: {
        coordinates,
        street,
        area,
        postal,
        formattedAddress,
        notice,
      },
    };
  } catch (error) {
    console.error("resolveCurrentLocation failure", error);
    const message =
      error instanceof Error ? error.message : "Location lookup failed";
    return {
      status: "error",
      message:
        message === "LOCATION_UNAVAILABLE" ||
        message.toLowerCase().includes("unavailable")
          ? "Current location is unavailable. Check that precise location is enabled or adjust your device settings."
          : "Unable to fetch your current location. Try again.",
    };
  }
};

