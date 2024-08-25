import React, { useState } from "react";
import { Search } from "lucide-react";

const AuthorSelectionDropdown = ({
  authors,
  selectedAuthors,
  onToggleAuthor,
  onClose,
  onClearFilters,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAuthors = authors.filter((author) =>
    author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute left-40 top-10 z-10 mt-2 w-72 bg-white rounded-md border-gray-300 border shadow-lg">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Twitter Accounts</h2>
        </div>
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search here"
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filteredAuthors.map((author) => (
            <div key={author} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={author}
                checked={selectedAuthors[author]}
                onChange={() => onToggleAuthor(author)}
                className="mr-2"
              />
              <label htmlFor={author} className="flex-grow">
                {author}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorSelectionDropdown;