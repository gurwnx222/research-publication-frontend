import React from "react";
import UserCard from "./UserCard";
import LoadingComponent from "./LoadingComponent";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";

const UsersGrid = ({
  users,
  loading,
  searchTerm,
  pagination,
  onDelete,
  onPageChange,
  onCreateUser,
}) => {
  if (loading) {
    return <LoadingComponent />;
  }

  if (users.length === 0) {
    return <EmptyState searchTerm={searchTerm} onCreateUser={onCreateUser} />;
  }
  const BASE_URL = "https://research-publication.onrender.com/api";

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-6">
        {users.map((user) => (
          <UserCard key={user._id} user={user} onDelete={onDelete} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
        />
      )}
    </>
  );
};

export default UsersGrid;
