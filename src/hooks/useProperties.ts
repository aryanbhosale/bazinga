"use client"; // so we can use it in client components

import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { Property } from "../utils/types";

export default function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const collectionRef = collection(db, "properties");

  const fetchProperties = async () => {
    setLoading(true);
    const q = query(collectionRef, orderBy("createdAt", "desc")); 
    // By default, fetch in "newest" order initially
    console.log("HIIIIIIIIIIIIII")
    const snapshot = await getDocs(q);
    const data: Property[] = snapshot.docs.map((d) => {
      const docData = d.data();
      return {
        id: d.id,
        title: docData.title,
        description: docData.description,
        price: docData.price,
        bedrooms: docData.bedrooms,
        bathrooms: docData.bathrooms,
        squareFeet: docData.squareFeet,
        propertyType: docData.propertyType,
        forRent: docData.forRent,
        lat: docData.lat,
        lng: docData.lng,
        imageUrl: docData.imageUrl,
        createdAt: docData.createdAt || 0,
      };
    });
    setProperties(data);
    setLoading(false);
  };

  const addProperty = async (newProp: Omit<Property, "id" | "createdAt">) => {
    const toAdd = {
      ...newProp,
      createdAt: Date.now(),
    };
    await addDoc(collectionRef, toAdd);
    await fetchProperties();
  };

  const updateProperty = async (id: string, updated: Partial<Property>) => {
    const ref = doc(db, "properties", id);
    // do not overwrite existing createdAt if not provided
    const finalData: Partial<Property> = {
      ...updated,
    };
    await updateDoc(ref, finalData);
    await fetchProperties();
  };

  // Load initial data
  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    properties,
    loading,
    addProperty,
    updateProperty,
    fetchProperties,
    setProperties,
  };
}
