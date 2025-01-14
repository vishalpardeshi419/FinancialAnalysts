import React from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { updatePlan, deletePlan } from '../services/api';

const PlanList = ({ plans }) => {
  const handleDelete = async (id) => {
    try {
      await deletePlan(id);
      alert('Plan deleted successfully');
      // Refresh the plans list after deletion
    } catch (error) {
      alert('Error deleting plan');
    }
  };

  return (
    <Grid container spacing={2}>
      {plans.map((plan) => (
        <Grid item key={plan.id} xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">{plan.name}</Typography>
              <Typography variant="body2">Price: ${plan.price}</Typography>
              <Typography variant="body2">Features: {JSON.stringify(plan.features)}</Typography>
              <Button onClick={() => handleDelete(plan.id)} color="secondary">
                Delete
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PlanList;
