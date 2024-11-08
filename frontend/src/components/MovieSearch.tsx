import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Table,
  Space,
  Checkbox,
  InputNumber,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import request from "../utils/request";

const MovieSearch: React.FC = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<{
    [key: string]: boolean;
  }>({});
  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  const handleSearch = async (values: any) => {
    try {
      setLoading(true);
      const response = await request.get("/movies/search", {
        params: { query: values.title },
      });
      if (response.status === "success") {
        setSearchResults(response.data);
        // Reset selection and prices
        setSelectedMovies({});
        setPrices({});
      }
    } catch (error) {
      message.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const moviesToSave = searchResults
        .filter((movie) => selectedMovies[movie.title])
        .map((movie) => ({
          ...movie,
          price: prices[movie.title] || movie.price,
        }));

      if (moviesToSave.length === 0) {
        message.warning("Please select at least one movie");
        return;
      }

      await request.post("/movies/save-selected", { movies: moviesToSave });
      message.success("Save successful");
      setVisible(false);
      setSearchResults([]);
      setSelectedMovies({});
      setPrices({});
    } catch (error) {
      message.error("Save failed");
    }
  };

  const handleCheckboxChange = (title: string, checked: boolean) => {
    setSelectedMovies((prev) => ({
      ...prev,
      [title]: checked,
    }));

    // Clear the corresponding price if unchecked
    if (!checked) {
      setPrices((prev) => {
        const newPrices = { ...prev };
        delete newPrices[title];
        return newPrices;
      });
    }
  };

  const columns = [
    {
      title: "Select",
      dataIndex: "title",
      width: 80,
      render: (title: string) => (
        <Checkbox
          checked={selectedMovies[title] || false}
          onChange={(e) => handleCheckboxChange(title, e.target.checked)}
        />
      ),
    },
    {
      title: "Poster",
      dataIndex: "posterUrl",
      width: 100,
      render: (url: string) => (
        <img
          src={url}
          alt="poster"
          style={{ width: 50, height: 75, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 150,
      render: (price: number, record: any) => (
        <InputNumber
          defaultValue={price}
          min={0}
          precision={2}
          onChange={(value) =>
            setPrices((prev) => ({ ...prev, [record.title]: value }))
          }
          disabled={!selectedMovies[record.title]}
          formatter={(value) => `$ ${value}`}
          style={{ width: "100px" }}
        />
      ),
    },
  ];

  return (
    <div style={{ marginLeft: "auto", marginRight: 0 }}>
      <Button
        type="primary"
        onClick={() => setVisible(true)}
        style={{
          fontWeight: "bold",
          backgroundColor: "transparent",
          marginTop: 5,
          color: "#c0c0c0",
          borderColor: "#1a237e",
        }}
      >
        <SearchOutlined /> External Search
      </Button>
      <Modal
        title="Search Movies"
        open={visible}
        onCancel={() => setVisible(false)}
        width="80vw"
        style={{ top: 25 }}
        footer={[
          <Button key="cancel" onClick={() => setVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleSave}
            disabled={
              Object.values(selectedMovies).filter(Boolean).length === 0
            }
          >
            Save Selected
          </Button>,
        ]}
      >
        <Form form={form} onFinish={handleSearch}>
          <Space>
            <Form.Item name="title" label="标题" style={{ marginBottom: 16 }}>
              <Input
                placeholder="输入电影标题"
                allowClear
                style={{
                  width: 300,
                  borderColor: "#1a237e", // 深蓝色
                  borderWidth: 2,
                }}
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                backgroundColor: "#1a237e", // 深蓝色
                borderColor: "#1a237e",
              }}
            >
              搜索
            </Button>
          </Space>
        </Form>

        <Table
          columns={columns}
          dataSource={searchResults}
          rowKey="title"
          pagination={{ pageSize: 10 }}
          loading={loading}
          scroll={{ y: "calc(100vh - 300px)" }}
        />
      </Modal>
    </div>
  );
};

export default MovieSearch;
