import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Drawer
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/create-plan">
          <ListItemText primary="Manage Plan" />
        </ListItem>
        {/* <ListItem button component={Link} to="/manage-plans">
          <ListItemText primary="Manage Plans" />
        </ListItem> */}
      </List>
    </Drawer>
  );
};

export default Sidebar;
