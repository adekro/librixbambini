import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/**
 * BookList Component
 *
 * Renders a list of books. Each book is clickable and opens a URL in a new tab.
 * @param {object} props - The component props.
 * @param {Array<object>} props.books - The array of book objects to display.
 */
function BookList({ books }) {

  const handleBookClick = (pdfUrl) => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

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
          <ListItem key={book.title} disablePadding>
            <ListItemButton onClick={() => handleBookClick(book.pdfUrl)}>
              <ListItemText
                primary={book.title}
                secondary={`${book.author} (${book.year})`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default BookList;
