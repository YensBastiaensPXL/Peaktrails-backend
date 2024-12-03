"use client";
import { useState } from "react";
import Image from "next/image";
import { parseGpxFile } from "@/lib/gpxConverter";

const CreateRoute = () => {
  const [distance, setDistance] = useState<number | null>(null);
  const [ascent, setAscent] = useState<number | null>(null);
  const [descent, setDescent] = useState<number | null>(null);
  const [gpxData, setGpxData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<any[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]); // State for photo previews

  // Handle GPX file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const text = await file.text();
      const { totalDistance, totalAscent, totalDescent, coordinates } =
        await parseGpxFile(text);
      setDistance(totalDistance);
      setAscent(totalAscent);
      setDescent(totalDescent);
      setGpxData({ totalDistance, totalAscent, totalDescent, coordinates });
      setFile(file); // Save the GPX file to submit later
    }
  };

  // Handle multiple photo uploads
  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []); // Get all selected files
    setPhotoFiles(files); // Save the files to submit later

    // Read files and convert to Base64 for immediate preview
    const previews = await Promise.all(
      files.map((file) => convertToBase64(file))
    );
    setPhotoPreviews(previews); // Update the previews state
  };

  // Helper function to convert file to Base64
  const convertToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (gpxData && file && photoFiles.length > 0) {
      try {
        const formData = new FormData();
        formData.append("gpxFile", file);
        formData.append("distance", Number(gpxData.totalDistance).toFixed(1));
        formData.append("ascent", gpxData.totalAscent.toFixed(1));
        formData.append("descent", gpxData.totalDescent.toFixed(1));
        formData.append("name", name);
        formData.append("difficulty", difficulty);
        formData.append("description", description);
        formData.append("location", location);

        // Upload GPX file
        const gpxResponse = await fetch(
          "https://localhost:7063/api/Trails/upload-gpx",
          {
            method: "POST",
            body: formData,
          }
        );

        if (gpxResponse.ok) {
          const gpxResult = await gpxResponse.json();
          const trailId = gpxResult.trailId;

          // Upload multiple photos
          const photoFormData = new FormData();
          photoFiles.forEach((photoFile) => {
            photoFormData.append("files", photoFile); // Append each photo
          });
          photoFormData.append("description", description);

          const photoResponse = await fetch(
            `https://localhost:7063/api/photos/${trailId}/upload`,
            {
              method: "POST",
              body: photoFormData,
            }
          );

          if (photoResponse.ok) {
            const photoResult = await photoResponse.json();
            console.log("Photos successfully uploaded:", photoResult);
            fetchPhotosByTrailId(trailId); // Fetch photos for the uploaded trail
          } else {
            console.error(
              "Failed to upload photos:",
              await photoResponse.text()
            );
          }
        } else {
          console.error("Failed to upload GPX data:", await gpxResponse.text());
        }
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    } else {
      console.log("GPX data or photos are missing.");
    }
  };

  // Fetch photos by TrailId
  const fetchPhotosByTrailId = async (trailId: number) => {
    try {
      const response = await fetch(
        `https://localhost:7063/api/photos/trail/${trailId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch photos.");
      }
      const photos = await response.json();
      setUploadedPhotos(photos); // Update the state with fetched photos
      console.log("Fetched photos for trail ID", trailId, photos);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <h1>Upload GPX File & Photos</h1>
      <input type="file" accept=".gpx" onChange={handleFileUpload} />
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoUpload}
      />
      <input
        type="text"
        placeholder="Trail Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="">Select Difficulty</option>
        <option value="easy">Easy</option>
        <option value="moderate">Moderate</option>
        <option value="hard">Hard</option>
      </select>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      {distance && <p>Total Distance: {distance} km</p>}
      {ascent && <p>Total Ascent: {ascent} m</p>}
      {descent && <p>Total Descent: {descent} m</p>}
      <button
        onClick={handleSubmit}
        className="bg-[darkgreen] w-[8rem] text-white p-2 rounded-md mt-4"
      >
        Upload
      </button>

      {/* Display uploaded photos immediately */}
      {photoPreviews.length > 0 && (
        <div>
          <h2>Selected Photos</h2>
          <div className="grid grid-cols-3 gap-[1rem]">
            {photoPreviews.map((preview, index) => (
              <div key={index} className="flex flex-col items-center">
                <Image
                  src={preview} // Use Base64 string as src
                  alt={`Preview ${index}`}
                  width={200} // Set desired width
                  height={200} // Set desired height
                  className="object-cover"
                />
                <p>{`Photo ${index + 1}`}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRoute;
