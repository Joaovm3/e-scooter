import { Image, StyleSheet } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { Geolocation } from '@/types/geolocation';
import { ScooterMarker, ScooterMarkerProps } from './ScooterMarker';
import { ForwardedRef, forwardRef, Ref } from 'react';
import { ThemedView } from './ThemedView';
import { useAuth } from '@/contexts/AuthContext';

interface MapProps {
  location: Geolocation;
  onLocationChange?: (location: Geolocation) => void;
  markers?: ScooterMarkerProps[];
  draggableMarker?: boolean;
  style?: any;
  selectedMarkerId?: string;
}

interface UserMarkerProps {
  coordinate: Geolocation;
  pictureUrl: string;
}

export const Map = forwardRef<MapView, MapProps>(function Map(props, ref) {
  const {
    location,
    onLocationChange,
    markers = [],
    draggableMarker = false,
    style,
    selectedMarkerId,
  } = props;

  // const { user } = useAuth();

  const handleMapPress = (event: MapPressEvent) => {
    if (onLocationChange) {
      const { coordinate } = event.nativeEvent;
      onLocationChange({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
    }
  };

  // const UserMarker = ({ coordinate, pictureUrl }: UserMarkerProps) => {
  //   return (
  //     <Marker coordinate={coordinate}>
  //       <ThemedView style={styles.markerContainer}>
  //         <Image source={{ uri: pictureUrl }} style={styles.profileImage} />
  //         <ThemedView style={styles.markerRing} />
  //       </ThemedView>
  //     </Marker>
  //   );
  // };

  return (
    <MapView
      ref={ref}
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
        markers.map((marker) =>
          marker.isUserLocation ? (
            <Marker
              key="user-location"
              coordinate={marker.coordinate}
              title="Sua localização"
            ></Marker>
          ) : (
            <ScooterMarker
              key={marker.id}
              coordinate={marker.coordinate}
              status={marker.status}
              batteryLevel={marker.batteryLevel}
              onPress={marker.onPress}
              isSelected={selectedMarkerId === marker.id}
            />
          ),
        )
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
});

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  markerRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    zIndex: -1,
  },
});
