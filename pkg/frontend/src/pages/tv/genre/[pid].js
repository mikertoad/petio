import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import NotFound from '../../404';
import Grid from '../../../components/grid';
import Hero from '../../../components/hero';
import Meta from '../../../components/meta';
import { matchGenre } from '../../../helpers/genres';
import media from '../../../services/media.service';
import hero from '../../../styles/components/hero.module.scss';
import typo from '../../../styles/components/typography.module.scss';
import styles from '../../../styles/views/genre.module.scss';

export default function Genre({ newNotification }) {
  const [genreName, setGenreName] = useState('');
  const [shows, setShows] = useState(false);
  const [total, setTotal] = useState(1);
  const [featuredShow, setfeaturedShow] = useState(false);
  const { pid } = useParams();
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(null);

  useEffect(() => {
    async function getGenreDetails() {
      try {
        const genreMatch = matchGenre('tv', pid);
        if (!genreMatch || !genreMatch.query) throw 'not found';
        setGenreName(genreMatch.name);
        setQuery(genreMatch.query);
        const showsLookup = await media.lookup('show', 1, genreMatch.query);
        setShows(showsLookup.results);
        setTotal(showsLookup.totalPages);
        setfeaturedShow(showsLookup.results[0]);
      } catch (e) {
        console.log(e);
        setGenreName('error');
      }
    }

    getGenreDetails();
  }, [pid]);

  useEffect(() => {
    async function loadMore() {
      if (loadingMore || !query || page === total) return;
      setLoadingMore(true);
      const showsLookup = await media.lookup('show', page + 1, query);
      setShows([...shows, ...showsLookup.results]);
      setPage(page + 1);
      setLoadingMore(false);
    }

    function handleScroll() {
      if (
        window.innerHeight * 2 + window.scrollY >=
        document.body.offsetHeight
      ) {
        // you're at the bottom of the page
        loadMore();
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadingMore, query, page, total, shows]);

  if (genreName === 'error') return <NotFound />;

  return (
    <div className={styles.wrap} key={`genre_single_show_${pid}`}>
      {!genreName ? (
        <>
          <Meta title="Loading" />
          <div className={`${hero.discovery} ${hero.genre}`}>
            <div className="container">
              <div
                className={`${hero.discovery__content} ${hero.genre__content}`}
              >
                <div className={hero.genre__title}>
                  <p className={`${typo.xltitle} ${typo.bold}`}>Loading</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Meta title={genreName} />
          <div className={`${hero.discovery} ${hero.genre}`}>
            <div className="container">
              <div
                className={`${hero.discovery__content} ${hero.genre__content}`}
              >
                <div className={hero.genre__title}>
                  <p className={`${typo.xltitle} ${typo.bold}`}>
                    {genreName} TV
                  </p>
                </div>
              </div>
            </div>
            <div className={hero.genre__background}>
              {featuredShow ? (
                <Hero
                  className={hero.discovery__image}
                  image={featuredShow.backdrop_path}
                />
              ) : null}
            </div>
          </div>
          <Grid
            title={`${genreName} Shows`}
            data={shows}
            type="tv"
            key={`genre_${pid}_shows`}
            id={`genre_${pid}_shows`}
            newNotification={newNotification}
          />
        </>
      )}
    </div>
  );
}
