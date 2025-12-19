"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { useEventLocation } from "@/features/events/hooks/useEventLocation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { ArrowLeft, MapPin, Navigation, Search } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const DEFAULT_POSITION = { lat: -23.55052, lng: -46.633308 };

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const searchParams = useSearchParams();
  const { setLoading: setGlobalLoading } = useGlobalLoading();
  const { loading: updatingLocation, updateLocation } = useEventLocation();
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const [address, setAddress] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(DEFAULT_POSITION);
  const [loading, setLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Obter a posição inicial dos query params, se existir
  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const address = searchParams.get("address");
    if (lat && lng) {
      setSelectedPosition({ lat: parseFloat(lat), lng: parseFloat(lng) });
    }
    if (address) {
      setAddress(address);
    }
  }, [searchParams]);

  // Função para voltar mantendo o estado salvo
  const handleBack = () => {
    router.push(`/super/events/${eventId}`);
  };

  // Função para obter a localização atual do usuário
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocalização não é suportada pelo seu navegador");
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setSelectedPosition(location);

        // Se o mapa já estiver carregado, centralizar na nova localização
        if (map && marker) {
          map.setCenter(location);
          map.setZoom(15);
          marker.setPosition(location);
          reverseGeocode(location);
        }

        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Permissão de localização negada. Por favor, permita o acesso à localização nas configurações do seu navegador."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError(
              "Localização indisponível. Verifique se o GPS está ativado."
            );
            break;
          case error.TIMEOUT:
            setLocationError("Tempo limite para obter a localização excedido.");
            break;
          default:
            setLocationError("Erro desconhecido ao obter localização.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("Chave da API do Google Maps não configurada");
      return;
    }

    const initMap = async () => {
      try {
        setLoading(true);
        setGlobalLoading(true);

        setOptions({
          key: apiKey,
          libraries: ["places"],
        });

        const { Map } = await importLibrary("maps");
        const { Marker } = await importLibrary("marker");
        const { SearchBox } = await importLibrary("places");

        if (!mapRef.current) return;

        const mapInstance = new Map(mapRef.current, {
          center: selectedPosition,
          zoom: 15,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        const markerInstance = new Marker({
          position: selectedPosition,
          map: mapInstance,
          draggable: true,
          title: "Local do evento",
        });

        // Configurar search box se o input existir
        if (searchInputRef.current) {
          const searchBoxInstance = new SearchBox(searchInputRef.current);

          searchBoxInstance.addListener("places_changed", () => {
            const places = searchBoxInstance.getPlaces();
            if (!places || places.length === 0) return;

            const place = places[0];
            if (!place.geometry?.location) return;

            const location = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };

            mapInstance.setCenter(location);
            mapInstance.setZoom(17);
            markerInstance.setPosition(location);
            setSelectedPosition(location);

            const newAddress = place.formatted_address || "";
            setAddress(newAddress);
          });

          mapInstance.addListener("bounds_changed", () => {
            searchBoxInstance.setBounds(
              mapInstance.getBounds() as google.maps.LatLngBounds
            );
          });

          setSearchBox(searchBoxInstance);
        }

        // Map click event
        mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;

          const location = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };

          markerInstance.setPosition(location);
          setSelectedPosition(location);
          reverseGeocode(location);
        });

        // Marker drag event
        markerInstance.addListener("dragend", () => {
          const position = markerInstance.getPosition();
          if (!position) return;

          const location = {
            lat: position.lat(),
            lng: position.lng(),
          };

          setSelectedPosition(location);
          reverseGeocode(location);
        });

        setMap(mapInstance);
        setMarker(markerInstance);

        // Fazer reverse geocode inicial se tiver posição mas não endereço
        if (selectedPosition && !address) {
          reverseGeocode(selectedPosition);
        }
      } catch (err) {
        console.error("Erro ao carregar Google Maps:", err);
      } finally {
        setLoading(false);
        setGlobalLoading(false);
      }
    };

    initMap();

    // Cleanup: desativar loading global ao desmontar
    return () => {
      setGlobalLoading(false);
    };
  }, [selectedPosition, address, setGlobalLoading]);

  const reverseGeocode = (location: { lat: number; lng: number }) => {
    if (!window.google) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const newAddress = results[0].formatted_address;
        setAddress(newAddress);
      } else {
        setAddress("Endereço não encontrado");
      }
    });
  };

  const handleConfirmLocation = async () => {
    if (!address) {
      return;
    }

    const success = await updateLocation(
      eventId,
      address,
      selectedPosition.lng,
      selectedPosition.lat
    );

    if (success) {
      // Voltar para a página de gerenciamento do evento
      router.push(`/super/events/${eventId}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca é tratada automaticamente pelo SearchBox
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Editar Localização
            </h1>
            <p className="text-muted-foreground">
              Escolha o local do evento no mapa
            </p>
          </div>
        </div>

        {/* Botão para localização atual */}
        <Button
          variant="outline"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="flex items-center gap-2"
        >
          {isGettingLocation ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          {isGettingLocation ? "Obtendo..." : "Minha Localização"}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar endereço, cidade ou ponto de referência..."
            className="pl-10 pr-4 py-2 w-full"
          />
        </form>
      </div>

      {/* Map Container - Ocupa a maior parte da tela */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="absolute inset-0" />
        {loading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">
                Carregando mapa...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Selected Location Info and Confirm Button */}
      <div className="p-4 border-t bg-card">
        {/* Mensagem de erro da localização */}
        {locationError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{locationError}</p>
          </div>
        )}

        <div className="mb-4 p-4 border rounded-lg bg-muted/50">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-foreground">
                Local selecionado:
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {address || "Nenhum endereço selecionado"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Coordenadas: {selectedPosition.lat.toFixed(6)},{" "}
                {selectedPosition.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleConfirmLocation}
          disabled={!address || updatingLocation}
          className="w-full"
        >
          {updatingLocation ? "Salvando..." : "Confirmar Localização"}
        </Button>
      </div>

      {/* Estilos globais para o dropdown do autocomplete */}
      <style jsx global>{`
        .pac-container {
          z-index: 9999 !important;
          border-radius: 8px !important;
          border: 1px solid #e5e7eb !important;
          box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          background: white !important;
          font-family: inherit !important;
        }
        .pac-item {
          padding: 8px 12px !important;
          border-bottom: 1px solid #f3f4f6 !important;
          cursor: pointer !important;
          font-size: 14px !important;
          color: #111827 !important;
        }
        .pac-item:hover {
          background-color: #f9fafb !important;
        }
        .pac-item-query {
          font-size: 14px !important;
          color: #111827 !important;
          font-weight: 500 !important;
        }
        .pac-matched {
          font-weight: 600 !important;
          color: #2563eb !important;
        }
        .pac-icon {
          margin-top: 2px !important;
        }
      `}</style>
    </div>
  );
}
