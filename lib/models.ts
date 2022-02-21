import { DocumentSnapshot } from "firebase/firestore/";

// interfaces
export interface User {
  uid: string;
  username: string;
  displayName: string;
  photoURL: string;
  preferences: {
    ratingSystem: "stars" | "tierlist";
    tierlistNames: {
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      6: string;
      7: string;
    };
  };
  bio: string;
}

export interface Review {
  id: string;
  author: string;
  movie: Movie;
  createdAt: number;
  rating: number;
  review: string;
}

export interface Movie {
  id: string;
  title: string;
  image: string;
}

// converters
export function movieFromJSON(movie: any): Movie {
  return {
    id: `${movie.id}`,
    image: movie.image,
    title: (movie.original_title =
      movie.language === "en" ? movie.original_title : movie.title),
  };
}

export function userFromFirestore(userDoc: DocumentSnapshot): User | null {
  if (!userDoc.exists()) return null;
  const data = userDoc.data();
  return {
    uid: userDoc.id,
    displayName: data.displayName,
    photoURL: data.photoURL,
    preferences: data.preferences,
    username: data.username,
    bio: data.bio,
  };
}

export function userToFirestore(user: User) {
  return {
    displayName: user.displayName,
    username: user.username,
    photoURL: user.photoURL,
    preferences: user.preferences,
    bio: user.bio,
  };
}

export function reviewFromFirestore(reviewDoc: DocumentSnapshot): Review {
  const data = reviewDoc.data();
  return {
    id: reviewDoc.id,
    author: data?.author,
    movie: {
      id: reviewDoc.id,
      title: data?.movie.title,
      image: data?.movie.image,
    },
    rating: data?.rating,
    review: data?.review,
    createdAt: data?.createdAt?.toMillis() || 0,
  };
}

export function reviewToFirestore(review: Review) {
  return {
    movie: {
      title: review.movie.title,
      image: review.movie.image,
    },
    rating: review.rating,
    review: review.review,
    author: review.author,
  };
}