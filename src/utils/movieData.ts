export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  year: number;
  rating: number;
  runtime: string;
  genre: string[];
  plot: string;
  director: string;
  cast: string[];
  trailerUrl: string;
  platforms: Platform[];
  language: string;
}

export interface Platform {
  name: string;
  logo: string;
  url: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  following: number;
  followers: number;
  watchlist: number[];
  reviews: number;
}

const platforms: Platform[] = [
  {
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1280px-Netflix_2015_logo.svg.png",
    url: "https://netflix.com"
  },
  {
    name: "Prime Video",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/2560px-Amazon_Prime_Video_logo.svg.png",
    url: "https://primevideo.com"
  },
  {
    name: "Disney+",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/2560px-Disney%2B_logo.svg.png",
    url: "https://disneyplus.com"
  },
  {
    name: "HBO Max",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/HBO_Max_Logo.svg/2560px-HBO_Max_Logo.svg.png",
    url: "https://hbomax.com"
  }
];

export const movies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backdropUrl: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    year: 2010,
    rating: 8.8,
    runtime: "2h 28m",
    genre: ["Action", "Sci-Fi", "Thriller"],
    plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page", "Tom Hardy"],
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    platforms: [platforms[0], platforms[1]],
    language: "English"
  },
  {
    id: 2,
    title: "The Shawshank Redemption",
    posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    year: 1994,
    rating: 9.3,
    runtime: "2h 22m",
    genre: ["Drama"],
    plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton", "William Sadler"],
    trailerUrl: "https://www.youtube.com/embed/6hB3S9bIaco",
    platforms: [platforms[1], platforms[3]],
    language: "English"
  },
  {
    id: 3,
    title: "The Dark Knight",
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    year: 2008,
    rating: 9.0,
    runtime: "2h 32m",
    genre: ["Action", "Crime", "Drama", "Thriller"],
    plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
    trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
    platforms: [platforms[0], platforms[2]],
    language: "English"
  },
  {
    id: 4,
    title: "Pulp Fiction",
    posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    year: 1994,
    rating: 8.9,
    runtime: "2h 34m",
    genre: ["Crime", "Drama"],
    plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Samuel L. Jackson", "Uma Thurman", "Bruce Willis"],
    trailerUrl: "https://www.youtube.com/embed/s7EdQ4FqbhY",
    platforms: [platforms[1], platforms[3]],
    language: "English"
  },
  {
    id: 5,
    title: "The Lord of the Rings: The Return of the King",
    posterUrl: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/lXhgCODAbBXL5buk9yEmTpOoOgR.jpg",
    year: 2003,
    rating: 8.9,
    runtime: "3h 21m",
    genre: ["Action", "Adventure", "Drama", "Fantasy"],
    plot: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    director: "Peter Jackson",
    cast: ["Elijah Wood", "Viggo Mortensen", "Ian McKellen", "Orlando Bloom"],
    trailerUrl: "https://www.youtube.com/embed/r5X-hFf6Bwo",
    platforms: [platforms[0], platforms[2]],
    language: "English"
  },
  {
    id: 6,
    title: "Forrest Gump",
    posterUrl: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg",
    year: 1994,
    rating: 8.8,
    runtime: "2h 22m",
    genre: ["Drama", "Romance"],
    plot: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
    director: "Robert Zemeckis",
    cast: ["Tom Hanks", "Robin Wright", "Gary Sinise", "Sally Field"],
    trailerUrl: "https://www.youtube.com/embed/bLvqoHBptjg",
    platforms: [platforms[1], platforms[3]],
    language: "English"
  },
  {
    id: 7,
    title: "The Matrix",
    posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    year: 1999,
    rating: 8.7,
    runtime: "2h 16m",
    genre: ["Action", "Sci-Fi"],
    plot: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    director: "Lana Wachowski, Lilly Wachowski",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss", "Hugo Weaving"],
    trailerUrl: "https://www.youtube.com/embed/vKQi3bBA1y8",
    platforms: [platforms[0], platforms[2]],
    language: "English"
  },
  {
    id: 8,
    title: "Goodfellas",
    posterUrl: "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/sw7mordbZxgITU877yTpZCud90M.jpg",
    year: 1990,
    rating: 8.7,
    runtime: "2h 26m",
    genre: ["Crime", "Drama"],
    plot: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.",
    director: "Martin Scorsese",
    cast: ["Robert De Niro", "Ray Liotta", "Joe Pesci", "Lorraine Bracco"],
    trailerUrl: "https://www.youtube.com/embed/qo5jJpHtI1Y",
    platforms: [platforms[1], platforms[3]],
    language: "English"
  },
  {
    id: 9,
    title: "Fight Club",
    posterUrl: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg",
    year: 1999,
    rating: 8.8,
    runtime: "2h 19m",
    genre: ["Drama"],
    plot: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
    director: "David Fincher",
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter", "Meat Loaf"],
    trailerUrl: "https://www.youtube.com/embed/qtRKdVHc-cE",
    platforms: [platforms[0], platforms[2]],
    language: "English"
  },
  {
    id: 10,
    title: "The Godfather",
    posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    year: 1972,
    rating: 9.2,
    runtime: "2h 55m",
    genre: ["Crime", "Drama"],
    plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    director: "Francis Ford Coppola",
    cast: ["Marlon Brando", "Al Pacino", "James Caan", "Diane Keaton"],
    trailerUrl: "https://www.youtube.com/embed/sY1S34973zA",
    platforms: [platforms[1], platforms[3]],
    language: "English"
  },
  {
    id: 11,
    title: "3 Idiots",
    posterUrl: "https://m.media-amazon.com/images/I/81+39GHScpL._AC_SY679_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BMjM0N2QzYmUtZjlkYS00MDg5LWFmYzMtZWRhN2M4NWNhNzViXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    year: 2009,
    rating: 8.4,
    runtime: "2h 50m",
    genre: ["Comedy", "Drama"],
    plot: "Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.",
    director: "Rajkumar Hirani",
    cast: ["Aamir Khan", "Kareena Kapoor", "R. Madhavan", "Sharman Joshi"],
    trailerUrl: "https://www.youtube.com/embed/xvszmNXdM4w",
    platforms: [platforms[0], platforms[1]],
    language: "Hindi"
  },
  {
    id: 12,
    title: "Gully Boy",
    posterUrl: "https://m.media-amazon.com/images/I/81nXAJRqtzL._AC_SY679_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BOWU2NzQ0MTQtZmM4NS00YWRmLTgyYjgtMDMxNmNlODI2OGY5XkEyXkFqcGdeQXVyODAzNzAwOTg@._V1_.jpg",
    year: 2019,
    rating: 8.0,
    runtime: "2h 33m",
    genre: ["Drama", "Music"],
    plot: "A coming-of-age story based on the lives of street rappers in Mumbai.",
    director: "Zoya Akhtar",
    cast: ["Ranveer Singh", "Alia Bhatt", "Siddhant Chaturvedi"],
    trailerUrl: "https://www.youtube.com/embed/JfbxcD6biOk",
    platforms: [platforms[1], platforms[3]],
    language: "Hindi"
  },
  {
    id: 13,
    title: "Baahubali: The Beginning",
    posterUrl: "https://m.media-amazon.com/images/I/91I7WPkQYaL._AC_SY679_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BZDcwODBhYWQtYTQxNS00MjU2LThjYmItZTZiMjJlMDBjY2U0XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    year: 2015,
    rating: 8.0,
    runtime: "2h 39m",
    genre: ["Action", "Adventure", "Fantasy"],
    plot: "In ancient India, an adventurous and daring man becomes involved in a decades-old feud between two warring peoples.",
    director: "S.S. Rajamouli",
    cast: ["Prabhas", "Rana Daggubati", "Anushka Shetty", "Tamannaah"],
    trailerUrl: "https://www.youtube.com/embed/sOEg_YZQsTI",
    platforms: [platforms[2], platforms[1]],
    language: "Telugu"
  },
  {
    id: 14,
    title: "Jersey",
    posterUrl: "https://m.media-amazon.com/images/I/71oV4cL4jDL._AC_SY679_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BY2Y3OTUzYzItODViNy00NmZkLTg0MGItODdkODY1NGVmNzE2XkEyXkFqcGdeQXVyMTY2NTk2NDg3._V1_FMjpg_UX1000_.jpg",
    year: 2019,
    rating: 8.5,
    runtime: "2h 40m",
    genre: ["Drama", "Sport"],
    plot: "A failed cricketer decides to revive his career at the age of 36 for his son's wish.",
    director: "Gowtam Tinnanuri",
    cast: ["Nani", "Shraddha Srinath", "Harish Kalyan"],
    trailerUrl: "https://www.youtube.com/embed/poLpq-38UYs",
    platforms: [platforms[1], platforms[3]],
    language: "Telugu"
  },
  {
    id: 15,
    title: "Super Deluxe",
    posterUrl: "https://m.media-amazon.com/images/I/814TJ5YQs6L._AC_SY679_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BZjJkNGZhMmQtMmQ4Zi00Y2E3LWE4MTUtYTAzNzk4ZDYzOTkwXkEyXkFqcGdeQXVyNTAzNzgwNTg@._V1_.jpg",
    year: 2019,
    rating: 8.4,
    runtime: "2h 56m",
    genre: ["Drama", "Crime", "Thriller"],
    plot: "An unfaithful wife, an estranged father, and an angry boy must all face their demons on one fateful day.",
    director: "Thiagarajan Kumararaja",
    cast: ["Vijay Sethupathi", "Fahadh Faasil", "Samantha Ruth Prabhu", "Ramya Krishnan"],
    trailerUrl: "https://www.youtube.com/embed/xMpbN9yDDlU",
    platforms: [platforms[2], platforms[0]],
    language: "Tamil"
  },
  {
    id: 16,
    title: "Soorarai Pottru",
    posterUrl: "https://m.media-amazon.com/images/I/81vDOjVU+vL._AC_SY679_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BNDNmYzVkYjktYjQ5OC00Y2E3LWE4MTUtYTAzNzk4ZDYzOTkwXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg",
    year: 2020,
    rating: 8.7,
    runtime: "2h 33m",
    genre: ["Drama"],
    plot: "Inspired by the book 'Simply Fly', the story traces the rise of a common man from rural roots to an aviation entrepreneur.",
    director: "Sudha Kongara",
    cast: ["Suriya", "Aparna Balamurali", "Paresh Rawal"],
    trailerUrl: "https://www.youtube.com/embed/fa_DIwRsa9o",
    platforms: [platforms[1], platforms[2]],
    language: "Tamil"
  },
  {
    id: 17,
    title: "Parasite",
    posterUrl: "https://m.media-amazon.com/images/I/51zUbui+gbL._AC_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BYWZjMWE5ZjYtNTEwOC00MTFkLWEwNzEtYjljMGJhNzIzYWQwXkEyXkFqcGdeQXVyNjUxMjc1OTM@._V1_.jpg",
    year: 2019,
    rating: 8.6,
    runtime: "2h 12m",
    genre: ["Thriller", "Drama"],
    plot: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    director: "Bong Joon-ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    trailerUrl: "https://www.youtube.com/embed/5xH0HfJHsaY",
    platforms: [platforms[0], platforms[3]],
    language: "English"
  },
  {
    id: 18,
    title: "Interstellar",
    posterUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backdropUrl: "https://image.tmdb.org/t/p/original/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg",
    year: 2014,
    rating: 8.6,
    runtime: "2h 49m",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Matt Damon"],
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
    platforms: [platforms[0], platforms[1]],
    language: "English"
  },
  {
    id: 19,
    title: "Ocean's Eleven",
    posterUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backdropUrl: "https://image.tmdb.org/t/p/original/awAO4f8Bry4Pm4kRvDlJips8xAA.jpg",
    year: 2001,
    rating: 7.8,
    runtime: "1h 56m",
    genre: ["Crime", "Thriller"],
    plot: "Danny Ocean and his eleven accomplices plan to rob three Las Vegas casinos in a single night.",
    director: "Steven Soderbergh",
    cast: ["George Clooney", "Brad Pitt", "Julia Roberts", "Matt Damon"],
    trailerUrl: "https://www.youtube.com/embed/u18sSgOEV48",
    platforms: [platforms[0], platforms[1]],
    language: "English"
  },
  {
    id: 20,
    title: "The Green Mile",
    posterUrl: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backdropUrl: "https://image.tmdb.org/t/p/original/velWyPUMIPaRg1iRbDn1dABZSGN.jpg",
    year: 1999,
    rating: 8.6,
    runtime: "3h 9m",
    genre: ["Drama", "Crime", "Fantasy"],
    plot: "The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.",
    director: "Frank Darabont",
    cast: ["Tom Hanks", "Michael Clarke Duncan", "David Morse", "Bonnie Hunt"],
    trailerUrl: "https://www.youtube.com/embed/Bg7epsq9rYk",
    platforms: [platforms[1], platforms[3]],
    language: "English"
  }
];

export const trendingMovies = movies.slice(0, 8);

export const topRatedMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 8);

export const currentUser: User = {
  id: 1,
  name: "John Doe",
  username: "cinegeek",
  avatar: "https://i.pravatar.cc/150?img=32",
  bio: "Movie enthusiast and aspiring film critic. Love discussing cinema and finding hidden gems.",
  following: 85,
  followers: 120,
  watchlist: [1, 3, 5, 7],
  reviews: 42
};
