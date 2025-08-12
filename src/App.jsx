import React, { useState, useEffect, useMemo } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';

import SearchBar from './SearchBar';
import BookList from './BookList';
import bookData from './data/books.json';

/**
 * App Component
 *
 * The main component of the application. It handles state management,
 * data fetching (simulated), and filtering logic.
 */
function App() {
  // State for the search query
  const [searchQuery, setSearchQuery] = useState('');

  // State for the list of books. We initialize it with the imported JSON data.
  const [books, setBooks] = useState([]);

  // On component mount, set the books from the imported JSON.
  // This simulates an async fetch.
  useEffect(() => {
    setBooks(bookData);
  }, []);

  // Event handler for the search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter the books based on the search query.
  // useMemo is used for performance optimization, so the filtering logic
  // only runs when the books or searchQuery change.
  const filteredBooks = useMemo(() => {
    if (!searchQuery) {
      return books;
    }
    return books.filter((book) => {
      const query = searchQuery.toLowerCase();
      const title = book.title.toLowerCase();
      const author = book.author.toLowerCase();
      return title.includes(query) || author.includes(query);
    });
  }, [books, searchQuery]);

  return (
    <>
      <CssBaseline />
      <Container>
        <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ marginTop: 4 }}>
          Biblioteca Pubblica per Bambini
        </Typography>

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        <BookList books={filteredBooks} />
      </Container>
    </>
  );
}

export default App;
