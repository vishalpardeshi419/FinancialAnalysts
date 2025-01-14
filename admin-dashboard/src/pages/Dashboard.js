import React, { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { fetchPlans } from '../services/api';
import PlanList from '../components/PlanList';

const Dashboard = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const getPlans = async () => {
      const response = await fetchPlans();
      setPlans(response.data.plans);
    };

    getPlans();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Subscription Plans
      </Typography>
      <PlanList plans={plans} />
    </Container>
  );
};

export default Dashboard;
