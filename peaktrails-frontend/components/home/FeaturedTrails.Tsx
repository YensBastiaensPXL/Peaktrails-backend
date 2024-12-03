// FeaturedTrails.tsx
import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";

interface Trail {
  trailId: number;
  name: string;
  description: string;
  image: string; // This will hold the Base64 image data
}

interface FeaturedTrailsProps {
  apiUrl: string; // URL for fetching trails
}

const FeaturedTrails: React.FC<FeaturedTrailsProps> = ({ apiUrl }) => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const trailResponse = await fetch(apiUrl);
        if (!trailResponse.ok) {
          throw new Error("Failed to fetch trails");
        }
        const trailsData = await trailResponse.json();

        const trailsWithPhotos = await Promise.all(
          trailsData.map(async (trail: Trail) => {
            const photoResponse = await fetch(
              `https://localhost:7063/api/Photos/trail/${trail.trailId}`
            );
            let image = ""; // Default value for image

            if (photoResponse.ok) {
              const photoData = await photoResponse.json();
              if (photoData && photoData.length > 0 && photoData[0].photoData) {
                image = `data:image/jpeg;base64,${photoData[0].photoData}`;
              } else {
                console.error(
                  "No valid photo data found for TrailId:",
                  trail.trailId
                );
              }
            } else {
              console.error(
                "Failed to fetch photo for TrailId:",
                trail.trailId
              );
            }

            return { ...trail, image }; // Combine trail and its photo
          })
        );

        setTrails(trailsWithPhotos); // Store the trails with images
      } catch (error) {
        setError(error.message); // Handle error
      } finally {
        setLoading(false); // Set loading state
      }
    };

    fetchTrails();
  }, [apiUrl]); // Re-run when apiUrl changes

  return (
    <section className="relative px-[6.5rem] py-[2rem] bg-white">
      <h2 className="text-2xl font-bold mb-4">Featured Trails</h2>

      {/* Loading State */}
      {loading && <p>Loading trails...</p>}

      {/* Error State */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display Trails */}
      <div className="flex gap-[1rem]">
        {trails.map((trail) => (
          <div
            key={trail.trailId}
            className="bg-gray-100 p-4 rounded-lg shadow-md"
          >
            <Image
              src={trail.image || "/path/to/placeholder.jpg"} // Use a placeholder if image is undefined
              alt={trail.name}
              width={200}
              height={200}
              className="object-cover rounded-md"
            />
            <h3 className="mt-2 text-lg font-bold">{trail.name}</h3>
            <p className="text-gray-600">{trail.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedTrails;
