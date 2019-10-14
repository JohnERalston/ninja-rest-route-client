import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../utils/AuthContext";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const EditBlog = ({ match, history }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blog, setBlog] = useState(null);

  const auth = useContext(AuthContext);

  useEffect(() => {
    getBlog(match.params.id);
  }, [match.params.id]);

  if (!blog) return null;

  return (
    <div>
      <Form>
        <Form.Group controlId="form.title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            name="title"
            value={title}
            onChange={setProp}
            type="text"
            placeholder="Blog title..."
          />
        </Form.Group>

        <Form.Group controlId="form.content">
          <Form.Label>Content</Form.Label>
          <Form.Control
            name="content"
            value={content}
            onChange={setProp}
            as="textarea"
            rows="3"
          />
        </Form.Group>
      </Form>
      <Button variant="primary" onClick={editBlog}>
        Submit
      </Button>
    </div>
  );

  async function editBlog() {
    blog.title = title;
    blog.content = content;
    const prom = fetch("http://localhost:8080/editblog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + (await auth.getAccessToken())
      },
      body: JSON.stringify(blog)
    });
    prom.then(() => {
      history.push("/");
    });
  }

  async function getBlog(id) {
    fetch(`http://localhost:8080/viewblog/${match.params.id}`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8', 
        Authorization: "Bearer " + (await auth.getAccessToken())
      }
    })
      .then(resp => resp.json())
      .then(function(blog) {
        setBlog(blog);
        setTitle(blog.title);
        setContent(blog.content);
      });
  }

  function setProp(event) {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "title") {
      setTitle(value);
    } else if (name === "content") {
      setContent(value);
    }
  }
};
export default EditBlog;
