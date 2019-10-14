import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import Button from "react-bootstrap/Button";

const ViewBlog = ({ match, history }) => {
  const [blog, setBlog] = useState(null);
  const auth = useContext(AuthContext);

  useEffect(() => {
    getBlog(match.params.id);
  }, [match.params.id]);

  if (!blog) return null;

  return (
    <div>
      <h2 className="inline-block mr-2">{blog.title}</h2>
      <Link className="mr-3" to={`/edit/${blog.id}`}>
        Edit
      </Link>
      <Button
        variant="link"
        className="linkBtn inline-block text-danger danger"
        onClick={deleteBlog}
      >
        Delete
      </Button>
      <div className="blog">{blog.content}</div>
    </div>
  );

  async function getBlog(id) {
    fetch(`http://localhost:8080/viewblog/${match.params.id}`, {
      headers: {
        Authorization: "Bearer " + (await auth.getAccessToken())
      }
    })
      .then(resp => resp.json())
      .then(function(blog) {
        setBlog(blog);
      });
  }

  async function deleteBlog() {
    fetch(`http://localhost:8080/deleteblog`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8', 
        Authorization: "Bearer " + (await auth.getAccessToken())
      },
      body: JSON.stringify(blog)
    })
      .then(resp => resp.json())
      .then(function(blog) {
        history.push("/");
      });
  }
};
export default ViewBlog;
