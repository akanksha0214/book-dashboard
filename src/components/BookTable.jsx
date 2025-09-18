import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Paper
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function BookTable({ books, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Genre</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book._id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.genre}</TableCell>
              <TableCell>{book.year}</TableCell>
              <TableCell>
                <Chip
                  label={book.status}
                  color={book.status === "Available" ? "success" : "error"}
                  sx={{
                    minWidth: 90,        
                    justifyContent: "center", 
                    fontWeight: 600
                  }}
                />
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", pr: 1 }}>
                <IconButton size="small" onClick={() => onEdit(book)}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(book)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
