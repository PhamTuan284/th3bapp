import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import type { StoreStats } from '../types';

interface DashboardProps {
  stats: StoreStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Store Dashboard
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 3 
      }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Total Items</Typography>
          <Typography variant="h4">{stats.totalItems}</Typography>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Total Value</Typography>
          <Typography variant="h4">${stats.totalValue.toFixed(2)}</Typography>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Low Stock Items</Typography>
          <Typography variant="h4">{stats.lowStockItems}</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard; 