'use client'


import { useRouter } from 'next/navigation';
import React, { useState } from 'react';


const SearchBox: React.FC = () => {

   

  const [specialization, setSpecialization] = useState<string>('');
  const router=useRouter();

  const handleSearch = async () => {
    
    router.push(`/search-results?specialization=${encodeURIComponent(specialization)}`);
  };

  return (
    <div className="search-box">
      <input
        type="text"
        
        onChange={(e) => setSpecialization(e.target.value)}
        placeholder="Enter specialization"
        className="bg-white text-black border p-2 rounded-md"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded-md ml-2">
        Search
      </button>
    </div>
  );
};

export default SearchBox;
