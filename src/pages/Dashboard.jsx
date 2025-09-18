import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBooks, addBook, updateBook, deleteBook } from "../api/booksApi";
import BookTable from "../components/BookTable";
import BookForm from "../components/BookForm";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import Loader from "../components/Loader";
import {
    Button,
    Container,
    Typography,
    Stack,
    TextField,
    MenuItem,
    Pagination,
    Paper,
    Box
} from "@mui/material";
import { toast } from "react-toastify";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

export default function Dashboard() {
    const queryClient = useQueryClient();
    const [openForm, setOpenForm] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [deleteBookData, setDeleteBookData] = useState(null);
    const [search, setSearch] = useState("");
    const [filterGenre, setFilterGenre] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [tableLoading, setTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Fetch books
    const { data, isLoading } = useQuery({
        queryKey: ["books"],
        queryFn: getBooks,
        select: (res) => res.data,
    });

    // Mutations
    const addMutation = useMutation({
        mutationFn: addBook,
        onSuccess: () => {
            toast.success("Book added successfully");
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
        onError: () => toast.error("Failed to add book"),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateBook(id, data),
        onSuccess: () => {
            toast.success("Book updated successfully");
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
        onError: () => toast.error("Failed to update book"),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteBook,
        onSuccess: () => {
            toast.success("Book deleted");
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
        onError: () => toast.error("Failed to delete"),
    });

    // Handlers
    const handleFormSubmit = (book) => {
        if (editingBook) {
            updateMutation.mutate({ id: editingBook.id, data: book });
        } else {
            addMutation.mutate(book);
        }
        setOpenForm(false);
        setEditingBook(null);
    };

    const handleDeleteConfirm = () => {
        if (deleteBookData) {
            deleteMutation.mutate(deleteBookData.id);
            setDeleteBookData(null);
        }
    };

    useEffect(() => {
        setTableLoading(true);

        // small delay to show loader
        const timeout = setTimeout(() => {
            setTableLoading(false);
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, filterGenre, filterStatus]);

    //Apply Search + Filters + Pagination
    const filteredBooks = useMemo(() => {
        let books = data || [];

        if (search) {
            books = books.filter(
                (b) =>
                    b.title.toLowerCase().includes(search.toLowerCase()) ||
                    b.author.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (filterGenre) books = books.filter((b) => b.genre === filterGenre);
        if (filterStatus) books = books.filter((b) => b.status === filterStatus);

        return books;
    }, [data, search, filterGenre, filterStatus]);

    const totalPages = Math.ceil(filteredBooks.length / pageSize);
    const paginatedBooks = filteredBooks.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    if (isLoading) return <Loader />;

    return (
        <Container sx={{ py: 5 }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <LibraryBooksIcon color="primary" fontSize="large" />
                    <Typography variant="h4" fontWeight={600}>
                        Book Dashboard
                    </Typography>
                </Stack>
                <Button
                    variant="contained"
                    onClick={() => setOpenForm(true)}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": { boxShadow: 3 },
                    }}
                >
                    + Add Book
                </Button>
            </Stack>

            {/* Filters Section */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                        label="Search by Title/Author"
                        variant="outlined"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        fullWidth
                    />
                    <TextField
                        select
                        label="Genre"
                        value={filterGenre}
                        onChange={(e) => {
                            setFilterGenre(e.target.value);
                            setPage(1);
                        }}
                        sx={{ minWidth: 180 }}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Fiction">Fiction</MenuItem>
                        <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
                        <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Status"
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setPage(1);
                        }}
                        sx={{ minWidth: 160 }}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Available">Available</MenuItem>
                        <MenuItem value="Issued">Issued</MenuItem>
                    </TextField>
                </Stack>
            </Paper>

            {/* Table or No Data */}
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2, minHeight: 200 }}>
                {tableLoading ? (
                    <Loader />
                ) : filteredBooks.length > 0 ? (
                    <BookTable
                        books={paginatedBooks}
                        onEdit={(book) => {
                            setEditingBook(book);
                            setOpenForm(true);
                        }}
                        onDelete={(book) => setDeleteBookData(book)}
                    />
                ) : (
                    <Box textAlign="center" mt={4} color="text.secondary">
                        <SentimentDissatisfiedIcon sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h6">No books found</Typography>
                        <Typography variant="body2">Try adding your book!</Typography>
                    </Box>
                )}
            </Paper>

            {/* Pagination */}
            {totalPages > 1 && (
                <Stack mt={4} alignItems="center">
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                        sx={{ "& .MuiPagination-ul": { justifyContent: "center" } }}
                    />
                </Stack>
            )}

            {/* Modals */}
            <BookForm
                open={openForm}
                handleClose={() => {
                    setOpenForm(false);
                    setEditingBook(null);
                }}
                onSubmit={handleFormSubmit}
                initialData={editingBook}
            />

            <DeleteConfirmDialog
                open={!!deleteBookData}
                handleClose={() => setDeleteBookData(null)}
                onConfirm={handleDeleteConfirm}
            />
        </Container>
    );
}
