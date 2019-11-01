import React from 'react';
import { Link, useParams } from 'react-router-dom';

const MangaInfo = () => {
  let { id } = useParams();
  return (
    <div>
      <Link to="/">Back</Link>
      <div>{id}</div>
    </div>
  );
};

export default MangaInfo;