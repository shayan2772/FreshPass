import { useCallback, useState } from "react";
import * as Location from "expo-location";
import { ResolvedLocationDetails } from "./stepFourTypes";
import { buildAddressSummary, parseAddressComponents } from "./stepFourUtils";

const locationUnavailableMessage =
  "Current location is unavailable. Check that precise location is enabled or adjust your device settings.";

const genericFailureMessage =
  "Unable to fetch your current location. Try again.";

const coordinatesNotice =
  "We found your coordinates but couldn’t fetch the address. Please confirm the details below.";

export const useResolveCurrentLocation = (apiKey?: string) => {
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolveCurrentLocation = useCallback(async (): Promise<
    ResolvedLocationDetails | null
  > => {
    setError(null);
    setIsResolving(true);

    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setError(
          "Location services are turned off. Please enable them and try again."
        );
        return null;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        setError("Location permission is required to continue.");
        return null;
      }

      const cachedPosition =
        (await Location.getLastKnownPositionAsync()) ?? null;

      const tryGetPosition = async () => {
        const attempts: Array<{ accuracy: Location.Accuracy; timeout: number }> =
          [
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
          } catch (attemptError) {
            console.warn("getCurrentPosition retry failed", attemptError);
          }
        }

        throw new Error("LOCATION_UNAVAILABLE");
      };

      const currentPosition = cachedPosition ?? (await tryGetPosition());

      const coordinates = {
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      };

      let reverseAddress: Location.ReverseGeocodeAddress | undefined;
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
      }

      let googleParsed:
        | {
            street?: string;
            area?: string;
            postal?: string;
            formatted?: string;
          }
        | null = null;

      if (!reverseAddress && apiKey) {
        try {
          const googleResponse = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=${apiKey}`
          );
          const googleJson = await googleResponse.json();
          if (
            googleJson.status === "OK" &&
            Array.isArray(googleJson.results) &&
            googleJson.results.length > 0
          ) {
            const primaryResult = googleJson.results[0];
            const parsedComponents = parseAddressComponents(
              primaryResult.address_components ?? []
            );
            googleParsed = {
              street: parsedComponents.street,
              area: parsedComponents.areaName,
              postal: parsedComponents.postal,
              formatted: primaryResult.formatted_address,
            };
          } else {
            console.warn(
              "Google geocode did not return results",
              googleJson.status,
              googleJson.error_message
            );
          }
        } catch (googleError) {
          console.warn("Google geocode request failed", googleError);
        }
      }

      const reverseStreet = [
        reverseAddress?.name,
        reverseAddress?.street,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();
      const reverseArea =
        reverseAddress?.city ??
        reverseAddress?.subregion ??
        reverseAddress?.region ??
        "";
      const reversePostal = reverseAddress?.postalCode ?? "";

      const street = googleParsed?.street || reverseStreet || undefined;
      const area = googleParsed?.area || reverseArea || undefined;
      const postal = googleParsed?.postal || reversePostal || undefined;

      const formattedAddress =
        googleParsed?.formatted ||
        buildAddressSummary(reverseStreet, reverseArea, reversePostal) ||
        undefined;

      const notice =
        !reverseAddress && !googleParsed ? coordinatesNotice : null;

      return {
        coordinates,
        street,
        area,
        postal,
        formattedAddress,
        notice,
      };
    } catch (err) {
      console.error("error", err);
      const message = err instanceof Error ? err.message : "";
      if (
        message.toLowerCase().includes("unavailable") ||
        message === "LOCATION_UNAVAILABLE"
      ) {
        setError(locationUnavailableMessage);
      } else {
        setError(genericFailureMessage);
      }
      return null;
    } finally {
      setIsResolving(false);
    }
  }, [apiKey]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    resolveCurrentLocation,
    isResolving,
    error,
    resetError,
  };
};

