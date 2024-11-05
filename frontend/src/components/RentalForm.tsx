import React, { useState } from "react";
import { Form, DatePicker, Button, message } from "antd";
import { createRental } from "../services/rentalService";
import { IMovie } from "../types/movie";

interface RentalFormProps {
  movie: IMovie;
  onSuccess: () => void;
}

const RentalForm: React.FC<RentalFormProps> = ({ movie, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await createRental({
        movieId: movie._id,
        startDate: values.dates[0].format("YYYY-MM-DD"),
        endDate: values.dates[1].format("YYYY-MM-DD"),
      });
      message.success("Rental successful!");
      onSuccess();
    } catch (error) {
      message.error("Rental failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="dates"
        label="Rental Period"
        rules={[{ required: true, message: "Please select rental dates" }]}
      >
        <DatePicker.RangePicker />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Confirm Rental
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RentalForm;
