import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { Card } from "react-bootstrap";
import classes from "./MangaInfo.module.scss";
import { getCoverFullPath } from "../../utils/helpers";
import { Button, Modal, Form, Col, InputGroup } from "react-bootstrap";
import { useFormik, Field, FieldArray } from "formik";
import { getCurrentManga, clearCurrentManga } from "../../actions/mangaActions";

const { ipcRenderer } = window.require("electron");
const { dialog } = window.require("electron").remote;

const MangaInfo = props => {
  let { id } = useParams();
  const [showAddChapterModal, setShowAddMangaModal] = useState(true);

  const handleShowAddChapterModal = () => {
    setShowAddMangaModal(true);
  };

  const handleCloseAddChapterModal = () => {
    setShowAddMangaModal(false);
  };

  useEffect(() => {
    props.getCurrentManga(id);
    return () => {
      props.clearCurrentManga();
    };
  }, []);

  const { manga } = props.manga;

  return (
    <div>
      <Link to="/">Back</Link>
      {/* <div>{id}</div>
      <div>{props.manga.manga.description}</div> */}
      <Card
        className={classes["manga-info-card"]}
        bg="dark"
        text="white"
        border="dark"
      >
        <Card.Header>{manga.title}</Card.Header>
        <Card.Body>
          <div className={classes["manga-info-container"]}>
            <div className={classes["manga-cover-container"]}>
              <img
                src={getCoverFullPath(manga.id, manga.cover)}
                alt={manga.id}
                className={classes["manga-cover-img"]}
              />
            </div>
            <div className={classes["manga-detail-container"]}>
              {/* alt names */}
              <div className={classes["manga-detail-item"]}>
                <div className={classes["item-name"]}>Alt name(s)</div>
                <div className={classes["item-content"]}>{manga.title}</div>
              </div>
              <div className={classes["line"]}></div>

              {/* author */}
              <div className={classes["manga-detail-item"]}>
                <div className={classes["item-name"]}>Author</div>
                <div className={classes["item-content"]}>{manga.author}</div>
              </div>
              <div className={classes["line"]}></div>

              {/* artist */}
              <div className={classes["manga-detail-item"]}>
                <div className={classes["item-name"]}>Artist</div>
                <div className={classes["item-content"]}>{manga.artist}</div>
              </div>
              <div className={classes["line"]}></div>

              {/* genre */}
              <div className={classes["manga-detail-item"]}>
                <div className={classes["item-name"]}>Genre(s)</div>
                <div className={classes["item-content"]}>
                  {manga.genres
                    ? manga.genres.map(genre => (
                        <div className={classes["genre"]}>{genre}</div>
                      ))
                    : null}
                </div>
              </div>
              <div className={classes["line"]}></div>

              {/* description */}
              <div className={classes["manga-detail-item"]}>
                <div className={classes["item-name"]}>Description</div>
                <div className={classes["item-content"]}>
                  {manga.description}
                </div>
              </div>
              <div className={classes["line"]}></div>

              {/* released */}
              <div className={classes["manga-detail-item"]}>
                <div className={classes["item-name"]}>Released</div>
                <div className={classes["item-content"]}>
                  {manga.publishYear}
                </div>
              </div>
              <div className={classes["line"]}></div>

              {/* publish status */}
              <div className={classes["manga-detail-item"]}>
                <div className={classes["item-name"]}>Pub. Status</div>
                <div className={classes["item-content"]}>
                  {manga.publishStatus}
                </div>
              </div>
            </div>
          </div>
          <hr
            style={{ height: "1px", color: "black", backgroundColor: "#222" }}
          ></hr>
          <Button onClick={handleShowAddChapterModal}>Add chapter</Button>
          <div>
            {manga.chapters
              ? manga.chapters.map(chapter => (
                  <Link
                    className={classes["chapters-container"]}
                    to={"/reader/" + manga.id + "/" + chapter.id}
                  >
                    Vol. {chapter.volumeNumber} Ch.{chapter.chapterNumber} -{" "}
                    {chapter.title}
                  </Link>
                ))
              : null}
          </div>
        </Card.Body>
      </Card>
      <AddChapterModal
        show={showAddChapterModal}
        handleClose={handleCloseAddChapterModal}
      ></AddChapterModal>
    </div>
  );
};

