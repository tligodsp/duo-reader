import { GET_CHAPTER_CONTENT, CHAPTER_CONTENT_LOADING, CHAPTER_CLEAR } from './types';
import { comparePageNum } from '../utils/helpers';
const { ipcRenderer } = window.require("electron");

export const getChapterContent = (mangaId, chapterId) => dispatch => {
  dispatch(chapterContentLoading());
  ipcRenderer.send("chapter:getContent", { mangaId, chapterId });

  ipcRenderer.on("chapter:content", (event, chapterContent) => {
    if (chapterContent.imgPaths.length === chapterContent.languages.length) { //done loading all languages
      // chapterContent.enImgPaths.sort((path1, path2) => comparePageNum(path1, path2));
      // chapterContent.jpImgPaths.sort((path1, path2) => comparePageNum(path1, path2));
      chapterContent.imgPaths = chapterContent.imgPaths.map(images => images.sort((path1, path2) => comparePageNum(path1, path2)));
      
      dispatch({
        type: GET_CHAPTER_CONTENT,
        payload: chapterContent
      });
    }
  });
}; 

export const chapterContentLoading = () => {
  return {
    type: CHAPTER_CONTENT_LOADING
  };
};

export const chapterClear = () => {
  return {
    type: CHAPTER_CLEAR
  };
};