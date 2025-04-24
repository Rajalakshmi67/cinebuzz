import { Platform } from './movieData';

export interface TVShow {
  id: number;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  year: number;
  rating: number;
  seasons: number;
  episodes: number;
  genre: string[];
  plot: string;
  cast: string[];
  status: string;
  platforms: Platform[];
  trailerUrl: string;
}

// Sample TV shows data for development
export const tvShows: TVShow[] = [
  {
    id: 1,
    title: "Stranger Things",
    posterUrl: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    year: 2016,
    rating: 8.6,
    seasons: 4,
    episodes: 34,
    genre: ["Drama", "Sci-Fi & Fantasy", "Mystery"],
    plot: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    cast: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder", "David Harbour", "Gaten Matarazzo"],
    status: "Returning Series",
    platforms: [
      {
        name: "Netflix",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1280px-Netflix_2015_logo.svg.png",
        url: "https://netflix.com"
      }
    ],
    trailerUrl: "https://www.youtube.com/embed/b9EkMc79ZSU"
  },
  {
    id: 2,
    title: "Game of Thrones",
    posterUrl: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
    year: 2011,
    rating: 8.4,
    seasons: 8,
    episodes: 73,
    genre: ["Sci-Fi & Fantasy", "Drama", "Action & Adventure"],
    plot: "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north.",
    cast: ["Emilia Clarke", "Kit Harington", "Peter Dinklage", "Lena Headey", "Sophie Turner"],
    status: "Ended",
    platforms: [
      {
        name: "HBO Max",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/HBO_Max_Logo.svg/2560px-HBO_Max_Logo.svg.png",
        url: "https://hbomax.com"
      }
    ],
    trailerUrl: "https://www.youtube.com/embed/rlR4PJn8b8I"
  },
  {
    id: 3,
    title: "Breaking Bad",
    posterUrl: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    year: 2008,
    rating: 8.9,
    seasons: 5,
    episodes: 62,
    genre: ["Drama", "Crime"],
    plot: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn", "Dean Norris", "Jonathan Banks"],
    status: "Ended",
    platforms: [
      {
        name: "Netflix",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1280px-Netflix_2015_logo.svg.png",
        url: "https://netflix.com"
      }
    ],
    trailerUrl: "https://www.youtube.com/embed/HhesaQXLuRY"
  },
  {
    id: 4,
    title: "The Mandalorian",
    posterUrl: "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/9ijMGlJKqcslswWUzTEwScm82Gs.jpg",
    year: 2019,
    rating: 8.5,
    seasons: 3,
    episodes: 24,
    genre: ["Sci-Fi & Fantasy", "Action & Adventure", "Drama"],
    plot: "After the fall of the Galactic Empire, lawlessness has spread throughout the galaxy. A lone gunfighter makes his way through the outer reaches, earning his keep as a bounty hunter.",
    cast: ["Pedro Pascal", "Giancarlo Esposito", "Grogu", "Carl Weathers", "Katee Sackhoff"],
    status: "Returning Series",
    platforms: [
      {
        name: "Disney+",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/2560px-Disney%2B_logo.svg.png",
        url: "https://disneyplus.com"
      }
    ],
    trailerUrl: "https://www.youtube.com/embed/aOC8E8z_ifw"
  },
  {
    id: 5,
    title: "The Office",
    posterUrl: "https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/vNpuAxGTl9HsUbHqam3E9CzqCvX.jpg",
    year: 2005,
    rating: 8.6,
    seasons: 9,
    episodes: 201,
    genre: ["Comedy"],
    plot: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
    cast: ["Steve Carell", "John Krasinski", "Jenna Fischer", "Rainn Wilson", "B.J. Novak"],
    status: "Ended",
    platforms: [
      {
        name: "Peacock",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/NBCUniversal_Peacock_Logo.svg/1200px-NBCUniversal_Peacock_Logo.svg.png",
        url: "https://peacocktv.com"
      },
      {
        name: "Netflix",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1280px-Netflix_2015_logo.svg.png",
        url: "https://netflix.com"
      }
    ],
    trailerUrl: "https://www.youtube.com/embed/LHOtME2DL4g"
  }
]; 