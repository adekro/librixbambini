import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import SearchBar from './SearchBar';
import BookList from './BookList';
import EpicExtractor from './EpicExtractor'; // Import the new component
import { useBooks } from './hooks/useBooks';

const APP_TITLE = "Book Tools"; // Changed title to be more generic

function App() {
  const [view, setView] = useState('gutenberg'); // 'gutenberg' or 'epic'

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

        <Stack direction="row" spacing={2} sx={{ marginY: 2 }} justifyContent="center">
          <Button variant={view === 'gutenberg' ? 'contained' : 'outlined'} onClick={() => setView('gutenberg')}>
            Project Gutenberg Search
          </Button>
          <Button variant={view === 'epic' ? 'contained' : 'outlined'} onClick={() => setView('epic')}>
            Get Epic Extractor
          </Button>
        </Stack>

        {view === 'gutenberg' && (
          <>
            <SearchBar
              searchQuery={searchQuery}
              onQueryChange={handleQueryChange}
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ marginY: 2 }}>
                An error occurred during the search: {error.message}
              </Alert>
            )}

            <BookList books={books} hasSearched={!isLoading && !error} />
          </>
        )}

        {view === 'epic' && <EpicExtractor />}
      </Container>
    </>
  );
}

export default App;
