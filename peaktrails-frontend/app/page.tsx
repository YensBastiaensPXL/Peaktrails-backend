"use client"; // This ensures that the component runs on the client side
import { Input } from "@/components/ui/input";
import Nav from "@/components/ui/Nav";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Trail {
  trailId: number;
  name: string;
  location: string;
  length: number;
  difficulty: string;
  image: string; // This will hold the Base64 image data
}

const Home = () => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = "https://localhost:7063/api/Trails";

  const fetchTrails = async () => {
    setLoading(true);
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
            console.error("Failed to fetch photo for TrailId:", trail.trailId);
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

  useEffect(() => {
    fetchTrails();
  }, [apiUrl]); // Re-run when apiUrl changes

  return (
    <section className="relative w-full">
      {/* Navigation */}
      <Nav />

      {/* Banner Section */}
      <section
        className="relative bg-cover bg-top h-[30rem] flex flex-col justify-center items-center"
        style={{ backgroundImage: "url('/images/banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <h1 className="text-white text-4xl font-bold mb-6 z-10">
          Explore trails!
        </h1>
        <Input className="flex items-center z-10" />
      </section>

      {/* Featured Trails Section */}
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
              <h3 className="mt-2 text-lg font-semibold">{trail.name}</h3>
              <p className="text-gray-600">{trail.location}</p>
              <div className="flex">
                <div className="">{trail.difficulty}</div>
                <span className="px-[0.2rem]">·</span>
                <div>{trail.length}km</div>
              
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default Home;
