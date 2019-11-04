import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getMangas } from '../../actions/libraryActions';
import { useHistory, Link } from 'react-router-dom';

import classes from './Library.module.scss';

const Library = (props) => {
  useEffect(() => {
    props.getMangas();
  }, []);

  let history = useHistory();

  const onMangaClick = (id) => {
    
    history.push("/manga-info/" + id);
  }

  return (
    <div>
      <Link to="/editor">Editor</Link>
      <div className={classes['library-container']}>
        {props.library.mangas.map(manga => (
          <div key={manga.id} className={classes['manga-container']}>
            <div 
              className={classes['manga-cover-container']}
              onClick={onMangaClick.bind(this, manga.id)}
            >
              <img
                className={classes['manga-cover-image'] + ' hover'}
                src={"file:///library/" + manga.id + "/" + manga.cover} 
                alt={manga.id}
              />
            </div>
            <div className={classes['manga-title']}>{manga.title}</div>
          </div>
        ))}
      </div>
    </div>

  );
};

const mapStateToProps = (state) => ({
  library: state.library
});

export default connect(mapStateToProps, { getMangas })(Library);