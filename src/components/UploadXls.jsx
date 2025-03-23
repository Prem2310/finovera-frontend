import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [accessToken, setAccessToken] = useState("");

  // Fetch access token from localStorage when component mounts
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !accessToken) {
      alert("Please select a file and ensure access token is available!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("access_token", accessToken);

    try {
      const response = await axios.post(
        "https://ingenium-hackathon-backend.onrender.com/stocksCRUD/upload_csv",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("File uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed!");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <Button
        type="primary"
        btnType="submit"
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Upload File
      </Button>
    </div>
  );
};

export default UploadCSV;
