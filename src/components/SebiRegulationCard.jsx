import React, { useState, useEffect } from "react";
import Button from "./Button";
import Modal from "./Modal";
import { HiOutlineSparkles } from "react-icons/hi";
import { useGetSebiRegulation } from "../hooks/mutations/useGetSebiRegulation";

// Helper function to convert markdown-style formatting to HTML
const formatSummaryText = (text) => {
  if (!text) return "";

  // Replace ** text ** with bold text
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Replace * text * with italic text
  formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Convert line breaks to <br>
  formattedText = formattedText.replace(/\n/g, "<br/>");

  return formattedText;
};

const SebiRegulationCard = ({ data }) => {
  const { refetch, isLoading, sebiRegulation } = useGetSebiRegulation(
    data.title
  );
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && sebiRegulation?.message) {
      setSummary(sebiRegulation.message);
      setLoadingSummary(false);
      setIsModalOpen(true);
    }
  }, [isLoading, sebiRegulation]);

  const handleVisitWebsite = () => {
    window.open(data.link, "_blank");
  };

  const handleGetSummary = async () => {
    setLoadingSummary(true);
    setSummary(null);

    const result = await refetch();
    const message = result?.data?.message;

    if (message) {
      setSummary(message);
      setIsModalOpen(true);
    }

    setLoadingSummary(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {data.title}
            </h2>
            <span className="bg-slate-100 text-slate-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Established: {data.year}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span>Last amended: February 10, 2025</span>
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleVisitWebsite} type="primary">
              View official document
            </Button>
            <Button
              onClick={handleGetSummary}
              type="primary"
              icon={<HiOutlineSparkles />}
              disabled={loadingSummary}
            >
              {loadingSummary ? "Extracting..." : "Get AI Summary"}
            </Button>
          </div>
        </div>
      </div>

      {/* Modified Modal with increased width */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">AI Summary: {data.title}</h3>

          {loadingSummary ? (
            <div className="text-center text-gray-500 py-4">
              Extracting summary from PDF...
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <div
                className="text-gray-700 text-sm font-normal"
                dangerouslySetInnerHTML={{ __html: formatSummaryText(summary) }}
              />
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={closeModal} type="primary">
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SebiRegulationCard;
