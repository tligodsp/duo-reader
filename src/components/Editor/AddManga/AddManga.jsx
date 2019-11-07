import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Col, Button, Alert, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useFormik } from 'formik';

import { getMangas } from '../../../actions/libraryActions';
import { InputGroupAppend } from 'react-bootstrap/InputGroup';
const { ipcRenderer } = window.require("electron");
const { dialog } = window.require("electron").remote;

const AddManga = (props) => {

  const validate = values => {
    const errors = {};

    if (!values.id) {
      errors.id = 'Required';
    }
    else {
      const mangas = props.library.mangas;
      if (!(mangas.findIndex(manga => manga.id === values.id) === -1)) {
        errors.id = 'Id already exists';
      }
    }

    if (!values.title) {
      errors.title = 'Required';
    }

    const d = new Date();

    if (values.publishYear && !/^\d+$/.test(values.publishYear)) {
      errors.publishYear = 'Numbers only plz';
    }
    else if (values.publishYear && parseInt(values.publishYear, 10) < 1900) {
      errors.publishYear = 'Wtf is this ancient shit?';
    }
    else if (values.publishYear && parseInt(values.publishYear, 10) > d.getFullYear()) {
      errors.publishYear = 'Wow hello there time traveler';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      id: '',
      title: '',
      author: '',
      artist: '',
      cover: '',
      description: '',
      genres: '',
      publishYear: '',
      publishStatus: ''
    },
    validate,
    onSubmit: values => {
      if (values.author === "") {
        values.author = "None";
      }
      if (values.artist === "") {
        values.artist = "None";
      }
      if (values.cover === "") {
        values.cover = "covers/default_cover.jpg";
      }
      if (values.genres === "") {
        values.genres = ["None"];
      }
      if (values.description === "") {
        values.description = "None";
      }
      if (values.publishYear === "") {
        values.publishYear = "1970";
      }
      if (values.publishStatus === "") {
        values.publishStatus = "Ongoing";
      }
      alert(JSON.stringify(values, null, 2));
      ipcRenderer.send("manga:saveFile", values);
    }
  });

  useEffect(() => {
    props.getMangas();
  }, []);

  const test = () => {
    console.log();
  }

  const onCoverButtonClick = () => {
    const coverPath = dialog.showOpenDialog({ properties: ['openFile'] }) ? 
                        dialog.showOpenDialog({ properties: ['openFile'] })[0].replace(/\\/g,"/")
                        : '';
    // console.log(coverPath);
    formik.setValues({
      ...formik.values,
      cover: coverPath
    })
  }

  return (
    <div>
      <Link to="/editor">Back</Link>
      {/* <div style={{ color: "white" }}>{formData.title} {formData.author} {formData.artist}</div> */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ minWidth: "600px", color: "white" }}>
          <Alert variant="danger" style={{ width: "600px" }} show={false}>
            <Alert.Heading>Éc</Alert.Heading>
            <p>
              Change this and that and try again. Duis mollis, est non commodo
              luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
              Cras mattis consectetur purus sit amet fermentum.
            </p>
          </Alert>
          <Button onClick={test}>Click</Button>
          <Form onSubmit={formik.handleSubmit}>
              <Form.Group>
                <Form.Label>Id</Form.Label>
                <Form.Control
                  id="id"
                  name="id"
                  placeholder="Manga Id (This will be used for manga directory)" 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.id}
                  isInvalid={formik.touched.id && formik.errors.id}
                  isValid={formik.touched.id && !formik.errors.id}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.id}</Form.Control.Feedback>
                <Form.Control.Feedback type="valid">Looking cool Joker</Form.Control.Feedback>
              {/* {formik.touched.id && formik.errors.id ? 
                <Form.Control.Feedback type="invalid">{formik.errors.id}</Form.Control.Feedback> : null
              } */}
              </Form.Group>

              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  id="title" 
                  name="title" 
                  placeholder="Manga Title" 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.title}
                  isInvalid={formik.touched.title && formik.errors.title}
                  isValid={formik.touched.title && !formik.errors.title}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.title}</Form.Control.Feedback>
                <Form.Control.Feedback type="valid">Looking cool Joker</Form.Control.Feedback>
              </Form.Group>

            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Author</Form.Label>
                <Form.Control
                  id="author"
                  name="author" 
                  placeholder="Author Name" 
                  onChange={formik.handleChange}
                  value={formik.values.author}
                />
                <Form.Control.Feedback type="invalid">
              Please choose a username.
            </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Artist</Form.Label>
                <Form.Control
                  id="artist"
                  name="artist" 
                  placeholder="Artist Name" 
                  onChange={formik.handleChange}
                  value={formik.values.artist}
                />
              </Form.Group>
            </Form.Row>

            <Form.Group>
              <Form.Label>Cover Image</Form.Label>
              <InputGroup>
                <Form.Control
                  id="cover"
                  name="cover"
                  placeholder="Cover Image Path" 
                  onChange={formik.handleChange}
                  value={formik.values.cover}
                />
                <InputGroup.Append>
                  <Button variant="secondary" onClick={onCoverButtonClick}>...</Button>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>

            <Form.Group>
              <Form.Label>Genres</Form.Label>
              <Form.Control
                id="genres"
                name="genres"
                placeholder="List Genres, seperated by comma (temporary, will make it easier later)" 
                onChange={formik.handleChange} 
                value={formik.values.genres}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Manga Description</Form.Label>
              <Form.Control 
                as= "textarea"
                rows="4"
                id="description"
                name="description"
                placeholder="Manga Description" 
                onChange={formik.handleChange}
                value={formik.values.description}
              />
            </Form.Group>

            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Publish Year</Form.Label>
                <Form.Control
                  id="publishYear"
                  name="publishYear"
                  placeholder="Publish Year" 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.publishYear}
                  isInvalid={formik.touched.publishYear && formik.errors.publishYear}
                  isValid={formik.touched.publishYear && !formik.errors.publishYear}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.publishYear}</Form.Control.Feedback>
                <Form.Control.Feedback type="valid">Looking cool Joker</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Publish Status</Form.Label>
                <Form.Control
                  id="publishStatus"
                  name="publishStatus"
                  placeholder="Publish Status" 
                  onChange={formik.handleChange}
                  value={formik.values.publishStatus}
                />
              </Form.Group>
            </Form.Row>

            <Button 
              variant="primary" 
              style={{ float: "right" }}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  library: state.library
});

export default connect(mapStateToProps, { getMangas })(AddManga);