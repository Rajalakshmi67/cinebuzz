
// TV Shows data organized by language categories
export interface TVShow {
  id: number;
  title: string;
  poster: string;
  rating: number;
  year: number;
  language: string;
  genre: string[];
  seasons: number;
  episodes: number;
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  synopsis: string;
  platform: string[];
}

// Sample TV shows data
export const tvShows: TVShow[] = [
  // English Shows
  {
    id: 101,
    title: "Stranger Things",
    poster: "https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    rating: 8.7,
    year: 2016,
    language: "English",
    genre: ["Drama", "Fantasy", "Horror"],
    seasons: 5,
    episodes: 34,
    status: "Ongoing",
    synopsis: "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.",
    platform: ["Netflix"]
  },
  {
    id: 102,
    title: "Game of Thrones",
    poster: "https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_.jpg",
    rating: 9.2,
    year: 2011,
    language: "English",
    genre: ["Action", "Adventure", "Drama"],
    seasons: 8,
    episodes: 73,
    status: "Completed",
    synopsis: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    platform: ["HBO Max", "Disney+"]
  },
  {
    id: 103,
    title: "Breaking Bad",
    poster: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
    rating: 9.5,
    year: 2008,
    language: "English",
    genre: ["Crime", "Drama", "Thriller"],
    seasons: 5,
    episodes: 62,
    status: "Completed",
    synopsis: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.",
    platform: ["Netflix", "Prime Video"]
  },
  {
    id: 104,
    title: "The Crown",
    poster: "https://m.media-amazon.com/images/M/MV5BZWNkOWM5YTEtNGIwMC00NTFjLTk1MWYtNDQ0NjQzMTA2MzU0XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
    rating: 8.7,
    year: 2016,
    language: "English",
    genre: ["Biography", "Drama", "History"],
    seasons: 6,
    episodes: 60,
    status: "Completed",
    synopsis: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    platform: ["Netflix"]
  },
  
  // Hindi Shows
  {
    id: 201,
    title: "Sacred Games",
    poster: "https://m.media-amazon.com/images/M/MV5BMjJlMjJlMzYtNmU5Yy00N2MwLWJmMjEtNWUwZWIyMGViZDgyXkEyXkFqcGdeQXVyOTAzMTc2MjA@._V1_.jpg",
    rating: 8.6,
    year: 2018,
    language: "Hindi",
    genre: ["Action", "Crime", "Drama"],
    seasons: 2,
    episodes: 16,
    status: "Completed",
    synopsis: "A link in their pasts leads an honest cop to a fugitive gang boss, whose cryptic warning spurs the officer on a quest to save Mumbai from cataclysm.",
    platform: ["Netflix"]
  },
  {
    id: 202,
    title: "Mirzapur",
    poster: "https://m.media-amazon.com/images/M/MV5BN2NlM2Y5Y2MtYjU5Mi00ZjZiLWEwNzItMmUyNmRiZWQ4ZWI2XkEyXkFqcGdeQXVyODQ5NDUwMDk@._V1_.jpg",
    rating: 8.4,
    year: 2018,
    language: "Hindi",
    genre: ["Action", "Crime", "Drama"],
    seasons: 3,
    episodes: 29,
    status: "Ongoing",
    synopsis: "A shocking incident at a wedding procession ignites a series of events entangling the lives of two families in the lawless city of Mirzapur.",
    platform: ["Prime Video"]
  },
  {
    id: 203,
    title: "Scam 1992",
    poster: "https://m.media-amazon.com/images/M/MV5BNjgxZTMxNmEtZGRiOC00YWNiLTkwMDYtMGYxY2FkNmFmOGJhXkEyXkFqcGdeQXVyMTI1NDEyNTM5._V1_FMjpg_UX1000_.jpg",
    rating: 9.3,
    year: 2020,
    language: "Hindi",
    genre: ["Biography", "Crime", "Drama"],
    seasons: 1,
    episodes: 10,
    status: "Completed",
    synopsis: "The story of Harshad Mehta, a stockbroker who took the stock market to dizzying heights and his catastrophic downfall.",
    platform: ["SonyLIV"]
  },
  {
    id: 204,
    title: "The Family Man",
    poster: "https://m.media-amazon.com/images/M/MV5BZjZkY2YxYTgtYmVkMC00NTgwLTkwMGItNmY1N2Q4NGQyNmRmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    rating: 8.7,
    year: 2019,
    language: "Hindi",
    genre: ["Action", "Comedy", "Drama"],
    seasons: 2,
    episodes: 19,
    status: "Ongoing",
    synopsis: "A middle-class man who works for a special cell of the National Investigation Agency while trying to protect his family from the impact of his secretive, high-pressure, and low paying job.",
    platform: ["Prime Video"]
  },
  
  // Telugu Shows
  {
    id: 301,
    title: "Kota Factory",
    poster: "https://m.media-amazon.com/images/M/MV5BODljYzNlZTctYTdkZS00YzY3LWEyN2EtMmRkMzNkNzk4YTZlXkEyXkFqcGdeQXVyMTI1NDEyNTM5._V1_.jpg",
    rating: 9.2,
    year: 2019,
    language: "Telugu",
    genre: ["Drama"],
    seasons: 2,
    episodes: 15,
    status: "Ongoing",
    synopsis: "Dedicated to Kota coaching industry and the life of students studying there, trying to get into top engineering colleges of India.",
    platform: ["Netflix"]
  },
  {
    id: 302,
    title: "Panchayat",
    poster: "https://m.media-amazon.com/images/M/MV5BMTllYzQ0MzctZTI4Ny00MDcwLTljYmQtMGU5MTdhZDRmOTVkXkEyXkFqcGdeQXVyNDI3NjU1NzQ@._V1_.jpg",
    rating: 8.9,
    year: 2020,
    language: "Telugu",
    genre: ["Comedy", "Drama"],
    seasons: 3,
    episodes: 24,
    status: "Ongoing",
    synopsis: "A comedy-drama series capturing the journey of an engineering graduate who becomes a Panchayat secretary in a remote village due to lack of better job options.",
    platform: ["Prime Video"]
  },
  {
    id: 303,
    title: "Geetha Subramanyam",
    poster: "https://m.media-amazon.com/images/M/MV5BMmRmZDViM2YtNTcyOC00MGI2LWI5MTEtOTIwYjQ0ODkzODcyXkEyXkFqcGdeQXVyMTI2ODM0ODM5._V1_.jpg",
    rating: 8.3,
    year: 2016,
    language: "Telugu",
    genre: ["Romance", "Comedy"],
    seasons: 2,
    episodes: 20,
    status: "Completed",
    synopsis: "The story revolves around a couple who are in a relationship but constantly fight with each other.",
    platform: ["YouTube"]
  },
  {
    id: 304,
    title: "Chadarangam",
    poster: "https://m.media-amazon.com/images/M/MV5BNWM4YzMzY2EtNmY0NC00Y2UzLWJiZGYtMGExY2ZkZmUyZDg5XkEyXkFqcGdeQXVyMTIzMzg0MTM2._V1_.jpg",
    rating: 8.5,
    year: 2020,
    language: "Telugu",
    genre: ["Drama", "Political"],
    seasons: 1,
    episodes: 10,
    status: "Completed",
    synopsis: "A political drama set in the backdrop of Andhra Pradesh's politics in the 1980s, focusing on power struggles.",
    platform: ["ZEE5"]
  },
  
  // Tamil Shows
  {
    id: 401,
    title: "Vella Raja",
    poster: "https://m.media-amazon.com/images/M/MV5BNWJlZDZlYTktYWY5YS00ZWQ0LTk4YzctMDcyYzgzMWI1YzUxXkEyXkFqcGdeQXVyODIwMDI1NjM@._V1_.jpg",
    rating: 7.8,
    year: 2018,
    language: "Tamil",
    genre: ["Action", "Crime", "Thriller"],
    seasons: 1,
    episodes: 8,
    status: "Completed",
    synopsis: "A drug lord hiding in a rundown lodge struggles to escape from the cops, but gets entangled with the guests and the hotel owner.",
    platform: ["Prime Video"]
  },
  {
    id: 402,
    title: "Vadhandhi",
    poster: "https://m.media-amazon.com/images/M/MV5BZWRmZGEwYmUtMGEwYy00ZTc0LWJmNGYtMDk0ZWVkZjQ4YzZhXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
    rating: 8.3,
    year: 2022,
    language: "Tamil",
    genre: ["Crime", "Drama", "Mystery"],
    seasons: 1,
    episodes: 8,
    status: "Completed",
    synopsis: "A determined cop investigates the murder of a beautiful young woman, plunging him into the dark world of obsession, deception, and scandal.",
    platform: ["Prime Video"]
  },
  {
    id: 403,
    title: "Suzhal: The Vortex",
    poster: "https://m.media-amazon.com/images/M/MV5BNzMwNjM1MjItYzljNS00ZWQzLWIxMTQtMzFlNmJlYTVjMWQwXkEyXkFqcGdeQXVyMTI1NDEyNTM5._V1_.jpg",
    rating: 8.2,
    year: 2022,
    language: "Tamil",
    genre: ["Crime", "Drama", "Mystery"],
    seasons: 1,
    episodes: 8,
    status: "Completed",
    synopsis: "When a young girl goes missing during a festival, her disappearance sets off a chain of events that unravel dark secrets of a small industrial town.",
    platform: ["Prime Video"]
  },
  {
    id: 404,
    title: "Ethirneechal",
    poster: "https://m.media-amazon.com/images/M/MV5BMTQ4MjcyMzYtMmM3Yi00N2Q0LWJhYzktODQ0ZWIwMDliMWE5XkEyXkFqcGdeQXVyMTQ3Mzk2MDg4._V1_.jpg",
    rating: 7.9,
    year: 2022,
    language: "Tamil",
    genre: ["Drama", "Family"],
    seasons: 1,
    episodes: 15,
    status: "Completed",
    synopsis: "A story about the struggles and triumphs of three women from different backgrounds who come together in their fight against societal norms.",
    platform: ["Disney+ Hotstar"]
  }
];
