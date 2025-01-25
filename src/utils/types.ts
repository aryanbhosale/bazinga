export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    propertyType: string; // e.g. "Residential", "Condo", "Townhome"
    forRent: boolean;     // or forSale
    lat: number;
    lng: number;
    imageUrl: string;
    createdAt: number;    // store timestamp to handle newest/oldest sorting
  }
  