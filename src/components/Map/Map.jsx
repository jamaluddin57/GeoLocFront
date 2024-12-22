import React, { useState } from 'react';
import { DeckGL } from 'deck.gl';
import { EditableGeoJsonLayer, DrawPolygonMode } from '@nebula.gl/layers';
import { Map } from 'react-map-gl';
import { ScatterplotLayer } from 'deck.gl';
import { motion } from 'framer-motion';

const MAPBOX_TOKEN = "pk.eyJ1Ijoic2FkMXEiLCJhIjoiY200emVtNDEwMDNkdzJrcjVncnpqNGlxMiJ9.cZjQ2QFOAOzKAT1AjZ1pQA"; // Add your Mapbox token here
const MapComponent = ({ markers, onDrawGeoJson, canDraw, clearFilters }) => {
    const [drawMode, setDrawMode] = useState(null);
    const [geoJsonData, setGeoJsonData] = useState({ type: 'FeatureCollection', features: [] });
  
    const handleDrawStart = () => {
      if (canDraw) {
        setDrawMode(DrawPolygonMode);
      }
    };
  
    const handleDrawComplete = ({ updatedData }) => {
      setGeoJsonData(updatedData);
      const lastFeature = updatedData.features[updatedData.features.length - 1];
      onDrawGeoJson(lastFeature);
      setDrawMode(null);
    };
  
    const clearDrawnLayers = () => {
      setGeoJsonData({ type: 'FeatureCollection', features: [] });
      clearFilters();
    };
  
    const layers = [
      // Scatterplot Layer for Markers
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
      }),
  
      // Editable GeoJson Layer for Drawing
      new EditableGeoJsonLayer({
        id: 'geojson-layer',
        data: geoJsonData,
        mode: drawMode,
        selectedFeatureIndexes: [],
        getFillColor: [0, 0, 255, 128],
        getLineColor: [0, 0, 255],
        onEdit: handleDrawComplete,
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
          controller={true}
          layers={layers}
        >
          <Map
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
          />
        </DeckGL>
  
        <motion.button
          onClick={() => {
            clearDrawnLayers();
          }}
          className="absolute bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          style={{ zIndex: 1000 }}
          whileHover={{ scale: 1.1, backgroundColor: '#2563EB' }}
          whileTap={{ scale: 0.9 }}
        >
          Clear Filters
        </motion.button>
  
        {canDraw && (
          <motion.button
            onClick={handleDrawStart}
            className="absolute bottom-4 left-24 bg-green-500 text-white px-4 py-2 rounded-lg"
            style={{ zIndex: 1000 }}
            whileHover={{ scale: 1.1, backgroundColor: '#22C55E' }}
            whileTap={{ scale: 0.9 }}
          >
            Start Drawing
          </motion.button>
        )}
      </div>
    );
  };
  
  export default MapComponent;