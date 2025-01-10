"use client";

import { useState, useEffect } from "react";

interface Location {
  id: number;
  name: string;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocation, setNewLocation] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");

  // Fetch locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocations();
  }, []);

  // Add new location
  const handleAddLocation = async () => {
    if (!newLocation.trim()) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: newLocation }),
      });

      if (!response.ok) {
        throw new Error("Failed to add location");
      }

      const addedLocation: Location = await response.json();
      setLocations([...locations, addedLocation]);
      setNewLocation("");
    } catch (error) {
      console.error(error);
    }
  };

  // Edit location
  const handleEditLocation = async (id: number) => {
    if (!editingName.trim()) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: editingName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update location");
      }

      const updatedLocation: Location = await response.json();
      setLocations(
        locations.map((loc) => (loc.id === id ? updatedLocation : loc))
      );
      setEditingId(null);
      setEditingName("");
    } catch (error) {
      console.error(error);
    }
  };

  // Delete location
  const handleDeleteLocation = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete location");
      }

      setLocations(locations.filter((loc) => loc.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Locations</h1>
      <div>
        <input
          type="text"
          placeholder="New location"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
        />
        <button onClick={handleAddLocation}>Add Location</button>
      </div>
      <ul>
        {locations.map((location) => (
          <li key={location.id}>
            {editingId === location.id ? (
              <div>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button onClick={() => handleEditLocation(location.id)}>
                  Save
                </button>
              </div>
            ) : (
              <div>
                {location.name}
                <button
                  onClick={() => {
                    setEditingId(location.id);
                    setEditingName(location.name);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteLocation(location.id)}>
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
