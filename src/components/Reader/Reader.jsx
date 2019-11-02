import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getPageFullPath } from '../../utils/helpers';
import { getChapterContent } from '../../actions/chapterActions';

const ReadingPage = (props) => {
  const [ pages, setPages ] = useState([]);
  let { mangaId, chapterId } = useParams();
  
  const { chapter } = props.chapter;

  useEffect(() => {
    props.getChapterContent(mangaId, chapterId);
  }, []);

  useEffect(() => {
    if (chapter.enImgPaths && chapter.jpImgPaths && pages.length === 0) {
      let tmpPageArray = [];
      for (let pagePath of chapter.jpImgPaths) {
        tmpPageArray = [ ...tmpPageArray, { pagePath: pagePath, language: 'jp' } ];
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
      tmpPages[pageIndex].pagePath = chapter.enImgPaths[pageIndex];
    }
    else {
      tmpPages[pageIndex].language = chapter.languages[0];
      tmpPages[pageIndex].pagePath = chapter.jpImgPaths[pageIndex];
    }
    setPages([ ...tmpPages ]);
  }

  return (
    <div>
      <Link to={`/manga-info/${mangaId}`}>
        Back
      </Link>
      <div>
        { 
          pages.map(page => (
            <div>
              <img
                src={getPageFullPath(mangaId, chapterId, page.language, page.pagePath )} 
                alt={page.pagePath}
                style={{ width: "960px" }}
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

export default connect(mapStateToProps, { getChapterContent })(ReadingPage);