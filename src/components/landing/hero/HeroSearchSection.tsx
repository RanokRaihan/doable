"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const HeroSearchSection = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tasks?searchTerm=${encodeURIComponent(searchQuery)}`);
    }
  };
  return (
    <form
      onSubmit={handleSearch}
      className="relative max-w-lg mx-auto lg:mx-0 mb-10 group"
    >
      <div className="absolute -inset-1 bg-linear-to-r from-blue-400 to-purple-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
      <div className="relative flex items-center bg-white border border-gray-200 shadow-xl rounded-full p-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-400 ml-2 md:ml-4 shrink-0" />
        <input
          type="text"
          placeholder="What do you need help with?"
          className="flex-1 px-2 md:px-4 py-2 md:py-3 outline-none text-sm md:text-lg text-gray-700 bg-transparent placeholder-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 md:px-8 py-2 md:py-3.5 rounded-full font-medium text-sm md:text-base transition-all shadow-md hover:shadow-lg shrink-0"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default HeroSearchSection;
