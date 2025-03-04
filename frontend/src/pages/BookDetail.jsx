import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/books/${id}`)
      .then((res) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  if (!book)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <h1 className="text-3xl font-bold mb-4">Book Not Found!!!</h1>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Author:</span> {book.author}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Publication Year:</span>{" "}
          {book.publicationYear}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Genre:</span> {book.genre}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Rating:</span> {book.rating}
        </p>
        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Description:</span> {book.description}
        </p>

        {book.metadata && (
          <div className="bg-gray-100 p-4 rounded border-1">
            <h2 className="text-2xl font-semibold mb-3">Book Metadata</h2>
            <p className="text-gray-700">
              <span className="font-semibold">Pages:</span>{" "}
              {book.metadata.pages}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Stock Left:</span>{" "}
              {book.metadata.stockLeft}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Price:</span> $
              {book.metadata.price}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Discount:</span>{" "}
              {book.metadata.discount}%
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Edition:</span>{" "}
              {book.metadata.edition}
            </p>
          </div>
        )}
        <button
          onClick={() => navigate("/books")}
          className="mt-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default BookDetail;
