import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { processedGeoStatsData, processedPortGeoLocationData } from './Data';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZXNwYWNlc2VydmljZSIsImEiOiJjbHZ1dHZjdTQwMDhrMm1uMnoxdWRibzQ4In0.NaprcMBbdX07f4eXXdr-lw';

console.log(processedGeoStatsData.type)

const Map = () => {
    const mapContainerRef = useRef(null);
    const [selectedShip, setSelectedShip] = useState(null);  // State to hold the selected ship's data

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [0, 0],
            zoom: 2,
        });

        map.on('load', () => {
            map.addSource('enemy-ships', {
                type: 'geojson',
                data: processedGeoStatsData,
            });

            map.addLayer({
                id: 'enemy-ships-layer',
                type: 'circle',
                source: 'enemy-ships',
                paint: {
                    'circle-color': 'blue',
                    'circle-radius': 5,
                },
            });

            map.addSource('enemy-ports', {
                type: 'geojson',
                data: processedPortGeoLocationData,
            });

            map.addLayer({
                id: 'enemy-ports-layer',
                type: 'circle',
                source: 'enemy-ports',
                paint: {
                    'circle-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'visit_count'],
                        0, 'rgba(255, 0, 0, 0.1)',
                        1000, 'rgba(255, 0, 0, 1)'
                    ],
                    'circle-radius': 5
                }
            });

            // Setup event handlers for clicking or hovering over ships
            map.on('click', 'enemy-ships-layer', (e) => {
                const shipData = e.features[0].properties;
                console.log('Ship data:', shipData);
                console.log(shipData.type)
                shipData.recent_ports = shipData.recent_ports || [];  // Ensure recent_ports is an array
                setSelectedShip(shipData);
            });

            map.on('mouseenter', 'enemy-ships-layer', () => {
                map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mouseleave', 'enemy-ships-layer', () => {
                map.getCanvas().style.cursor = '';
            });
        });

        return () => map.remove();
    }, []);

    return (
        <div className="map-container" style={{ display: 'flex', height: '100vh' }}>
            <div ref={mapContainerRef} style={{ flex: 1 }} />
            {selectedShip && (
                <div className="details-panel" style={{ width: '250px', padding: '20px', backgroundColor: 'white', overflowY: 'auto' }}>
                    <h4>Visited Ports (Last 7 Days)</h4>
                    <h5>{selectedShip.site_name}</h5>
                    <ul>
                        {selectedShip.recent_ports.length > 0 ? (
                            JSON.parse(selectedShip.recent_ports).map((port, index) => (
                                <li key={index}>{port}</li>
                            ))
                            
                        ) : (
                            <li>No recent ports visited</li>
                        )}
                    </ul>   
                </div>  
            )}
        </div>
    );
};

export default Map;











