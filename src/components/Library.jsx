import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getMangas } from '../actions/libraryActions';

const Library = (props) => {
  useEffect(() => {
    props.getMangas();
  }, []);
  return (
    <div>
      {props.library.mangas.map(manga => (
        <div>{manga}</div>
      ))}
    </div>

  );
};

const mapStateToProps = (state) => ({
  library: state.library
});

export default connect(mapStateToProps, { getMangas })(Library);