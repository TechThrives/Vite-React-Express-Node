import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [genreFilter, setGenreFilter] = useState("");
  const [minRatingFilter, setMinRatingFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    publicationYear: "",
    genre: "",
    rating: "",
    description: "",
    metadata: {
      pages: "",
      stockLeft: "",
      price: "",
      discount: "",
      edition: "",
    },
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    axios
      .get("${BACKEND_URL}/api/books")
      .then((res) => {
        setBooks(res.data);
        setGenres(
          res.data
            .map((book) => book.genre)
            .filter((value, index, self) => self.indexOf(value) === index)
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const filteredBooks = books
    .filter((book) => {
      const matchesGenre = genreFilter ? book.genre === genreFilter : true;
      const matchesRating = minRatingFilter
        ? Number(book.rating) >= Number(minRatingFilter)
        : true;
      return matchesGenre && matchesRating;
    })
    .sort((a, b) => {
      if (sortOption === "title") return a.title.localeCompare(b.title);
      if (sortOption === "author") return a.author.localeCompare(b.author);
      if (sortOption === "publicationYear")
        return a.publicationYear - b.publicationYear;
      return 0;
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChangeMetadata = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [name]: value,
      },
    }));
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    axios
      .post("${BACKEND_URL}/api/books", newBook)
      .then((res) => {
        setBooks((prevBooks) => [...prevBooks, res.data]);
        setNewBook({
          title: "",
          author: "",
          publicationYear: "",
          genre: "",
          rating: "",
          description: "",
          metadata: {
            pages: "",
            stockLeft: "",
            price: "",
            discount: "",
            edition: "",
          },
        });
        setShowModal(false);
      })
      .catch((err) => console.error(err));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="p-5 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-5">Books Collection</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="flex-1">
            <label className="block mb-1">Filter by Genre</label>
            <select
              className="w-full p-2 border rounded"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
            >
              <option value="">All Genres</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1">Minimum Rating</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              className="w-full p-2 border rounded"
              value={minRatingFilter}
              onChange={(e) => setMinRatingFilter(e.target.value)}
              placeholder="e.g., 3.5"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Sort By</label>
            <select
              className="w-full p-2 border rounded"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">None</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="publicationYear">Publication Year</option>
            </select>
          </div>
          <div className="flex items-center mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add New Book
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filteredBooks.map((book) => (
            <Link to={`/books/${book.id}`} key={book.id}>
              <div className="p-4 border rounded shadow-sm">
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <p className="text-gray-700">Author: {book.author}</p>
                <p className="text-gray-700">Year: {book.publicationYear}</p>
                <p className="text-gray-700">Genre: {book.genre}</p>
                <p className="text-gray-700">Rating: {book.rating}</p>
              </div>
            </Link>
          ))}
        </div>

        {showModal && (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/50 bg-opacity-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  &#x2715;
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center">
                  Add New Book
                </h2>

                <form
                  onSubmit={handleAddBook}
                  className="grid grid-cols-2 gap-4"
                >
                  {/* Left Column */}
                  <div>
                    <label className="block mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      className="w-full p-2 border rounded"
                      value={newBook.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Author</label>
                    <input
                      type="text"
                      name="author"
                      className="w-full p-2 border rounded"
                      value={newBook.author}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Publication Year</label>
                    <input
                      type="number"
                      name="publicationYear"
                      className="w-full p-2 border rounded"
                      value={newBook.publicationYear}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Genre</label>
                    <input
                      type="text"
                      name="genre"
                      className="w-full p-2 border rounded"
                      value={newBook.genre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Rating</label>
                    <input
                      type="number"
                      name="rating"
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full p-2 border rounded"
                      value={newBook.rating}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Right Column (Metadata Fields) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pages
                    </label>
                    <input
                      type="number"
                      name="pages"
                      className="w-full p-2 border rounded"
                      value={newBook.metadata.pages}
                      onChange={handleInputChangeMetadata}
                      placeholder="Pages"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Stock Left
                    </label>
                    <input
                      type="number"
                      name="stockLeft"
                      className="w-full p-2 border rounded"
                      value={newBook.metadata.stockLeft}
                      onChange={handleInputChangeMetadata}
                      placeholder="Stock Left"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      className="w-full p-2 border rounded"
                      value={newBook.metadata.price}
                      onChange={handleInputChangeMetadata}
                      placeholder="Price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      className="w-full p-2 border rounded"
                      value={newBook.metadata.discount}
                      onChange={handleInputChangeMetadata}
                      placeholder="Discount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Edition
                    </label>
                    <input
                      type="text"
                      name="edition"
                      className="w-full p-2 border rounded"
                      value={newBook.metadata.edition}
                      onChange={handleInputChangeMetadata}
                      placeholder="Edition"
                    />
                  </div>

                  {/* Full Width Submit Button */}
                  <div className="col-span-2">
                    <button
                      type="submit"
                      className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add Book
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Books;
