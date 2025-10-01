import { useState, Fragment } from 'react';
import { Navbar , Main, Results, ListBox } from './components';
import { tempWatchedData, tempMovieData } from './data/data';
import './App.css'

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
	const [watched, setWatched] = useState(tempWatchedData);

  return (
    <Fragment>
      <Navbar>
        <Results watchedMovies={movies}/>
      </Navbar>
      <Main>
        <ListBox moviesData={movies} />
        <ListBox moviesData={watched} showSummary />
      </Main>
    </Fragment>
  );
}
