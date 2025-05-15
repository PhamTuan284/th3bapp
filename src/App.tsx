import { useState } from 'react'
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import ClothingItemForm from './components/ClothingItemForm'
import InventoryList from './components/InventoryList'
import type { ClothingItem, StoreStats } from './types'

const drawerWidth = 240

function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [items, setItems] = useState<ClothingItem[]>([])
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const calculateStats = (): StoreStats => {
    const totalItems = items.reduce(
      (sum, item) =>
        sum + Object.values(item.sizes).reduce((sizeSum, qty) => sizeSum + qty, 0),
      0
    )

    const totalValue = items.reduce(
      (sum, item) =>
        sum +
        item.price *
          Object.values(item.sizes).reduce((sizeSum, qty) => sizeSum + qty, 0),
      0
    )

    const lowStockItems = items.filter((item) =>
      Object.values(item.sizes).some((qty) => qty < 5)
    ).length

    const categories = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    return {
      totalItems,
      totalValue,
      lowStockItems,
      categories,
    }
  }

  const handleAddItem = (newItem: Omit<ClothingItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const item: ClothingItem = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setItems([...items, item])
  }

  const handleEditItem = (item: ClothingItem) => {
    setEditingItem(item)
  }

  const handleUpdateItem = (updatedItem: Omit<ClothingItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingItem) return

    const item: ClothingItem = {
      ...updatedItem,
      id: editingItem.id,
      createdAt: editingItem.createdAt,
      updatedAt: new Date().toISOString(),
    }

    setItems(items.map((i) => (i.id === item.id ? item : i)))
    setEditingItem(null)
  }

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItem component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem component={Link} to="/add">
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add Item" />
        </ListItem>
        <ListItem component={Link} to="/inventory">
          <ListItemIcon>
            <InventoryIcon />
          </ListItemIcon>
          <ListItemText primary="Inventory" />
        </ListItem>
      </List>
    </div>
  )

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              TH3BAPP Clothing Store
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={<Dashboard stats={calculateStats()} />} />
            <Route
              path="/add"
              element={
                <ClothingItemForm
                  onSubmit={editingItem ? handleUpdateItem : handleAddItem}
                  initialData={editingItem || undefined}
                />
              }
            />
            <Route
              path="/inventory"
              element={
                <InventoryList
                  items={items}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              }
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  )
}

export default App
