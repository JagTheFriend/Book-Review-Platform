
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Book {
  id: string;
  name: string;
  description: string;
  author: string;
  tags: string[];
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BookContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  favoriteBooks: string[];
  toggleFavorite: (bookId: string) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name');
  const [favoriteBooks, setFavoriteBooks] = useState<string[]>([]);

  const toggleFavorite = (bookId: string) => {
    setFavoriteBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  return (
    <BookContext.Provider value={{
      searchQuery,
      setSearchQuery,
      selectedTags,
      setSelectedTags,
      sortBy,
      setSortBy,
      favoriteBooks,
      toggleFavorite,
    }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBookContext must be used within a BookProvider');
  }
  return context;
};

export type { Book };
