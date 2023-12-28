import { Button } from "@mui/material";
import React, { useState } from "react";
import { storage, db } from "./firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./ImageUpload.css";

function ImageUpload({ username, posts, setPosts }) {
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          // error function
          console.log(error);
          alert(error.message);
        },

        async () => {
          const url = await getDownloadURL(storageRef);
          // post image inside db
          const docRef = await addDoc(collection(db, "posts"), {
            timestamp: serverTimestamp(),
            caption: caption,
            imageUrl: url,
            username: username,
          });

          setPosts((prevPosts) => [
            {
              id: docRef.id,
              timestamp: serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            },
            ...prevPosts,
          ]);

          setCaption(""); // Reset caption after upload
          setImage(""); // Reset image after upload
          setProgress(0); // Reset progress after upload

          console.log("Document added with ID: ", docRef.id);
        }
      );
    } catch (error) {
      console.error("error Uploading and adding documents: ", error);
    }
  };

  return (
    <div className="imageUpload">
      <progress className="imageUpload__progress" value={progress} max="100" />
      <input
        type="text"
        placeholder="Enter a caption..."
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
