import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

/**
 * SearchBar Component
 *
 * Renders a search input field and a search button.
 * The search is triggered by clicking the button, not on input change.
 *
 * @param {object} props - The component props.
 * @param {string} props.searchQuery - The current value of the search input.
 * @param {function} props.onQueryChange - The function to call when the search input changes.
 * @param {function} props.onSearch - The function to call when the search button is clicked.
 * @param {boolean} props.isLoading - Flag to disable the button during a search.
 */
function SearchBar({ searchQuery, onQueryChange, onSearch, isLoading }) {

  // Allow searching by pressing the "Enter" key in the text field.
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <Box
      sx={{
        marginY: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2
      }}
    >
      <TextField
        label="Cerca per titolo, autore o genere..."
        variant="outlined"
        value={searchQuery}
        onChange={onQueryChange}
        onKeyPress={handleKeyPress}
        sx={{ flexGrow: 1, maxWidth: '600px' }}
        disabled={isLoading}
      />
      <Button
        variant="contained"
        onClick={onSearch}
        disabled={isLoading || !searchQuery}
        sx={{ height: '56px' }} // Match the height of the TextField
      >
        {isLoading ? 'Ricerca...' : 'Cerca'}
      </Button>
    </Box>
  );
}

export default SearchBar;
