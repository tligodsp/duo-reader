import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

const Editor = (props) => {
  return (
    <div>
      <Link to="/" style={{ marginRight: "20px" }}>Back</Link>
      <Link to="/editor/add-manga">Add Manga</Link>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="path">Path</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder="Input path"
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </InputGroup>
    </div>
  );
};

export default Editor;