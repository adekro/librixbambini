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
 * Renders a list of books. Each book item now displays genres and provides
 * two separate buttons: one to view the book's page on Project Gutenberg,
 * and another to download the PDF directly.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.books - The array of book objects to display.
 * @param {boolean} props.loading - Whether the books are currently being loaded.
 */
function BookList({ books, loading }) {


  // A generic handler to open a URL in a new tab.
  const handleLinkClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Display a message if the filtered list is empty.

  


  if (books.length === 0) {
    return (
      <Typography sx={{ textAlign: 'center', marginTop: 4 }}>
        Nessun libro trovato.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper', margin: 'auto' }}>
      <List>
        {books.map((book) => (

          <ListItem
            key={book.title}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              borderBottom: '1px solid #e0e0e0',
              paddingY: 2
            }}
          >
            {/* Book title, author, and year */}
            <ListItemText
              primary={book.title}
              secondary={`${book.author} (${book.year})`}
              sx={{ marginBottom: 1 }}
            />

            {/* Genres displayed as Chips */}
            <Stack direction="row" spacing={1} sx={{ marginBottom: 2 }} useFlexGap flexWrap="wrap">
              {book.genres.map(genre => <Chip label={genre} key={genre} size="small" variant="outlined" />)}
            </Stack>

            {/* Action buttons */}
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleLinkClick(book.pageUrl)}
              >
                Scheda Libro
              </Button>
              {/* Conditionally render the PDF button only if a pdfUrl exists */}
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
