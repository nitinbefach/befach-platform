// Tracking Library - Types, Mock Data, and Helper Functions

export type FreightType = 'sea' | 'air' | 'road' | 'rail' | 'express';
export type ShipmentStatus = 'pending' | 'processing' | 'in_transit' | 'customs' | 'out_for_delivery' | 'delivered' | 'delayed' | 'exception';
export type TimelineStatus = 'completed' | 'in_progress' | 'pending';

export interface Location {
  city: string;
  country: string;
  code?: string;
  address?: string;
}

export interface Package {
  count: number;
  type: string;
  weight?: string;
  dimensions?: string;
  hsCode?: string;
  contents?: string;
}

export interface Contact {
  name: string;
  company?: string;
  address: string;
  phone?: string;
  email?: string;
}

export interface TimelineEvent {
  id: string;
  status: TimelineStatus;
  title: string;
  description?: string;
  location?: string;
  date?: string;
  time?: string;
  substages?: TimelineEvent[];
}

export interface ShipmentDocument {
  id: string;
  name: string;
  type: string;
  url?: string;
  uploadedAt?: string;
}

export interface ShipmentAlert {
  type: 'info' | 'warning' | 'error';
  message: string;
}

export interface ShipmentTracking {
  shipmentNumber: string;
  status: ShipmentStatus;
  currentStatus: string;
  progress: number;
  freightType: FreightType;
  origin: Location;
  destination: Location;
  carrier?: string;
  lastUpdated: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  daysFromPickup?: number;
  alerts?: ShipmentAlert[];
  packages: Package;
  timeline: TimelineEvent[];
  contacts: {
    shipper: Contact;
    buyer: Contact;
  };
  documents: ShipmentDocument[];
}

// Mock shipment data matching the screenshots
export const mockShipmentData: ShipmentTracking = {
  shipmentNumber: '#0037',
  status: 'in_transit',
  currentStatus: 'In Transit to India',
  progress: 56,
  freightType: 'sea',
  origin: {
    city: 'ZHUOZHOU',
    country: 'china'
  },
  destination: {
    city: 'Banglore',
    country: 'india'
  },
  carrier: 'Sea Freight',
  lastUpdated: 'Oct 27, 2025, 01:26 PM',
  estimatedDelivery: 'Wednesday, October 15, 2025',
  daysFromPickup: 45,
  alerts: [
    {
      type: 'info',
      message: 'The shipment has been delayed due to unfavorable ocean weather conditions'
    }
  ],
  packages: {
    count: 1,
    type: 'Standard',
    weight: 'N/A',
    dimensions: 'N/A',
    hsCode: '25081090',
    contents: 'Package Contents'
  },
  timeline: [
    {
      id: '1',
      status: 'completed',
      title: 'Product Insurance',
      description: 'Monday, 27/10/25',
      location: 'SHENZHEN CN'
    },
    {
      id: '2',
      status: 'completed',
      title: 'Supplier Payment',
      description: 'Tuesday, 28/10/25',
      location: 'HONG KONG CN'
    },
    {
      id: '3',
      status: 'completed',
      title: 'Packaging Approval from Customer',
      description: 'Wednesday, 29/10/25',
      location: 'DELHI IN'
    },
    {
      id: '4',
      status: 'completed',
      title: 'Pickup at Origin',
      description: 'Thursday, 30/10/25',
      location: 'SHENZHEN CN'
    },
    {
      id: '5',
      status: 'completed',
      title: 'In Transit to India',
      description: '(15 sub-stages)',
      substages: [
        {
          id: '5-1',
          status: 'completed',
          title: 'Shipment information received by Befach'
        },
        {
          id: '5-2',
          status: 'completed',
          title: 'Picked up from supplier warehouse'
        },
        {
          id: '5-3',
          status: 'completed',
          title: 'Package received at Befach export facility'
        },
        {
          id: '5-4',
          status: 'completed',
          title: 'Customs export clearance submitted'
        },
        {
          id: '5-5',
          status: 'completed',
          title: 'Export clearance completed'
        },
        {
          id: '5-6',
          status: 'completed',
          title: 'Departed from Shenzhen International Airport'
        },
        {
          id: '5-7',
          status: 'completed',
          title: 'Arrived at transit hub'
        },
        {
          id: '5-8',
          status: 'completed',
          title: 'Departed transit hub'
        },
        {
          id: '5-9',
          status: 'completed',
          title: 'Arrived at port of entry'
        },
        {
          id: '5-10',
          status: 'completed',
          title: 'Document verification initiated (Customs)'
        },
        {
          id: '5-11',
          status: 'completed',
          title: 'Import duty & GST assessment under process'
        },
        {
          id: '5-12',
          status: 'completed',
          title: 'Customs inspection & clearance completed'
        },
        {
          id: '5-13',
          status: 'completed',
          title: 'Handed over to Befach local delivery hub'
        },
        {
          id: '5-14',
          status: 'completed',
          title: 'Out for delivery'
        },
        {
          id: '5-15',
          status: 'in_progress',
          title: 'Delivered'
        }
      ]
    },
    {
      id: '6',
      status: 'pending',
      title: 'Customs Clearance'
    },
    {
      id: '7',
      status: 'pending',
      title: 'Dispatch to Befach Warehouse'
    },
    {
      id: '8',
      status: 'pending',
      title: 'Dispatch to Customer Warehouse'
    },
    {
      id: '9',
      status: 'pending',
      title: 'Estimated Delivery'
    }
  ],
  contacts: {
    shipper: {
      name: 'Haisen pet',
      address: 'NO.33 GUANYUN EAST ROAD,DEVELOPMENT ZONE, ZHUOZHOU CITY,HEBEI PROVINCE,CHINA 072750',
      company: 'Haisen pet'
    },
    buyer: {
      name: 'Nutrawet wellness',
      address: '53/1,JAYARAYAN DODDI ROAD, SHARADAMBA SCHOOL ROAD, R. R. NAGAR, BENGALURU 560098',
      company: 'Nutrawet wellness'
    }
  },
  documents: []
};

