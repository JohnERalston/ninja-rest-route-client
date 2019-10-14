import React, { useEffect, useState, useContext } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";

import { AuthContext } from "../utils/AuthContext";

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const auth = useContext(AuthContext);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const hasBlogs = !!blogs.length;

  return (
    <>
      <div className="row">
        <div className="col">
          <h2>Blogs</h2>
        </div>
        <div className="col text-right">
          <Link className="btn btn-primary" to="/create">
            Add New
          </Link>
        </div>
      </div>

      {hasBlogs && (
        <ListGroup>
          {blogs.map(blog => (
            <ListGroup.Item key={blog.id}><Link to={`/view/${blog.id}`}>{blog.title}</Link></ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {!hasBlogs && <Alert variant="info">No blogs!</Alert>}
    </>
  );

  async function fetchBlogs() {
    await fetch("http://localhost:8080/listblogs", {
      headers: {
        Authorization: "Bearer " + (await auth.getAccessToken())
      }
    })
      .then(resp => resp.json())
      .then(function(blogs) {
        setBlogs(blogs);
      });
  }
};
export default ListBlog;
