import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { getRentals } from "../services/rentalService";

const RentalHistory: React.FC = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await getRentals();
      setRentals(response.data.data);
    } catch (error) {
      console.error("Failed to fetch rental history:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Movie",
      dataIndex: ["movieId", "title"],
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
            status === "new"
              ? "blue"
              : status === "accepted"
              ? "green"
              : status === "rejected"
              ? "red"
              : "orange"
          }
        >
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={rentals}
      loading={loading}
      rowKey="_id"
    />
  );
};

export default RentalHistory;
