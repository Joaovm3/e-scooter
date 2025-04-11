import { StyleSheet } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { Geolocation } from '@/types/geolocation';
import { ScooterMarker, ScooterMarkerProps } from './ScooterMarker';

interface MapProps {
  location: Geolocation;
  onLocationChange?: (location: Geolocation) => void;
  markers?: ScooterMarkerProps[];
  draggableMarker?: boolean;
  style?: any;
}

export function Map({
  location,
  onLocationChange,
  markers = [],
  draggableMarker = false,
  style,
}: MapProps) {
  const handleMapPress = (event: MapPressEvent) => {
    if (onLocationChange) {
      const { coordinate } = event.nativeEvent;
      onLocationChange({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
    }
  };

  return (
    <MapView
      style={[styles.map, style]}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      onPress={handleMapPress}
    >
      {markers.length > 0 ? (
        markers.map((marker, i) => (
          <ScooterMarker
            key={i}
            coordinate={marker.coordinate}
            status={marker.status}
            batteryLevel={marker.batteryLevel}
            onPress={marker.onPress}
          />
        ))
      ) : (
        <ScooterMarker
          coordinate={location}
          draggable={draggableMarker}
          onDragEnd={(coordinate) => {
            if (onLocationChange) {
              onLocationChange(coordinate);
            }
          }}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});
