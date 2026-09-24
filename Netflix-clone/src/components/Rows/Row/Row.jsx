import React, { useEffect, useState } from 'react';
import "./Row.css";
import axios from "../../../utils/axios";
import movieTrailer from 'movie-trailer';
import YouTube from 'react-youtube';

const Row = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  const base_url = "https://image.tmdb.org/t/p/original";

  useEffect(() => {
    async function fetchData() {
      if (!fetchUrl) return;
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results || []);
      } catch (error) {
        console.log("error", error);
      }
    }
    fetchData();
  }, [fetchUrl]);

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl('');
    } else {
      movieTrailer(movie?.title || movie?.name || movie?.original_name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get('v'));
        })
        .catch((error) => console.log(error));
    }
  };

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row__posters">
        {movies?.map((movie) => {
          const imagePath = isLargeRow ? movie.poster_path : movie.backdrop_path;
          
          if (!imagePath) return null;

          return (
            <img 
              key={movie.id}
              onClick={() => handleClick(movie)}
              src={`${base_url}${imagePath}`} 
              alt={movie.name || movie.title} 
              className={`row__poster ${isLargeRow ? "row__posterLarge" : ""}`}
            />  
          );
        })}
      </div>

      {trailerUrl && (
        <div style={{ padding: '40px 0' }}>
          <YouTube videoId={trailerUrl} opts={opts} />
        </div>
      )}
    </div>
  );
};

export default Row;