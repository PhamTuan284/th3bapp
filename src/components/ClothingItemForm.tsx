import React, { useState, useRef } from "react";
import { Box, Button, TextField, Typography, Paper, Grid } from "@mui/material";
import type { ClothingItem } from "../types";

interface ClothingItemFormProps {
  onSubmit: (
    item: Omit<ClothingItem, "id" | "createdAt" | "updatedAt">
  ) => void;
  initialData?: Partial<ClothingItem>;
}

const ClothingItemForm: React.FC<ClothingItemFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category: initialData?.category || "",
    note: initialData?.note || "",
    image: initialData?.image || "",
    sizes: initialData?.sizes || {
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData((prev) => ({
          ...prev,
          image: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeChange = (size: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [size]: parseInt(value) || 0,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {initialData ? "Edit Item" : "Add New Item"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mb: 2 }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                sx={{ mb: 2 }}
              >
                Upload Image
              </Button>
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
              Sizes and Quantities
            </Typography>
            <Grid container spacing={2}>
              {Object.keys(formData.sizes).map((size) => (
                <Grid size={{ xs: 6, md: 3 }} key={size}>
                  <TextField
                    fullWidth
                    label={`Size ${size}`}
                    type="number"
                    value={formData.sizes[size]}
                    onChange={(e) => handleSizeChange(size, e.target.value)}
                    required
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              {initialData ? "Update Item" : "Add Item"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ClothingItemForm;
