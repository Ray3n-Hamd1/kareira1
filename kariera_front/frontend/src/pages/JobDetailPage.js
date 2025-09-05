import React from "react";
import { useParams } from "react-router-dom";

export default function JobDetailPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold">Job Detail Page</h1>
      <p className="text-gray-400">Job ID: {id}</p>
      <p className="text-sm text-gray-500 mt-4">
        Job detail page will be implemented in Step 5
      </p>
    </div>
  );
}
