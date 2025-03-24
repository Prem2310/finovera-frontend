import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);

  // Fetch access token from localStorage when component mounts
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setSelectedFileName(selectedFile ? selectedFile.name : "");
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
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
      const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
      const response = await axios.post(
        `${apiBaseUrl}stocksCRUD/upload_csv`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("File uploaded successfully!");
      console.log(response.data);
      setSelectedFileName("");
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed!");
    }
  };

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".csv,.xlsx"
      />

      <div className="flex flex-col items-center w-full max-w-md">
        {/* Styled button to trigger file selection */}
        <button
          onClick={triggerFileInput}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg w-full flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
          Choose CSV File
        </button>

        {/* Display selected file name */}
        {selectedFileName && (
          <div className="mt-2 text-sm text-gray-600">
            Selected: {selectedFileName}
          </div>
        )}
      </div>

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!file}
        className={`py-2 px-6 rounded-lg font-medium ${
          file
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Upload File
      </button>
    </div>
  );
};

export default UploadCSV;
