import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const Map = ({ markers, onDrawGeoJson, canDraw }) => {
    const mapRef = useRef();

    const handleCreated = (e) => {
        if (!canDraw) return;
        const layer = e.layer;
        const geoJson = layer.toGeoJSON();
        onDrawGeoJson(geoJson);
    };

    const handleDeleted = () => {
        onDrawGeoJson(null);
    };

    return (
        <MapContainer center={[37.0902, -95.7129]} zoom={5} className="h-full w-full" ref={mapRef}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* FeatureGroup for EditControl */}
            <FeatureGroup>
                <EditControl
                    position="topright"
                    onCreated={handleCreated}
                    onDeleted={handleDeleted}
                    draw={{
                        rectangle: false,
                        circlemarker: false,
                        polygon: canDraw,
                        circle: canDraw,
                    }}
                />
            </FeatureGroup>

            {/* Marker Clustering */}
            <MarkerClusterGroup>
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={[marker.lat, marker.lon]}
                    >
                        <Popup>
                            <div>
                                <strong>{marker.firstName} {marker.lastName}</strong>
                                <p>{marker.city}, {marker.state}</p>
                                <p>{marker.zip}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
};

export default Map;
