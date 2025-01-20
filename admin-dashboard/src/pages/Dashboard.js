import React, { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { fetchPlans } from '../services/api';
import PlanList from '../components/PlanList';

// import io from 'socket.io-client'; // Import Socket.IO client
import { io } from 'socket.io-client';


// Set up WebSocket connection to listen for events
const socket = io('http://localhost:5500'); // Connect to the backend WebSocket server
console.log("socket", socket);

const Dashboard = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5500'); // Connect to the backend WebSocket server

    const getPlans = async () => {
      const response = await fetchPlans();
      setPlans(response.data.plans);
    };

    getPlans();
      
    // Listen for events emitted by the backend
    socket.on('planCreated', (newPlan) => {
      setPlans((prevPlans) => [...prevPlans, newPlan]); // Add the newly created plan
    });

    socket.on('planUpdated', (updatedPlan) => {
      setPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan.id === updatedPlan.id ? updatedPlan : plan
        )
      ); // Update the plan in the list
    });

    socket.on('planDeleted', (deletedPlan) => {
      setPlans((prevPlans) =>
        prevPlans.filter((plan) => plan.id !== deletedPlan.id)
      ); // Remove the deleted plan
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
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
