import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  googleId: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  liked_movies: {
    type: [
      {title: { type: String, required: true },
        id: { type: String, required: true },
        genres: { type: [Number], default: [] },
        keywords: { type: [{ id: { type: Number }, name: { type: String } }], default: [] },
        poster: { type: String, required: true },
      }
    ],
    default: [],
  },
  watched_movies: {
    type: [
      {title: { type: String, required: true },
        id: { type: String, required: true },
        poster: { type: String, required: true },
      }
    ],
    default: [],
  },
  watchlist_movies: {
    type: [
      {title: { type: String, required: true },
        id: { type: String, required: true },
        poster: { type: String, required: true },
      }
    ],
    default: [],
  },
  prefrence: {
    type: {
      topgenre: { type: [{ genreId: { type: Number } }], default: [] },
      topkeywords: { type: [{ keywordId: { type: Number } }], default: [] }
    },
    default: {
      topgenre: [],
      topkeywords: []
    }
  }
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
