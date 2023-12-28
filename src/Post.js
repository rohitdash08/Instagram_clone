import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@mui/material/Avatar";
import { auth, db } from "./firebase";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";

function Post({ postId, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!postId) {
          console.error("postId is undefined");
          return;
        }

        const commentsQuery = query(
          collection(db, "posts", postId, "comments")
        );

        const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    const unsubscribe = fetchComments();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [postId]);

  const postComment = async (event) => {
    event.preventDefault();
    if (comment.trim() !== "") {
      const user = auth.currentUser;
      const username = user ? user.displayName : "DefaultUsername";
      try {
        const commentsCollection = collection(db, "posts", postId, "comments");
        await addDoc(commentsCollection, {
          text: comment,
          username: username,
        });
        setComment("");
      } catch (error) {
        console.error("Error adding comment:", error.message);
      }
    }
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      <img className="post__image" src={imageUrl} alt={caption} />

      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p key={comment.id}>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      <form className="post__commentBox">
        <input
          className="post__input"
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          className="post__button"
          disabled={!comment}
          type="submit"
          onClick={postComment}
        >
          Comment
        </button>
      </form>
    </div>
  );
}

export default Post;
