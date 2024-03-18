export interface ICurrentCoordinates {
  latitude: number;
  longitude: number;
}

export interface IVehiclePosition {
  latitudeInicial: number;
  longitudeInicial: number;
  latitudeFinal: number;
  longitudeFinal: number;
}

export interface IRenderMarkerImageHashMap {
  [key: string]: React.ReactNode;
}
