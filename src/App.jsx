import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';

import SearchBar from './SearchBar';
import BookList from './BookList';
import { useBooks } from './hooks/useBooks';

// Define the application title as a constant for better maintainability and clarity.
const APP_TITLE = "Biblioteca Pubblica per Bambini";

/**
 * App Component
 *
 * This is the main component of the application. It has been refactored to be a pure
 * presentational component. All business logic (data fetching, searching, filtering)
 * is now encapsulated in the `useBooks` custom hook.
 */
function App() {
  // Use the custom hook to get the state and functions needed by the component.
  // This keeps the App component clean and focused on the UI.
  const { searchQuery, setSearchQuery, filteredBooks } = useBooks();

  // The event handler for the search input now simply calls the state setter
  // provided by the `useBooks` hook.
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <CssBaseline />
      <Container>
        {/* Header Title */}
        <Typography
          variant="h3"
          component="h1"
          align="center"
          gutterBottom
          sx={{ marginTop: 4 }}
        >
          {APP_TITLE}
        </Typography>

        {/* Search Bar Component */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Book List Component */}
        <BookList books={filteredBooks} />
      </Container>
    </>
  );
}

export default App;
