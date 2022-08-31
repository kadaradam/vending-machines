import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useState } from "react";
import { TextField } from "src/formik";
import { addProductApi, AddProductApiDto } from "src/react-query/api";
import * as Yup from "yup";

const AddProductSchema = Yup.object().shape({
  productName: Yup.string().required("Required"),
  cost: Yup.number().required("Required"),
});

const AddProductFab = ({ refetch }: { refetch: () => void }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate: addProduct, isLoading: isAddLoading } = useMutation(
    addProductApi,
    {
      onSuccess: () => {
        setOpen(false);
        refetch();
      },
    }
  );

  const handleAddProduct = ({ productName, cost }: AddProductApiDto) =>
    addProduct({
      productName,
      cost,
    });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Fab
        sx={{ position: "fixed", bottom: 36, right: 36 }}
        color="secondary"
        aria-label="add"
        onClick={handleClickOpen}
        disabled={isAddLoading}
      >
        <AddIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Formik
          initialValues={{
            productName: "",
            cost: 0,
          }}
          validationSchema={AddProductSchema}
          onSubmit={handleAddProduct}
        >
          <Form>
            <DialogTitle id="alert-dialog-title">
              Add your new product
            </DialogTitle>
            <DialogContent>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Product name"
                name="productName"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Price (in cents)"
                name="cost"
                type="number"
                autoFocus
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" autoFocus>
                Add
              </Button>
            </DialogActions>
          </Form>
        </Formik>
      </Dialog>
    </>
  );
};

export default AddProductFab;
