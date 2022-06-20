import React, { useEffect, useState } from "react";
import "./styles.css";
import Tmdb from "./Tmdb.js";
import MovieRow from "./components/MovieRow/index.js";
import FeaturedMovie from "./components/FeaturedMovies";
import Header from "./components/Header";

export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    //lista total
    const loadAll = async () => {
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //lista dos featureds
      let originals = list.filter((i) => i.slug === "originals");
      let randomChoise = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      );
      let choise = originals[0].items.results[randomChoise];
      let choiseInfo = await Tmdb.getMovieInfo(choise.id, "tv");
      setFeaturedData(choiseInfo);
    };
    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };
    window.addEventListener("scroll", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return (
    <div className="page">
      <Header black={blackHeader} />

      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Developed by Guilhermerisu <br /> Database Themoviedb.org
      </footer>

      {movieList.length <= 0 && (
        <div className="loading">
          <img
            src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif"
            alt="carregando"
          />
        </div>
      )}
    </div>
  );
};
