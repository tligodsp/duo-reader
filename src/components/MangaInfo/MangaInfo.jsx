import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';
import classes from './MangaInfo.module.scss';
import { getCoverFullPath } from '../../utils/helpers';

import { getCurrentManga } from '../../actions/mangaActions';

const MangaInfo = (props) => {
  let { id } = useParams();

  useEffect(() => {
    props.getCurrentManga(id);
  }, []);

  const { manga } = props.manga;

  return (
    <div>
      <Link to="/">Back</Link>
      {/* <div>{id}</div>
      <div>{props.manga.manga.description}</div> */}
      <Card className={classes['manga-info-card']} bg="dark" text="white" border="dark">
        <Card.Header>{manga.title}</Card.Header>
        <Card.Body>
          <div className={classes['manga-info-container']}>
            <div className={classes['manga-cover-container']}>
              <img 
                src={getCoverFullPath(manga.id, manga.cover)} 
                alt={manga.id}
                className={classes['manga-cover-img']} 
              />  
            </div>
            <div className={classes['manga-detail-container']}>

              {/* alt names */}
              <div className={classes['manga-detail-item']}>
                <div className={classes['item-name']}>Alt name(s)</div>
                <div className={classes['item-content']}>{manga.title}</div>
              </div>
              <div className={classes['line']}></div>

              {/* author */}
              <div className={classes['manga-detail-item']}>
                <div className={classes['item-name']}>Author</div>
                <div className={classes['item-content']}>{manga.author}</div>
              </div>
              <div className={classes['line']}></div>

              {/* artist */}
              <div className={classes['manga-detail-item']}>
                <div className={classes['item-name']}>Artist</div>
                <div className={classes['item-content']}>{manga.artist}</div>
              </div>
              <div className={classes['line']}></div>

              {/* genre */}
              <div className={classes['manga-detail-item']}>
                <div className={classes['item-name']}>Genre(s)</div>
                <div className={classes['item-content']}>
                  {
                    manga.genres ? 
                      manga.genres.map(genre => (
                        <div className={classes['genre']} >{genre}</div>  
                      )) 
                    : null
                  }
                </div>
              </div>
              <div className={classes['line']}></div>

              {/* description */}
              <div className={classes['manga-detail-item']}>
                <div className={classes['item-name']}>Description</div>
                <div className={classes['item-content']}>{manga.description}</div>
              </div>
              <div className={classes['line']}></div>

              {/* released */}
              <div className={classes['manga-detail-item']}>
                <div className={classes['item-name']}>Released</div>
                <div className={classes['item-content']}>{manga.publishYear}</div>
              </div>
              <div className={classes['line']}></div>

              {/* publish status */}
              <div className={classes['manga-detail-item']}>
                <div className={classes['item-name']}>Pub. Status</div>
                <div className={classes['item-content']}>{manga.publishStatus}</div>
              </div>
              
            </div>
          </div>
          <hr style={{ height: "1px", color: "black", backgroundColor: "#222" }}></hr>
          <Link className={classes['chapters-container']}>
            { 
              manga.chapters?
                manga.chapters.map(chapter => (
                <div>Vol. {chapter.volumeNumber} Ch.{chapter.chapterNumber} - {chapter.title}</div>
                ))
              : null 
            }
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => ({
  manga: state.manga
});

export default connect(mapStateToProps, { getCurrentManga })(MangaInfo);