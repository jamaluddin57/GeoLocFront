import React, { useState, useEffect } from 'react';
import { DeckGL } from 'deck.gl';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { DrawPolygonMode, DrawCircleFromCenterMode } from '@nebula.gl/edit-modes';
import { Map } from 'react-map-gl';
import { ScatterplotLayer } from 'deck.gl';
import { motion } from 'framer-motion';

const MAPBOX_TOKEN = "pk.eyJ1Ijoic2FkMXEiLCJhIjoiY200emVtNDEwMDNkdzJrcjVncnpqNGlxMiJ9.cZjQ2QFOAOzKAT1AjZ1pQA";

const calculateDistance = (point1, point2) => {
    const [lon1, lat1] = point1;
    const [lon2, lat2] = point2;
    
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

const MapComponent = ({ markers, onDrawGeoJson, canDraw, clearFilters }) => {
    const [drawMode, setDrawMode] = useState(null);
    const [geoJsonData, setGeoJsonData] = useState({ type: 'FeatureCollection', features: [] });
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (mode) => {
        if (!canDraw || isDrawing) return;

        setGeoJsonData({ type: 'FeatureCollection', features: [] });
        setIsDrawing(true);

        const newMode = mode === "circle" 
            ? new DrawCircleFromCenterMode()
            : new DrawPolygonMode();
        
        setDrawMode(newMode);
    };

    const handleEdit = ({ editType, updatedData, editContext }) => {
        if (editType === 'addFeature') {
            const lastFeature = updatedData.features[updatedData.features.length - 1];
            
            if (lastFeature && drawMode instanceof DrawCircleFromCenterMode) {
                const coordinates = lastFeature.geometry.coordinates[0];
                const centerIndex = Math.floor(coordinates.length / 4);
                const radius = calculateDistance(
                    coordinates[0],
                    coordinates[centerIndex]
                );
                
                lastFeature.properties = {
                    ...lastFeature.properties,
                    radius: radius.toFixed(2)
                };
                
                updatedData.features[updatedData.features.length - 1] = lastFeature;
            }

            setGeoJsonData(updatedData);
            
            if (lastFeature) {
                onDrawGeoJson(lastFeature);
            }
            setDrawMode(null);
            setIsDrawing(false);
        }
    };

    const clearDrawnLayers = () => {
        setGeoJsonData({ type: 'FeatureCollection', features: [] });
        clearFilters();
        setDrawMode(null);
        setIsDrawing(false);
    };

    const layers = [
        new ScatterplotLayer({
            id: 'scatterplot-layer',
            data: markers,
            getPosition: (d) => [d.lon, d.lat],
            getFillColor: [255, 140, 0],
            getRadius: 200,
            radiusScale: 10,
            radiusMinPixels: 2,
            radiusMaxPixels: 30,
            pickable: true,
            onHover: (info) => {
                if (info.object) {
                    console.log(`Hovered: ${info.object.firstName} ${info.object.lastName}`);
                }
            },
            getCursor: () => isDrawing ? 'crosshair' : 'grab'
        }),
        new EditableGeoJsonLayer({
            id: 'geojson-layer',
            data: geoJsonData,
            mode: drawMode,
            selectedFeatureIndexes: [],
            getFillColor: [0, 0, 255, 128],
            getLineColor: [0, 0, 255],
            onEdit: handleEdit,
            pickable: true,
            editHandleType: 'point',
            editHandleShape: 'circle',
            getCursor: () => isDrawing ? 'crosshair' : 'grab',
            editHandleStyle: {
                fill: '#fff',
                stroke: '#000',
                strokeWidth: 2,
            },
        }),
    ];

    return (
        <div className="relative flex-grow w-full h-[600px] shadow-lg border rounded-lg overflow-hidden">
            <DeckGL
                initialViewState={{
                    longitude: -95.7129,
                    latitude: 37.0902,
                    zoom: 5,
                    pitch: 0,
                    bearing: 0,
                }}
                controller={{
                    dragPan: !isDrawing,
                    dragRotate: !isDrawing,
                    scrollZoom: !isDrawing,
                    doubleClickZoom: !isDrawing,
                    touchZoom: !isDrawing,
                    touchRotate: !isDrawing,
                    keyboard: !isDrawing
                }}
                getCursor={({isDragging}) => {
                    if (isDrawing) return 'crosshair';
                    return isDragging ? 'grabbing' : 'grab';
                }}
                layers={layers}
            >
                <Map
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    mapboxAccessToken={MAPBOX_TOKEN}
                />
            </DeckGL>

            <div className="absolute bottom-4 left-4 flex flex-wrap gap-4" style={{ zIndex: 2 }}>
                <motion.button
                    onClick={clearDrawnLayers}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Clear Filters
                </motion.button>

                {canDraw && (
                    <>
                        <motion.button
                            onClick={() => startDrawing("polygon")}
                            className={`bg-green-500 text-white px-4 py-2 rounded-lg shadow-md transition-colors
                                ${isDrawing && drawMode instanceof DrawPolygonMode ? 'bg-green-700' : 'hover:bg-green-600'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isDrawing}
                        >
                            Draw Polygon
                        </motion.button>
                        <motion.button
                            onClick={() => startDrawing("circle")}
                            className={`bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md transition-colors
                                ${isDrawing && drawMode instanceof DrawCircleFromCenterMode ? 'bg-yellow-700' : 'hover:bg-yellow-600'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isDrawing}
                        >
                            Draw Circle
                        </motion.button>
                    </>
                )}
            </div>
        </div>
    );
};

export default MapComponent;