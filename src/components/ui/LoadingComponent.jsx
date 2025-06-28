import React from "react";

const LoadingComponent = () => {
  return (
    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading users...</p>
    </div>
  );
};

export default LoadingComponent;
