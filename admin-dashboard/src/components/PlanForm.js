import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { fetchPlans, createPlan, updatePlan, deletePlan } from '../services/api';
import { Delete, Edit } from '@mui/icons-material';

const ManagePlans = () => {
  const [allPlans, setAllPlans] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    price: '',
    features: '',
    is_active: true,
  });
  const [editMode, setEditMode] = useState(false);

  // Fetch plans on component load
  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await fetchPlans();
      if (Array.isArray(response.data.plans)) {
        setAllPlans(response.data.plans); 
      } else {
        console.error('Plans data is not an array:', response.data.plans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleOpen = () => {
    setFormData({
      id: null,
      name: '',
      price: '',
      features: '',
      is_active: true,
    });
    setEditMode(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const data = {
        name: formData.name,
        price: parseFloat(formData.price),
        features: JSON.stringify(formData.features.split(',')),
        is_active: formData.is_active,
      };

      if (editMode) {
        await updatePlan(formData.id, data);
      } else {
        await createPlan(data);
      }
      await loadPlans();
      handleClose();
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleEdit = (plan) => {
    setFormData({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      features: JSON.parse(plan.features).join(','),
      is_active: plan.is_active,
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deletePlan(id);
      await loadPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };
  
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Manage Subscription Plans
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add New Plan
      </Button>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Features</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>            
            {allPlans && allPlans.length > 0 ? ( allPlans.map(plan => (
              <TableRow key={plan.id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>${plan.price}</TableCell>
                <TableCell>
                { Object.entries(plan.features).map((feature, index) => (
                    <div key={index}>{feature}</div>
                ))}
                </TableCell>
                <TableCell>{plan.is_active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(plan)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(plan.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))): (
                <p>No plans available.</p>
              )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="price"
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="features"
            label="Features (comma-separated)"
            value={formData.features}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            {editMode ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagePlans;
