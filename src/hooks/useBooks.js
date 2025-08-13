import { useState, useCallback } from 'react';

// The base URL for the Gutendex API.
const API_URL = 'https://gutendex.com/books/';

/**
 * @description Custom hook for fetching book data from the Gutendex API.
 * This hook manages the state for the book list, loading status, and errors.
 * @returns {object} An object containing the list of books, loading state, error state,
 * and a function to trigger the book search.
 */
export function useBooks() {
  // State to hold the list of books fetched from the API.
  const [books, setBooks] = useState([]);
  // State to indicate if a fetch operation is in progress.
  const [isLoading, setIsLoading] = useState(false);
  // State to hold any error that occurs during the fetch.
  const [error, setError] = useState(null);

  /**
   * @description Fetches books from the Gutendex API based on a search query.
   * The query can search for authors, titles, or topics (genres).
   * @param {string} query - The search term.
   */
  const fetchBooks = useCallback(async (query) => {
    // If the query is empty, do not perform a search. Reset the state.
    if (!query) {
      setBooks([]);
      return;
    }

    // Set loading state to true and clear previous errors.
    setIsLoading(true);
    setError(null);

    try {
      // Construct the API URL with the search query.
      // The `search` parameter in Gutendex API searches across multiple fields.
      const url = `${API_URL}?search=${encodeURIComponent(query)}`;
      const response = await fetch(url);

      // Check if the network response was successful.
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // We map the API response to the data structure our components expect.
      const formattedBooks = data.results.map(book => ({
        id: book.id,
        title: book.title,
        author: book.authors.map(a => a.name).join(', ') || 'Unknown',
        year: book.authors[0]?.birth_year || 'N/A', // Approximate year
        // We use the Gutendex reader link as the main page URL.
        pageUrl: `https://www.gutenberg.org/ebooks/${book.id}`,
        // Find a direct PDF link if available in the formats.
        pdfUrl: book.formats['application/pdf'] || null,
        // Gutendex uses 'subjects' for genres. We'll take the first few.
        genres: book.subjects.slice(0, 3) || [],
      }));

      setBooks(formattedBooks);

    } catch (e) {
      // If an error occurs, update the error state.
      console.error("Failed to fetch books:", e);
      setError(e);
      setBooks([]); // Clear books on error
    } finally {
      // Set loading state to false once the operation is complete.
      setIsLoading(false);
    }
  }, []); // useCallback wraps the function to prevent re-creation on every render.

  // Expose the state and the fetch function to the components.
  return { books, isLoading, error, fetchBooks };
}
