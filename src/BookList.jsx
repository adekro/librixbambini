import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

/**
 * BookList Component
 *
 * Renders a list of books fetched from the API.
 * It now distinguishes between the initial state (before any search)
 * and a search that returned no results.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.books - The array of book objects to display.
 * @param {boolean} props.hasSearched - A flag to indicate if a search has been performed.
 */
function BookList({ books, hasSearched }) {

  const handleLinkClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // If a search has been performed and the books array is empty, show "No results".
  if (hasSearched && books.length === 0) {
    return (
      <Typography sx={{ textAlign: 'center', marginTop: 4 }}>
        Nessun libro trovato. Prova con un altro termine di ricerca.
      </Typography>
    );
  }

  // If no search has been performed yet, show a welcome/prompt message.
  if (!hasSearched && books.length === 0) {
    return (
      <Typography sx={{ textAlign: 'center', marginTop: 4, color: 'text.secondary' }}>
        Usa la barra di ricerca in alto per trovare libri di pubblico dominio.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper', margin: 'auto' }}>
      <List>
        {books.map((book) => (
          <ListItem
            key={book.id} // Use the unique book ID as the key
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              borderBottom: '1px solid #e0e0e0',
              paddingY: 2
            }}
          >
            <ListItemText
              primary={book.title}
              secondary={`${book.author} (Anno approx: ${book.year})`}
              sx={{ marginBottom: 1 }}
            />

            <Stack direction="row" spacing={1} sx={{ marginBottom: 2 }} useFlexGap flexWrap="wrap">
              {book.genres.map(genre => <Chip label={genre} key={genre} size="small" variant="outlined" />)}
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleLinkClick(book.pageUrl)}
              >
                Scheda Libro
              </Button>
              {book.pdfUrl && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleLinkClick(book.pdfUrl)}
                >
                  Scarica PDF
                </Button>
              )}
            </Stack>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default BookList;
