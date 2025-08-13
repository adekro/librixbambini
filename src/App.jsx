import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import SearchBar from './SearchBar';
import BookList from './BookList';
import { useBooks } from './hooks/useBooks';

const APP_TITLE = "Ricerca Libri su Project Gutenberg";

/**
 * App Component
 *
 * The main component, now updated to handle API-based searching.
 * It manages the search input state and triggers the API call via the useBooks hook.
 * It also handles the UI for loading and error states.
 */
function App() {
  // State for the search input field. This is controlled by the user.
  const [searchQuery, setSearchQuery] = useState('');

  // The custom hook now provides the book list, loading/error states, and the fetch function.
  const { books, isLoading, error, fetchBooks } = useBooks();

  // Handler for the search input change. Updates the local query state.
  const handleQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handler for the search button click. Triggers the API call.
  const handleSearch = () => {
    fetchBooks(searchQuery);
  };

  return (
    <>
      <CssBaseline />
      <Container>
        <Typography
          variant="h3"
          component="h1"
          align="center"
          gutterBottom
          sx={{ marginTop: 4 }}
        >
          {APP_TITLE}
        </Typography>

        <SearchBar
          searchQuery={searchQuery}
          onQueryChange={handleQueryChange}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Display a loading spinner while fetching data */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Display an error message if the fetch fails */}
        {error && (
          <Alert severity="error" sx={{ marginY: 2 }}>
            Si è verificato un errore durante la ricerca: {error.message}
          </Alert>
        )}

        {/* Display the list of books */}
        {/* We pass a prop to indicate if a search has been performed */}
        <BookList books={books} hasSearched={!isLoading && !error} />
      </Container>
    </>
  );
}

export default App;
