import { GET_CHAPTER_CONTENT, CHAPTER_CONTENT_LOADING } from './types';
import { comparePageNum } from '../utils/helpers';
const { ipcRenderer } = window.require("electron");

export const getChapterContent = (mangaId, chapterId) => dispatch => {
  dispatch(chapterContentLoading());
  ipcRenderer.send("chapter:getContent", { mangaId, chapterId });

  ipcRenderer.on("chapter:content", (event, chapterContent) => {
    if (chapterContent.enImgPaths && chapterContent.jpImgPaths) {
      chapterContent.enImgPaths.sort((path1, path2) => comparePageNum(path1, path2));
      chapterContent.jpImgPaths.sort((path1, path2) => comparePageNum(path1, path2));
      
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
  }
};