const AddChapterModal = props => {
  const handleAddLanguageImagesPath = () => {
    formik.setValues({
      ...formik.values,
      imagesPaths: [
        ...formik.values.imagesPaths,
        { language: "", imagesPath: "" }
      ]
    });
  };

  const validate = values => {
    const errors = {};

    return errors;
  };

  const handleDeleteChapterByLang = index => {
    // formik.setValues({
    //   ...formik.values,
    //   imagesPaths: formik.values.imagesPaths.filter(
    //     imagePath => imagePath !== chapterByLang
    //   )
    // });
    console.log(formik.values.imagesPaths[index]);
  };

  const handleImagePathButtonClick = (index) => {
    const selectedFolder = dialog.showOpenDialog({ properties: ["openDirectory"] });
    const chapterPath = selectedFolder ? selectedFolder[0].replace(/\\/g, "/") : "";
    console.log(chapterPath);
    const newImagesPaths = formik.values.imagesPaths;
    newImagesPaths[index].imagesPath = chapterPath;
    formik.setValues({
      ...formik.values,
      imagesPaths: newImagesPaths
    });
    console.log(formik.values);
  }

  const formik = useFormik({
    initialValues: {
      chapterId: "",
      chapterTitle: "",
      chapterNumber: "",
      volumeNumber: "",
      imagesPaths: [{ language: "", imagesPath: "" }]
    },
    validate
  });
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Chapter</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "12px 50px" }}>
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Chapter number</Form.Label>
              <Form.Control
                id="chapterNumber"
                name="chapterNumber"
                placeholder="Chapter number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.chapterNumber}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Volume number</Form.Label>
              <Form.Control
                id="volumeNumber"
                name="volumeNumber"
                placeholder="Volume number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.volumeNumber}
              />
            </Form.Group>
          </Form.Row>

          <Form.Group>
            <Form.Label>Chapter Title</Form.Label>
            <Form.Control
              id="chapterTitle"
              name="chapterTitle"
              placeholder="Chapter Title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.chapterTitle}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Chapter ID</Form.Label>
            <Form.Control
              id="chapterId"
              name="chapterId"
              placeholder="Chapter ID"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.chapterId}
            />
          </Form.Group>

          <Form.Label>Images path(s)</Form.Label>
          {/* <FieldArray
            name="imagesPaths"
            render={arrayHelpers => (
              <div> */}
          {formik.values.imagesPaths.map((imagesPath, index) => (
            <div key={index}>
              <Form.Row>
                <Form.Group as={Col} md="3">
                  <Form.Control
                    as="select"
                    name={`imagesPaths[${index}].language`}
                    onChange={formik.handleChange}
                    value={formik.values.imagesPaths[index].language}
                  >
                    <option value="">Lang</option>
                    <option value="en">en</option>
                    <option value="jp">jp</option>
                    <option value="vn">vn</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col}>
                  <InputGroup md="9">
                    <Form.Control
                      name={`imagesPaths[${index}].imagesPath`}
                      placeholder="Images Path"
                      onChange={formik.handleChange}
                      value={formik.values.imagesPaths[index].imagesPath}
                    />
                    <InputGroup.Append>
                      <Button
                        variant="outline-secondary"
                        onClick={handleImagePathButtonClick.bind(this, index)}
                      >...</Button>
                      <Button
                        variant="outline-danger"
                        onClick={handleDeleteChapterByLang.bind(this, index)}
                      >
                        &times;
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Form.Group>
              </Form.Row>
            </div>
          ))}
          {/* </div>
            )}
          /> */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outline-primary"
              style={{ flex: "1" }}
              onClick={handleAddLanguageImagesPath}
            >
              +
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="primary">Add</Button>
      </Modal.Footer>
    </Modal>
  );
};

const mapStateToProps = state => ({
  manga: state.manga
});

export default connect(
  mapStateToProps,
  { getCurrentManga, clearCurrentManga }
)(MangaInfo);
