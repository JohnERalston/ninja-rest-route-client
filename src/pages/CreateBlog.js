import React, { useState, useContext } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { AuthContext } from "../utils/AuthContext";

const CreateBlog = ({history}) => {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const auth = useContext(AuthContext);

  return (
    <>
      <h2>Create Blog</h2>
      <Form>
        <Form.Group controlId="form.title">
          <Form.Label>Title</Form.Label>
          <Form.Control name="title" value={title} onChange={setProp} type="text" placeholder="Blog title..." />
        </Form.Group>

        <Form.Group controlId="form.content">
          <Form.Label>Content</Form.Label>
          <Form.Control name="content" value={content} onChange={setProp} as="textarea" rows="3" />
        </Form.Group>
      </Form>
      <Button variant="primary" onClick={createBlog}>
        Submit
      </Button>
    </>
  );

  async function createBlog() {
    const prom = fetch('http://localhost:8080/createblog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8', 
        Authorization: 'Bearer ' + await auth.getAccessToken()
      },
      body: JSON.stringify({
        title: title,
        content: content
      })
    });
    prom.then(() => {
      history.push('/');
    });
  }

  function setProp(event) {
    const name = event.target.name;
    const value = event.target.value;
    if(name === 'title') {
      setTitle(value);
    }
    else if(name === 'content') {
      setContent(value);
    }
  }
};
export default CreateBlog;
