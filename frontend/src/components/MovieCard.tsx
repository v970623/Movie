import React, { useState } from "react";
import { Card, Button, Modal } from "antd";
import { IMovie } from "../types/movie";
import RentalForm from "./RentalForm";
import { rentalAPI } from "../api/api";

interface MovieCardProps {
  movie: IMovie;
  onRefresh: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = async () => {
    setIsModalOpen(false);
    await rentalAPI.getRentals();
    onRefresh();
  };

  const maxDescriptionLength = 144;
  const truncatedDescription =
    movie.description.length > maxDescriptionLength
      ? movie.description.substring(0, maxDescriptionLength) + "..."
      : movie.description;

  return (
    <>
      <Card
        hoverable
        cover={<img alt={movie.title} src={movie.posterUrl} />}
        actions={[
          <Button
            type="primary"
            onClick={showModal}
            disabled={movie.status === "unavailable"}
          >
            Rent
          </Button>,
        ]}
      >
        <Card.Meta
          title={movie.title}
          description={
            <>
              <p>{truncatedDescription}</p>
              <p>Price: ¥{movie.price}/day</p>
              <p>Genre: {movie.genre.join(", ")}</p>
            </>
          }
        />
      </Card>

      <Modal
        title={`Rent - ${movie.title}`}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <RentalForm movie={movie} onSuccess={handleSuccess} />
      </Modal>
    </>
  );
};

export default MovieCard;
