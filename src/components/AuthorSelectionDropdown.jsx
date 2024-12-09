import React, { useEffect, useState } from "react";

const AuthorSelectionDropdown = ({
  authors,
  selectedAuthors,
  onToggleAuthor,
  onClose,
  onSelectAll,
  onClearAll,
  setLoading,
  onSubmit
}) => {
  const [tempSelectedAuthors, setTempSelectedAuthors] = useState(selectedAuthors);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".author-dropdown")) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleToggle = (author) => {
    setTempSelectedAuthors(prev => ({
      ...prev,
      [author]: !prev[author]
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    onToggleAuthor(tempSelectedAuthors);
    onClose();
  };

  const handleSelectAll = () => {
    const allSelected = Object.fromEntries(
      authors.map(author => [author, true])
    );
    setTempSelectedAuthors(allSelected);
  };

  const handleClearAll = () => {
    const allCleared = Object.fromEntries(
      authors.map(author => [author, false])
    );
    setTempSelectedAuthors(allCleared);
  };

  return (
    <div className="author-dropdown mt-1 top-full z-50 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="p-3 border-b">
        <div className="flex justify-between mb-2">
          <button
            onClick={handleClearAll}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear All
          </button>
          <button
            onClick={handleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Select All
          </button>
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {authors.map((author) => (
          <label
            key={author}
            className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={tempSelectedAuthors[author] || false}
              onChange={() => handleToggle(author)}
              className="mr-3"
            />
            <span className="text-sm">{author}</span>
          </label>
        ))}
      </div>
      <div className="p-3 border-t">
        <button
          onClick={handleSubmit}
          className="w-full py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AuthorSelectionDropdown