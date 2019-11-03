import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getPageFullPath } from '../../utils/helpers';
import { getChapterContent, chapterClear } from '../../actions/chapterActions';
import classes from './Reader.module.scss';

const ReadingPage = (props) => {
  const [ pages, setPages ] = useState([]);
  let { mangaId, chapterId } = useParams();
  
  const { chapter } = props.chapter;

  useEffect(() => {
    props.getChapterContent(mangaId, chapterId);
    console.log(chapter);
    return () => {
      props.chapterClear();
    }
  }, []);

  useEffect(() => {
    if (!props.chapter.loading && 
        chapter.imgPaths && 
        chapter.imgPaths.length === chapter.languages.length && 
        pages.length === 0) {
      let tmpPageArray = [];
      for (let pagePath of chapter.imgPaths[0]) {
        tmpPageArray = [ ...tmpPageArray, { pagePath: pagePath, language: chapter.languages[0] } ];
      }
      setPages([ ...tmpPageArray ]);
    }
    // console.log(props.chapter.loading);
  })

  const switchPageLanguage = (page) => {
    const pageIndex = pages.indexOf(page);
    // console.log(pageIndex);
    var tmpPages = [ ...pages ];
    if (page.language === chapter.languages[0]) {
      tmpPages[pageIndex].language = chapter.languages[1];
      tmpPages[pageIndex].pagePath = chapter.imgPaths[1][pageIndex];
    }
    else {
      tmpPages[pageIndex].language = chapter.languages[0];
      tmpPages[pageIndex].pagePath = chapter.imgPaths[0][pageIndex];
    }
    setPages([ ...tmpPages ]);
  }

  return (
    <div>
      <Link to={`/manga-info/${mangaId}`}>
        Back
      </Link>
      <div className={classes['pages-container']}>
        { 
          pages.map(page => (
            <div className={classes['manga-page-container']}>
              <img
                src={getPageFullPath(mangaId, chapterId, page.language, page.pagePath )} 
                alt={page.pagePath}
                className={classes['manga-page']}
                onClick={switchPageLanguage.bind(this, page)}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  chapter: state.chapter,
});

export default connect(mapStateToProps, { getChapterContent, chapterClear })(ReadingPage);