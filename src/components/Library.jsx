import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getMangas } from '../actions/libraryActions';

const Library = (props) => {
  useEffect(() => {
    props.getMangas();
  }, []);
  return (
    <div style={{ display: "flex" }}>
      {props.library.mangas.map(manga => (
        <div style={{ margin: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img 
            src={"file:///library/" + manga.id + "/" + manga.cover} 
            alt={manga.id}
            style={{ width: 190, height: 300, borderRadius: "5%" }}
          />
          <div style={{ color: "white" }}>{manga.title}</div>
          <div style={{ color: "white" }}>{manga.id}</div>
        </div>
      ))}
    </div>

  );
};

const mapStateToProps = (state) => ({
  library: state.library
});

export default connect(mapStateToProps, { getMangas })(Library);