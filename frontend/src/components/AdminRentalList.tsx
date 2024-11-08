import React, { useEffect, useState } from "react";
import { Table, Tag, Button, message, Space } from "antd";
import { rentalAPI } from "../services/api";

interface Rental {
  _id: string;
  movieId: {
    title: string;
  };
  userId: {
    email: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
}
const AdminRentalList = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllRentals = async () => {
    try {
      setLoading(true);
      const response = await rentalAPI.getAllRentals();
      setRentals(response.data.data);
    } catch (error) {
      console.error("Failed to fetch rentals:", error);
      message.error("Failed to fetch rentals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRentals();
  }, []);

  const handleStatusUpdate = async (rentalId: string, status: string) => {
    try {
      await rentalAPI.updateRentalStatus(rentalId, status);
      message.success("Status updated successfully");
      fetchAllRentals();
    } catch (error) {
      console.error("Failed to update status:", error);
      message.error("Failed to update status");
    }
  };

  const columns = [
    {
      title: "Movie",
      dataIndex: ["movieId", "title"],
    },
    {
      title: "User",
      dataIndex: ["userId", "email"],
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "pending"
              ? "gold"
              : status === "accepted"
              ? "green"
              : status === "rejected"
              ? "red"
              : "default"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_: any, record: Rental) => (
        <Space>
          {record.status === "pending" && (
            <>
              <Button
                type="primary"
                onClick={() => handleStatusUpdate(record._id, "accepted")}
              >
                Accept
              </Button>
              <Button
                danger
                onClick={() => handleStatusUpdate(record._id, "rejected")}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={rentals}
      loading={loading}
      rowKey="_id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default AdminRentalList;
