import React, { useRef, useState } from "react";
import { GoSearch } from "react-icons/go";

const Search = ({ onSearch, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.length > 0) {
      const results = await onSearch(searchQuery);
      console.log(results);
      setSearchResults(results);
    }
  };

  const handleResultClick = (result) => {
    onSelect(result);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="w-48 sm:w-72 rounded-full flex items-center px-2 h-10 relative shadow-lg border-2 border-black">
      <form className="w-full" onSubmit={handleSearch}>
        <input
          type="text"
          name="search"
          value={searchQuery}
          placeholder="Search..."
          className="w-full focus:outline-none bg-white px-2 focus:bg-white selection:bg-white"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      <GoSearch size={28} onClick={handleSearch} />
      {searchResults.length > 0 && (
        <div className="w-72 absolute z-30 top-12 -mx-2 px-5 rounded-3xl p-2 backdrop-blur-lg bg-white/5 shadow-lg border-2 border-black">
          <ul>
            {searchResults.map((result, index) => (
              <li
                key={index}
                className="cursor-pointer hover:bg-white/10 p-3 hover:outline outline-1 outline-black rounded-full"
                onClick={() => handleResultClick(result)}
              >
                {result.name}, {result.state}, {result.country}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
