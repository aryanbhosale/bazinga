"use client";

import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { Property } from "../utils/types";

export default function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener
  useEffect(() => {
    const colRef = collection(db, "properties");
    // For an initial default sort, say by creation time descending
    const q = query(colRef, orderBy("createdAt", "desc"));

    // onSnapshot will automatically update 'properties' whenever Firestore changes
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Property[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            title: d.title,
            description: d.description,
            price: d.price,
            bedrooms: d.bedrooms,
            bathrooms: d.bathrooms,
            squareFeet: d.squareFeet,
            propertyType: d.propertyType,
            forRent: d.forRent,
            lat: d.lat,
            lng: d.lng,
            imageUrl: d.imageUrl,
            createdAt: d.createdAt || 0,
            address: d.address || "",
          };
        });
        setProperties(data);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore onSnapshot error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addProperty = async (newProp: Omit<Property, "id" | "createdAt">) => {
    const toAdd = {
      ...newProp,
      createdAt: Date.now(),
    };
    await addDoc(collection(db, "properties"), toAdd);
  };

  const updateProperty = async (id: string, updated: Partial<Property>) => {
    await updateDoc(doc(db, "properties", id), updated);
  };

  return { properties, loading, addProperty, updateProperty };
}
