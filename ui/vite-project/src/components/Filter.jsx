import React from "react";

function Filter({search, handleSearch}) {
  return (
    <div>
      search: <input value={search} onChange={handleSearch} />
    </div>
  );
}

export default Filter;
