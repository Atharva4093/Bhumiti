export interface LandParcelDS {
  id: string;
  name: string;
  coordinates: [number, number];
  outerBoundary: [number, number][]; 
  agriClusters: [number, number][][]; 
  plantations: [number, number][][]; 
  builtUpClusters: [number, number][][]; 
  waterBodies: [number, number][][]; 
  areaHectares: number;
  currentZoning: string;
  historicalData: {
    useIn2015: string;
    useIn2020: string;
    groundwaterDepletion: string;
  };
  riskFactors: {
    floodRisk: string;
    soilEncroachment: boolean;
  };
  landUse: { name: string; value: number; color: string }[];
  color: string;
}

export const PUNE_COORDS: [number, number] = [18.5204, 73.8567]; 

export const LAND_DATABASE: Record<string, LandParcelDS> = {
  hadapsar_01: {
    id: "hadapsar_01",
    name: "Hadapsar Peri-Urban",
    coordinates: [18.4966, 73.9416],
    outerBoundary: [
      [18.5150, 73.9180], 
      [18.5150, 73.9550], 
      [18.4750, 73.9550], 
      [18.4750, 73.9180]
    ],
    agriClusters: [
      [[18.4900, 73.9420], [18.4850, 73.9500], [18.4780, 73.9450], [18.4820, 73.9350]]
    ],
    plantations: [
      [[18.5100, 73.9220], [18.5130, 73.9300], [18.5050, 73.9350], [18.5010, 73.9250]]
    ],
    builtUpClusters: [
      // Original center-left built-up cluster
      [[18.5000, 73.9280], [18.5050, 73.9480], [18.4880, 73.9480], [18.4880, 73.9280]],
      [[18.4850, 73.9220], [18.4880, 73.9350], [18.4780, 73.9350], [18.4780, 73.9220]],
      // New built-up polygon added where circled on the right
      [[18.5020, 73.9420], [18.5060, 73.9480], [18.4940, 73.9480], [18.4940, 73.9420]]
    ],
    waterBodies: [
      [[18.5120, 73.9320], [18.5100, 73.9420], [18.5080, 73.9400], [18.5090, 73.9320]]
    ],
    areaHectares: 145.2,
    currentZoning: "Built-Up",
    historicalData: { useIn2015: "Agriculture", useIn2020: "Mixed-Use", groundwaterDepletion: "-2.4m" },
    riskFactors: { floodRisk: "Medium", soilEncroachment: true },
    landUse: [
      { name: 'Buildings (Built-up)', value: 60, color: '#EF4444' },
      { name: 'Forestry & Trees', value: 15, color: '#059669' },
      { name: 'Agriculture', value: 15, color: '#10B981' },
      { name: 'Water Sources', value: 10, color: '#3B82F6' }
    ],
    color: "#EF4444"
  },
  lohegaon_02: {
    id: "lohegaon_02",
    name: "Lohegaon Sector",
    coordinates: [18.6053, 73.9359],
    outerBoundary: [
      [18.6250, 73.9150], 
      [18.6250, 73.9550], 
      [18.5850, 73.9550], 
      [18.5850, 73.9150]
    ],
    agriClusters: [
      [[18.6150, 73.9250], [18.6100, 73.9400], [18.6000, 73.9350], [18.6050, 73.9200]]
    ],
    plantations: [
      [[18.6200, 73.9220], [18.6230, 73.9320], [18.6160, 73.9360], [18.6120, 73.9260]]
    ],
    builtUpClusters: [
      [[18.6120, 73.9300], [18.6150, 73.9480], [18.5950, 73.9480], [18.5950, 73.9300]]
    ],
    waterBodies: [
      [[18.6020, 73.9250], [18.6000, 73.9320], [18.5980, 73.9300], [18.5990, 73.9240]]
    ],
    areaHectares: 120.0,
    currentZoning: "Agriculture",
    historicalData: { useIn2015: "Forest/Scrub", useIn2020: "Agriculture", groundwaterDepletion: "-0.8m" },
    riskFactors: { floodRisk: "Low", soilEncroachment: false },
    landUse: [
      { name: 'Agriculture', value: 50, color: '#10B981' },
      { name: 'Forestry & Trees', value: 25, color: '#059669' },
      { name: 'Buildings (Built-up)', value: 15, color: '#EF4444' },
      { name: 'Water Sources', value: 10, color: '#3B82F6' }
    ],
    color: "#10B981"
  }
};

export const AI_RESPONSES: Record<string, any> = {
  "flood": { text: "Recent flood analytics highlight high vulnerability around restricted drainage zones due to elevated concrete density." },
  "agri": { text: "Agricultural conversion metrics show accelerated shift toward urban spaces over the last decade." }
};

export const YEAR_TIMELINE: Record<number, { agri: number; trees: number; built: number; water: number }> = {
  2015: { agri: 50, trees: 25, built: 15, water: 10 },
  2020: { agri: 35, trees: 20, built: 35, water: 10 },
  2025: { agri: 20, trees: 15, built: 55, water: 10 }
};