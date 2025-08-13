import { useState, useEffect, useMemo } from 'react';

/**
 * @description Custom hook for managing book data, including fetching, searching, and filtering.
 * This encapsulates the business logic away from the UI components.
 * @returns {object} An object containing the search query, a function to set it, and the list of filtered books.
 */
export function useBooks(searchType) {
  // State to hold the complete list of books
  const [books, setBooks] = useState([]);

  // State for the current search query input by the user
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery === '') {
      setBooks([]);
      return;
    }

    const fetchBooks = async () => {
      setLoading(true);
      try {
        let url = 'https://gutendex.com/books';
        if (searchType === 'genre') {
          url = `https://gutendex.com/books?topic=${searchQuery}`;
        } else {
          url = `https://gutendex.com/books?search=${encodeURIComponent(searchQuery)}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        const formattedBooks = data.results.map(book => ({
          title: book.title,
          author: book.authors.map(a => a.name).join(', '),
          year: book.authors.length > 0 ? book.authors[0].birth_year : null,
          pdfUrl: book.formats['application/pdf'] || book.formats['text/plain'],
        }));
        setBooks(formattedBooks);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchBooks();
    }, 500); // Debounce API calls

    return () => clearTimeout(debounceFetch);
  }, [searchQuery, searchType]);

  // Expose the necessary state and functions to the component using this hook.
  return { searchQuery, setSearchQuery, filteredBooks: books, loading };
}
