import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";

export default function BookForm({ open, handleClose, onSubmit, initialData }) {
  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      author: "",
      genre: "",
      year: "",
      status: "Available",
    }
  });

  //This ensures form is updated when editing an existing book
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        title: "",
        author: "",
        genre: "",
        year: "",
        status: "Available",
      });
    }
  }, [initialData, reset]);

  const submitHandler = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Edit Book" : "Add Book"}</DialogTitle>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent dividers>
          <TextField
            fullWidth label="Title" {...register("title", { required: true })}
            margin="dense"
          />
          <TextField
            fullWidth label="Author" {...register("author", { required: true })}
            margin="dense"
          />

          {/* Genre with Controller so selected value works */}
          <Controller
            name="genre"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Genre"
                margin="dense"
              >
                <MenuItem value="Fiction">Fiction</MenuItem>
                <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
                <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            )}
          />

          <TextField
            fullWidth label="Published Year" type="number"
            {...register("year", { required: true })}
            margin="dense"
          />

          {/* Status with Controller */}
          <Controller
            name="status"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Status"
                margin="dense"
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Issued">Issued</MenuItem>
              </TextField>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
