import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

export default function DeleteConfirmDialog({ open, handleClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Are you sure you want to delete this book?</DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
