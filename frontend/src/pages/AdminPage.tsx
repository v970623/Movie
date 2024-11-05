import React from "react";
import { Tabs } from "antd";
import AdminRentalList from "../components/AdminRentalList";
import { Box, Typography } from "@mui/material";

const { TabPane } = Tabs;

const AdminPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Rental Management System
      </Typography>
      <Tabs defaultActiveKey="rentals">
        <TabPane tab="Rental Management" key="rentals">
          <AdminRentalList />
        </TabPane>
      </Tabs>
    </Box>
  );
};

export default AdminPage;
