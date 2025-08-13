import { useState, useEffect, useMemo } from 'react';
import bookData from '../data/books.json';

/**
 * @description Custom hook for managing book data, including fetching, searching, and filtering.
 * This encapsulates the business logic away from the UI components.
 * @returns {object} An object containing the search query, a function to set it, and the list of filtered books.
 */
export function useBooks() {
  // State to hold the complete list of books
  const [books, setBooks] = useState([]);

  // State for the current search query input by the user
  const [searchQuery, setSearchQuery] = useState('');

  // Effect to load the initial book data from the JSON file on component mount.
  // This simulates an asynchronous data fetch.
  useEffect(() => {
    setBooks(bookData);
  }, []); // The empty dependency array ensures this runs only once.

  // Memoized filtering logic.
  // `useMemo` prevents re-calculating the filtered list on every render,
  // running only when the `books` list or the `searchQuery` changes.
  const filteredBooks = useMemo(() => {
    // If the search query is empty, return the full list of books.
    if (!searchQuery) {
      return books;
    }

    // Normalize the search query to lower case for case-insensitive matching.
    const lowercasedQuery = searchQuery.toLowerCase();

    // Filter the books array based on the query.
    // A book is included if its title or author's name includes the query string.
    return books.filter(book =>
      book.title.toLowerCase().includes(lowercasedQuery) ||
      book.author.toLowerCase().includes(lowercasedQuery)
    );
  }, [books, searchQuery]); // Dependencies for the memoization

  // Expose the necessary state and functions to the component using this hook.
  return { searchQuery, setSearchQuery, filteredBooks };
}
