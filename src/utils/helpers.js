export const getCoverFullPath = (id, cover) => {
  return "file:///library/" + id + "/" + cover;
};

export const getPageFullPath = (mangaId, chapterId, language, imgPath) => {
  return `file:///library/${mangaId}/chapters/${chapterId}/${language}/${imgPath}`;
}

export const comparePageNum = (imgPath1, imgPath2) => {
  // extract number sequences in strings
  var matches1 = imgPath1.match(/(\d+)/g);
  var matches2 = imgPath2.match(/(\d+)/g);

  if (matches1.length === 0 || matches2.length === 0) {
    if (imgPath1 === imgPath2) {
      return 0;
    }
    return imgPath1 > imgPath2 ? 1 : -1;
  }

  //compare the last number sequence
  var num1 = parseInt(matches1[matches1.length - 1], 10);
  var num2 = parseInt(matches2[matches2.length - 1], 10);
  
  if (num1 === num2) {
    return 0;
  }

  return num1 > num2 ? 1 : -1;
}
