import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

/**
 * SearchBar Component
 *
 * Renders a search input field.
 * @param {object} props - The component props.
 * @param {string} props.searchQuery - The current value of the search input.
 * @param {function} props.onSearchChange - The function to call when the search input changes.
 */
function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <Box sx={{ marginY: 4, display: 'flex', justifyContent: 'center' }}>
      <TextField
        label="Cerca un libro per titolo o autore..."
        variant="outlined"
        value={searchQuery}
        onChange={onSearchChange}
        sx={{ width: '80%', maxWidth: '600px' }}
      />
    </Box>
  );
}

export default SearchBar;
