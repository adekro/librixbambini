import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

/**
 * SearchBar Component
 *
 * Renders a search input field.
 * @param {object} props - The component props.
 * @param {string} props.searchQuery - The current value of the search input.
 * @param {function} props.onSearchChange - The function to call when the search input changes.
 * @param {string} props.searchType - The current search type.
 * @param {function} props.onSearchTypeChange - The function to call when the search type changes.
 */
function SearchBar({ searchQuery, onSearchChange, searchType, onSearchTypeChange }) {
  return (
    <Box sx={{ marginY: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="search-type-label">Cerca per</InputLabel>
        <Select
          labelId="search-type-label"
          id="search-type-select"
          value={searchType}
          label="Cerca per"
          onChange={onSearchTypeChange}
        >
          <MenuItem value="title_author">Titolo/Autore</MenuItem>
          <MenuItem value="genre">Genere</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Cerca un libro..."
        variant="outlined"
        value={searchQuery}
        onChange={onSearchChange}
        sx={{ width: '60%', maxWidth: '500px' }}
      />
    </Box>
  );
}

export default SearchBar;
