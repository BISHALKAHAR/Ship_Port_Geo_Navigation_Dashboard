// data.js
import geoStatsDataRaw from './updated_ships_data.json';
import portGeoLocationDataRaw from './updated_ports_data.json';



// Process geo_stats_data_7_days
const processedGeoStatsData = {
  type: 'FeatureCollection',
  features: geoStatsDataRaw.map((row) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [row['location_longitude'], row['location_latitude']],
    },
    properties: {
      site_name: row['site_name'],
      heading: row['heading'],
      timestamp: row['ec_timestamp'],
      recent_ports : row['visited_ports'],
    },
  })),
};

// Process port_geo_location
const processedPortGeoLocationData = {
  type: 'FeatureCollection',
  features: portGeoLocationDataRaw.map((row) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [row['geo_location_longitude'], row['geo_location_latitude']],
    },
    properties: {
      port_name: row['port_name'],
      visit_count: row['visit_count'], 

    },
  })),
};

export { processedGeoStatsData, processedPortGeoLocationData };
