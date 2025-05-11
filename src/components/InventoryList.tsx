import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { ClothingItem } from '../types';
import InvoiceGenerator from './InvoiceGenerator';

interface InventoryListProps {
  items: ClothingItem[];
  onEdit: (item: ClothingItem) => void;
  onDelete: (id: string) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({
  items,
  onEdit,
  onDelete,
}) => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Inventory
        </Typography>
        <InvoiceGenerator items={items} />
      </Box>
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography variant="h6" component="div">
                    {item.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(item)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(item.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {item.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                  ${item.price}
                </Typography>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Sizes Available:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {Object.entries(item.sizes).map(([size, quantity]) => (
                      <Chip
                        key={size}
                        label={`${size}: ${quantity}`}
                        color={quantity < 5 ? 'error' : 'default'}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
                <Chip
                  label={item.category}
                  size="small"
                  sx={{ mr: 1 }}
                />
                {item.note && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    Note: {item.note}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InventoryList; 