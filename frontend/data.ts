/**
 * @file data.ts
 * @description
 * This file contains dummy data for the application, converted from JSON.
 * It includes type interfaces for data models and the data itself.
 * All snake_case keys have been converted to camelCase for idiomatic TypeScript/JavaScript usage.
 */

// -------------------
// TYPE DEFINITIONS
// -------------------

export interface RetailPartner {
  id: number;
  merchandiser: string;
  store: string;
  location: string;
}

export interface User {
  id: number;
  name: string;
  passwordHash: string;
  role: 'admin' | 'merchandiser';
  retailPartnerId: number | null;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  unitCostPrice: number;
  unitPrice: number;
}

export interface InventoryItem {
  retailPartnerId: number;
  storeName: string;
  totalQuantity: number;
  totalValue: number;
}

export interface InventoryDetail {
  productId: number;
  productName: string;
  category: string;
  quantity: number;
  unitSellingPrice: number;
  totalValue: number;
}

export interface StoreInventory {
  retailPartnerId: number;
  storeName: string;
  products: InventoryDetail[];
}
export interface DailySalesReport {
  Salesid: number;
  data:DailySalesItem[];
  merchandiserId: number;
  retailPartnerId: number;
  totalQuantity: number;
  totalSales: number;
  finalValue: number;
  reportDate: string; // ISO date string: "YYYY-MM-DD"
  status: 'submitted' | 'pending' | 'approved';
  notes: string;
  submittedAt: string; // ISO date-time string
}

export interface DailySalesItem {
  productId: number;
  productName: string;
  quantitySold: number;
  salesPrice: number;
  discountPercent: number;
  finalPrice: number;
}


// -------------------
// DUMMY DATA
// -------------------

export const retailPartners: RetailPartner[] = [
  {
    id: 1,
    merchandiser: 'Adil Omar',
    store: 'Safari',
    location: 'Abu Hamour',
  },
  {
    id: 2,
    merchandiser: 'Adnan Omar',
    store: 'LULU',
    location: 'Gharaffa',
  },
  {
    id: 3,
    merchandiser: 'Zaid Khalid',
    store: 'Paris Hypermarket',
    location: 'Wakra',
  },
  {
    id: 4,
    merchandiser: 'Safwan Khalid',
    store: 'Grand Mall',
    location: 'Industrial Area',
  },
  {
    id: 5,
    merchandiser: 'Muhammed Khalid',
    store: 'Safari',
    location: 'Al Khor',
  },
];

const users: User[] = [
  {
    id: 1,
    name: 'Admin User',
    passwordHash: 'hashed_pw_admin',
    role: 'admin',
    retailPartnerId: null,
  },
  {
    id: 2,
    name: 'Ravi Merchandiser',
    passwordHash: 'hashed_pw_ravi',
    role: 'merchandiser',
    retailPartnerId: 1,
  },
];

const products: Product[] = [
  {
    id: 1,
    name: 'Earphones',
    category: 'Audio',
    unitCostPrice: 150.0,
    unitPrice: 200.0,
  },
  {
    id: 2,
    name: 'Powerbank 10000mAh',
    category: 'Battery',
    unitCostPrice: 400.0,
    unitPrice: 600.0,
  },
  {
    id: 3,
    name: 'Wireless Earbuds',
    category: 'Audio',
    unitCostPrice: 500.0,
    unitPrice: 750.0,
  },
];

export const inventories: InventoryItem[] = [
  {
    retailPartnerId: 1,
    storeName: "Downtown Tech Store",
    totalQuantity: 180,
    totalValue: 75100,
  },
  {
    retailPartnerId: 2,
    storeName: "Gadget Hub",
    totalQuantity: 90,
    totalValue: 19350,
  },
];

export const InventoryDetailsByStore: StoreInventory[] = [
  {
    retailPartnerId: 1,
    storeName: "Downtown Tech Store",
    products: [
      {
        productId: 1,
        productName: "Earphones",
        category: "Audio",
        quantity: 100,
        unitSellingPrice: 210,
        totalValue: 100 * 210,
      },
      {
        productId: 2,
        productName: "Powerbank 10000mAh",
        category: "Battery",
        quantity: 50,
        unitSellingPrice: 620,
        totalValue: 50 * 620,
      },
      {
        productId: 3,
        productName: "Wireless Earbuds",
        category: "Audio",
        quantity: 30,
        unitSellingPrice: 770,
        totalValue: 30 * 770,
      },
    ],
  },
  {
    retailPartnerId: 2,
    storeName: "Gadget Hub",
    products: [
      {
        productId: 1,
        productName: "Earphones",
        category: "Audio",
        quantity: 90,
        unitSellingPrice: 215,
        totalValue: 90 * 215,
      },
    ],
  },
];

export const dailySalesReports: DailySalesReport[] = [
  {
    Salesid: 1,
    data:[
      {
        productId: 1,
        productName: 'Zantek Speaker',
        quantitySold: 10,
        salesPrice: 190.0,
        discountPercent: 0,
        finalPrice: 190.00
      },
      {
        productId: 2,
        productName: 'Projector',
        quantitySold: 5,
        salesPrice: 580.0,
        discountPercent: 6.45,
        finalPrice: 542.69
      },
    ],
    merchandiserId: 2,
    retailPartnerId: 1,
    totalQuantity: 15,
    totalSales: 770.00,
    finalValue: 732.59,
    reportDate: '2025-06-20',
    status: 'submitted',
    notes: 'Sold well today.',
    submittedAt: '2025-06-20T19:00:00Z',
  },
];

// const dailySalesItems: DailySalesItem[] = [
//   {
//     reportId: 1,
//     productId: 1,
//     quantitySold: 10,
//     unitPrice: 190.0,
//     discountPercent: 9.52,
//   },
//   {
//     reportId: 1,
//     productId: 2,
//     quantitySold: 5,
//     unitPrice: 580.0,
//     discountPercent: 6.45,
//   },
// ];


// -------------------
// MAIN EXPORT
// -------------------

export const dummyData = {
  retailPartners,
  users,
  products,
  inventories,
  dailySalesReports,
};


/*
// -------------------
// HOW TO USE IN REACT
// -------------------

// In your React component file (e.g., Dashboard.tsx):

import React from 'react';
import { dummyData, type Product } from './data'; // Import data and types

const ProductList: React.FC = () => {
  const products: Product[] = dummyData.products;

  return (
    <div>
      <h1>Our Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.unitPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;

*/