// Helper functions
export function getStatusColor(status: ShipmentStatus): string {
  const colors: Record<ShipmentStatus, string> = {
    pending: '#6B7280',
    processing: '#F59E0B',
    in_transit: '#3B82F6',
    customs: '#8B5CF6',
    out_for_delivery: '#10B981',
    delivered: '#10B981',
    delayed: '#EF4444',
    exception: '#EF4444'
  };
  return colors[status] || '#6B7280';
}

export function getTimelineStatusIcon(status: TimelineStatus): string {
  switch (status) {
    case 'completed':
      return '✓';
    case 'in_progress':
      return '●';
    case 'pending':
      return '○';
    default:
      return '○';
  }
}

export function getTimelineStatusColor(status: TimelineStatus): string {
  switch (status) {
    case 'completed':
      return '#10B981';
    case 'in_progress':
      return '#8B5CF6';
    case 'pending':
      return '#D1D5DB';
    default:
      return '#D1D5DB';
  }
}

export function formatShipmentNumber(number: string): string {
  if (number.startsWith('#')) return number;
  return `#${number}`;
}

export function calculateEstimatedDays(pickupDate: string, deliveryDate: string): number {
  const pickup = new Date(pickupDate);
  const delivery = new Date(deliveryDate);
  const diffTime = Math.abs(delivery.getTime() - pickup.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Mock function to simulate tracking API call
export async function trackShipment(trackingNumber: string): Promise<ShipmentTracking | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // For demo, return mock data for specific tracking numbers
  const validNumbers = ['0037', '#0037', 'BEFACH0037', 'BEF0037'];

  if (validNumbers.includes(trackingNumber.toUpperCase()) || validNumbers.includes('#' + trackingNumber)) {
    return mockShipmentData;
  }

  // Return null for invalid tracking numbers
  return null;
}

// Format date for display
export function formatDate(date: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(date).toLocaleDateString('en-US', options);
}

// Format last updated time
export function formatLastUpdated(dateTime: string): string {
  const date = new Date(dateTime);
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return `${dateStr}, ${timeStr}`;
}

export default {
  mockShipmentData,
  trackShipment,
  getStatusColor,
  getTimelineStatusIcon,
  getTimelineStatusColor,
  formatShipmentNumber,
  calculateEstimatedDays,
  formatDate,
  formatLastUpdated
};