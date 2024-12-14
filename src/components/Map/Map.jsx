import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { motion } from 'framer-motion';
const Map = ({ markers, onDrawGeoJson, canDraw, clearFilters }) => {
    const mapRef = useRef();
    const featureGroupRef = useRef();
    const clusterGroupRef = useRef();
    const [featureGroupKey, setFeatureGroupKey] = useState(Date.now());

    const handleCreated = (e) => {
        if (!canDraw) return;
        const layer = e.layer;
        const geoJson = layer.toGeoJSON();

        // Check if the drawn layer is a circle and add the radius to the GeoJSON properties
        if (layer instanceof L.Circle) {
            geoJson.properties.radius = layer.getRadius();
            console.log(layer.getRadius());
        }

        onDrawGeoJson(geoJson);
    };

    const clearDrawnLayers = () => {
        const clusterGroup = clusterGroupRef.current;

        // Clear MarkerClusterGroup (markers)
        if (clusterGroup) {
            clusterGroup.clearLayers();
        }

        // Reset FeatureGroup (drawn layers)
        setFeatureGroupKey(Date.now());
    };


    return (
        <div className="relative flex-grow w-full h-[600px] shadow-lg border rounded-lg overflow-hidden">
            <MapContainer center={[37.0902, -95.7129]} zoom={5} className="h-full w-full" ref={mapRef}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <FeatureGroup ref={featureGroupRef} key={featureGroupKey}>
                    <EditControl
                        position="topright"
                        onCreated={handleCreated}
                        draw={{
                            rectangle: false,
                            circlemarker: false,
                            polygon: canDraw,
                            circle: canDraw,
                            polyline: false,
                            marker: false,
                        }}
                        edit={{
                            remove: false,
                            edit:false
                        }}
                    />
                </FeatureGroup>
                <MarkerClusterGroup ref={clusterGroupRef}>
                    {markers.map((marker) => (
                        <Marker key={marker.id} position={[marker.lat, marker.lon]}>
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
            <motion.button
                onClick={() => {
                    clearDrawnLayers();
                    clearFilters();
                }}
                className="absolute bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                style={{ zIndex: 1000 }}
                whileHover={{ scale: 1.1, backgroundColor: '#2563EB' }}
                whileTap={{ scale: 0.9 }}
            >
                Clear Filters
            </motion.button>
        </div>
    );
};

export default Map;
