import React, { useState } from "react";
import { Form, DatePicker, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { rentalAPI } from "../api/api";
import { IMovie } from "../types/movie";
import type { UploadFile } from "antd/es/upload/interface";

interface RentalFormProps {
  movie: IMovie;
  onSuccess: () => void;
}

const RentalForm: React.FC<RentalFormProps> = ({ movie, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("movieId", movie._id);
      formData.append("startDate", values.dates[0].format("YYYY-MM-DD"));
      formData.append("endDate", values.dates[1].format("YYYY-MM-DD"));

      if (fileList[0]?.originFileObj) {
        formData.append("photo", fileList[0].originFileObj);
      }

      await rentalAPI.createRental(formData);
      message.success("Rental application submitted successfully!");
      onSuccess();
    } catch (error) {
      message.error("Failed to submit rental application");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file: any) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      return false;
    },
    maxCount: 1,
    fileList,
    onChange: ({ fileList }: { fileList: UploadFile[] }) =>
      setFileList(fileList),
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

      <Form.Item
        name="photo"
        label="Upload Photo"
        rules={[{ required: true, message: "Please upload a photo" }]}
      >
        <Upload {...uploadProps} listType="picture">
          <Button icon={<UploadOutlined />}>Upload Photo</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit Application
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RentalForm;
