import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { Card } from "react-bootstrap";
import classes from "./MangaInfo.module.scss";
import { getCoverFullPath } from "../../utils/helpers";
import { Button, Modal, Form, Col, InputGroup, Alert } from "react-bootstrap";
import { useFormik } from "formik";
import { getCurrentManga, clearCurrentManga } from "../../actions/mangaActions";

import { generateChapterID } from "../../utils/helpers";

const { ipcRenderer } = window.require("electron");
const { dialog } = window.require("electron").remote;

const MangaInfo = props => {
  let { id } = useParams();
  const [showAddChapterModal, setShowAddMangaModal] = useState(false);

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
        manga={manga}
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

    if (!values.chapterNumber) {
      errors.chapterNumber = "Required";
    } else if (
      props.manga.chapters &&
      props.manga.chapters.find(
        chapter => chapter.id === generateChapterID(values.chapterNumber)
      )
    ) {
      errors.chapterNumber = "Chapter already exists";
    } else if (
      !/^[0-9]+$/.test(values.chapterNumber) &&
      !/^(?!0\d)\d*(\.\d+)?$/.test(values.chapterNumber)
    ) {
      errors.chapterNumber = "Simple interger of float plz am stoopid";
    } else if (values.chapterNumber.length > 5) {
      errors.chapterNumber = "Is it really that long?";
    }

    if (values.volumeNumber !== "" && !/^[0-9]+$/.test(values.volumeNumber)) {
      errors.volumeNumber = "Simple Interger plz";
    }

    errors.imagesPaths = new Array(formik.values.imagesPaths.length);
    errors.imagesPaths.fill({});
    // errors.imagesPaths = Array(formik.values.imagesPaths.length).fill({ a: ''});
    // console.log(errors.imagesPaths);
    for (let i = 0; i < formik.values.imagesPaths.length; i++) {
      if (formik.values.imagesPaths[i].language === "") {
        errors.imagesPaths[i] = {
          ...errors.imagesPaths[i],
          language: "Required"
        };
      } else if (
        formik.values.imagesPaths.findIndex(
          (path, index) =>
            formik.values.imagesPaths[i].language === path.language &&
            index !== i
        ) !== -1
      ) {
        errors.imagesPaths[i] = {
          ...errors.imagesPaths[i],
          language: "Duplicated"
        };
      }
      if (formik.values.imagesPaths[i].imagesPath === "") {
        errors.imagesPaths[i] = {
          ...errors.imagesPaths[i],
          imagesPath: "Required"
        };
      } else {
        const result = ipcRenderer.sendSync(
          "folder:checkFolderContainsImagesSync",
          formik.values.imagesPaths[i].imagesPath
        );
        // console.log(result);
        if (result === "false") {
          // console.log("false");
          errors.imagesPaths[i] = {
            ...errors.imagesPaths[i],
            imagesPath: "Path doesn't contain images"
          };
        } else if (result === "Path doesn't exist") {
          // console.log("doesn't exist");
          errors.imagesPaths[i] = {
            ...errors.imagesPaths[i],
            imagesPath: "Path doesn't exist"
          };
        }
      }
    }
    // console.log(errors.imagesPaths);
    return errors;
  };

  const handleDeleteChapterByLang = chapterByLang => {
    if (formik.values.imagesPaths.length === 1) {
      return;
    }
    formik.setValues({
      ...formik.values,
      imagesPaths: formik.values.imagesPaths.filter(
        imagesPath => imagesPath !== chapterByLang
      )
    });
    // console.log(formik.values.imagesPaths[index]);
  };

  const handleChapterNumberChange = e => {
    // console.log(e.target.value);
    formik.setValues({
      ...formik.values,
      chapterID: generateChapterID(e.target.value)
    });
  };

  const handleImagePathButtonClick = index => {
    const selectedFolder = dialog.showOpenDialog({
      properties: ["openDirectory"]
    });
    const chapterPath = selectedFolder
      ? selectedFolder[0].replace(/\\/g, "/")
      : "";
    // console.log(chapterPath);
    const newImagesPaths = formik.values.imagesPaths;
    newImagesPaths[index].imagesPath = chapterPath;
    formik.setValues({
      ...formik.values,
      imagesPaths: newImagesPaths
    });
    // console.log(formik.values);
  };

  const handleSubmit = () => {
    const { values, errors } = formik;
    let noError;
    noError = errors.chapterNumber ? false : true;
    noError = noError && (errors.volumeNumber ? false : true);
    noError = noError && (Object.keys(errors).length !== 0)
    noError = noError && (errors.imagesPaths.length === values.imagesPaths.length);
    if (errors.imagesPaths) {
      for (let path of errors.imagesPaths) {
        // console.log(path);
        // console.log(Object.keys(path).length === 0);
        noError = noError && Object.keys(path).length === 0;
      }
    }
    console.log(errors);
    console.log(noError);
    // console.log(f);
    if (!noError) {
      const f = document.getElementsByClassName("invalid-feedback");
      // console.log(f);
      for (let elem of f) {
        elem.classList.remove("shake-animation");
        void elem.offsetWidth;
        elem.classList.add("shake-animation");
      }
    }
    else {
      // SUBMIT 
      console.log("submit");
      // const chapterLanguageList
      const chapterSaveData = {
        title: values.chapterTitle,
        chapterNumber: values.chapterNumber,
        volumeNumber: values.volumeNumber,
        languages: Array.from(values.imagesPaths, chapterByLang => chapterByLang.language)
      }
      alert(JSON.stringify(chapterSaveData, null, 2));
      ipcRenderer.send("chapter:newChapter", { mangaData: props.manga, chapterData: values, chapterSaveData: chapterSaveData });
    }
  };

  const formik = useFormik({
    initialValues: {
      chapterID: "",
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
              <Form.Label>Chapter Number (*)</Form.Label>
              <Form.Control
                id="chapterNumber"
                name="chapterNumber"
                placeholder="Chapter number"
                onChange={e => {
                  handleChapterNumberChange(e);
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.chapterNumber}
                isValid={
                  formik.touched.chapterNumber && !formik.errors.chapterNumber
                }
                isInvalid={
                  formik.touched.chapterNumber && formik.errors.chapterNumber
                }
              />
              <Form.Control.Feedback
                type="invalid"
                className={classes["feedback"]}
              >
                {formik.errors.chapterNumber}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Volume Number</Form.Label>
              <Form.Control
                id="volumeNumber"
                name="volumeNumber"
                placeholder="Volume number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.volumeNumber}
                isInvalid={
                  formik.touched.volumeNumber && formik.errors.volumeNumber
                }
              />
              <Form.Control.Feedback
                type="invalid"
                className={classes["feedback"]}
              >
                {formik.errors.volumeNumber}
              </Form.Control.Feedback>
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
              readOnly
              id="chapterID"
              name="chapterID"
              placeholder="Input Chapter Number to auto generate chapter ID"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.chapterID}
            />
          </Form.Group>

          <Form.Label>Images path(s) (*)</Form.Label>
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
                    onBlur={formik.handleBlur}
                    value={formik.values.imagesPaths[index].language}
                    isInvalid={
                      formik.touched.imagesPaths &&
                      formik.touched.imagesPaths[index] &&
                      formik.touched.imagesPaths[index].language &&
                      formik.errors.imagesPaths &&
                      formik.errors.imagesPaths[index] &&
                      formik.errors.imagesPaths[index].language
                    }
                    isValid={
                      formik.touched.imagesPaths &&
                      formik.touched.imagesPaths[index] &&
                      formik.touched.imagesPaths[index].language &&
                      (!formik.errors.imagesPaths ||
                        !formik.errors.imagesPaths[index] ||
                        (formik.errors.imagesPaths &&
                          !formik.errors.imagesPaths[index].language))
                    }
                  >
                    <option value="">Lang</option>
                    <option value="en">en</option>
                    <option value="jp">jp</option>
                    <option value="vn">vn</option>
                  </Form.Control>
                  <Form.Control.Feedback
                    type="invalid"
                    className={classes["feedback"]}
                  >
                    {formik.errors.imagesPaths &&
                    formik.errors.imagesPaths[index]
                      ? formik.errors.imagesPaths[index].language
                      : null}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col}>
                  <InputGroup md="9">
                    <Form.Control
                      name={`imagesPaths[${index}].imagesPath`}
                      placeholder="Images Path"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.imagesPaths[index].imagesPath}
                      isInvalid={
                        formik.touched.imagesPaths &&
                        formik.touched.imagesPaths[index] &&
                        formik.touched.imagesPaths[index].imagesPath &&
                        formik.errors.imagesPaths &&
                        formik.errors.imagesPaths[index] &&
                        formik.errors.imagesPaths[index].imagesPath
                      }
                      isValid={
                        formik.touched.imagesPaths &&
                        formik.touched.imagesPaths[index] &&
                        formik.touched.imagesPaths[index].imagesPath &&
                        (!formik.errors.imagesPaths ||
                          !formik.errors.imagesPaths[index] ||
                          (formik.errors.imagesPaths &&
                            !formik.errors.imagesPaths[index].imagesPath))
                      }
                    />
                    <InputGroup.Append>
                      <Button
                        variant="outline-secondary"
                        onClick={handleImagePathButtonClick.bind(this, index)}
                      >
                        ...
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={handleDeleteChapterByLang.bind(
                          this,
                          imagesPath
                        )}
                      >
                        &times;
                      </Button>
                    </InputGroup.Append>
                    <Form.Control.Feedback
                      type="invalid"
                      className={classes["feedback"]}
                    >
                      {formik.errors.imagesPaths &&
                      formik.errors.imagesPaths[index]
                        ? formik.errors.imagesPaths[index].imagesPath
                        : null}
                    </Form.Control.Feedback>
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
        <Button
          variant="primary"
          onClick={e => {
            formik.handleSubmit(e);
            handleSubmit(e);
          }}
        >
          Add
        </Button>
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
