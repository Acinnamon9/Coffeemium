"use client";
import { useEffect, useState } from "react";

type Props = {
  initialQuery?: string;
  onSearch: (q: string) => void;
};

export default function SearchBar({ initialQuery = "", onSearch }: Props) {
  const [value, setValue] = useState(initialQuery);

  useEffect(() => {
    const id = setTimeout(() => onSearch(value), 250);
    return () => clearTimeout(id);
  }, [value, onSearch]);

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type="text"
      placeholder="Search for coffees..."
      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    />
  );
}
