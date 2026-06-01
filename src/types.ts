/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Room {
  id: string;
  name: string;
  networkPoints: number; // For computers, printers, medical devices
  voipPoints: number; // For IP Phones
  apPoints: number; // Access Points (Wi-Fi)
  cctvPoints: number; // IP Cameras
  cablingType: string; // e.g. "Cat6A F/UTP"
  description: string;
}

export interface Building {
  id: string;
  name: string;
  purpose: string;
  rooms: Room[];
  rackModel: string;
  floorCount: number;
  description: string;
  coordinates: { x: number; y: number }; // For canvas visualization
}

export interface Equipment {
  id: string;
  name: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  category: 'active' | 'passive' | 'infra' | 'tools';
  specs: string;
}

export interface TeamMember {
  name: string;
  role: string;
  skills: string[];
  avatar: string;
  bio: string;
}

export interface CablingService {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  benefits: string[];
  specs: string[];
}
