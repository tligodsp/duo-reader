import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Col, Button } from 'react-bootstrap';

const AddManga = (props) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    artist: '',
    description: '',
    genres: '',
    publishYear: '',
    publishStatus: ''
  });

  const handleChange = (event) => {
    console.log(event.target);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

  };

  return (
    <div>
      <Link to="/editor">Back</Link>
      <div style={{ color: "white" }}>{formData.title} {formData.author} {formData.artist}</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ minWidth: "600px", color: "white" }}>
          <Form>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control name="title" placeholder="Manga Title" onChange={handleChange}/>
              </Form.Group>

            <Form.Row>
              <Form.Group as={Col} controlId="author">
                <Form.Label>Author</Form.Label>
                <Form.Control name="author" placeholder="Author Name" onChange={handleChange}/>
              </Form.Group>

              <Form.Group as={Col} controlId="artist">
                <Form.Label>Artist</Form.Label>
                <Form.Control name="artist" placeholder="Artist Name" onChange={handleChange}/>
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="cover">
              <Form.Label>Cover Image</Form.Label>
              <Form.Control placeholder="Cover Image Path" onChange={handleChange}/>
            </Form.Group>

            <Form.Group controlId="genres">
              <Form.Label>Genres</Form.Label>
              <Form.Control placeholder="List Genres, seperated by comma (temporary, will make it easier later)" />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Manga Description</Form.Label>
              <Form.Control as= "textarea" rows="4" placeholder="Manga Description" onChange={handleChange}/>
            </Form.Group>

            <Form.Row>
              <Form.Group as={Col} controlId="pubYear">
                <Form.Label>Publish Year</Form.Label>
                <Form.Control placeholder="Publish Year" onChange={handleChange}/>
              </Form.Group>

              <Form.Group as={Col} controlId="pubStatus">
                <Form.Label>Publish Status</Form.Label>
                <Form.Control placeholder="Publish Status" onChange={handleChange}/>
              </Form.Group>
            </Form.Row>

            <Button variant="primary" type="submit" style={{ float: "right" }}>
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddManga;