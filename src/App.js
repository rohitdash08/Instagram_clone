import { useEffect, useState } from "react";
import "./App.css";
import Post from "./Post";
import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "./firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Input, Modal } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ImageUpload from "./ImageUpload";
import { InstagramEmbed } from "react-social-media-embed";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsQuery = query(
          collection(db, "posts"),
          orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(postsQuery);
        console.log("Query Snapshot:", querySnapshot);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched Data:", data);

        setPosts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Run this effect only once when the component mounts

  useEffect(() => {
    console.log("Dark Mode:", darkMode);
  }, [darkMode]);

  const signUp = async (event) => {
    event.preventDefault();

    if (!username || !email || !password) {
      alert("Please provide a username, email, and password.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User created:", user);

      // Update the user's display name if a username is provided
      await updateProfile(user, { displayName: username });

      setOpenSignUp(false);
    } catch (error) {
      console.error("Error creating user:", error.message);
      alert(error.message);
    }
  };

  const signIn = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User signed in:", user);

      setOpenSignIn(false);
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="App">
      <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
        <Box sx={style}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="/images/Instagram_logo.svg"
                alt="Instagram logo"
              />

              <Typography id="modal-modal-title" variant="h6" component="h2">
                Sign Up...
              </Typography>
            </center>

            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <Box sx={style}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="/images/Instagram_logo.svg"
                alt="Instagram logo"
              />

              <Typography id="modal-modal-title" variant="h6" component="h2">
                Sign In...
              </Typography>
            </center>

            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </Box>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="/images/Instagram_logo.svg"
          alt="Instagram logo"
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>SIGN IN</Button>
            <Button onClick={() => setOpenSignUp(true)}>SIGN UP</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsleft">
          {posts.map((post) => (
            <Post
              key={post.id} // Add a unique key to each Post component
              postId={post.id}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>

        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/CmCWBbdrvCXUdxXi3Zboy-2bVtGSGRyO7EFYi40/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload
          username={user.displayName}
          posts={posts}
          setPosts={setPosts}
        />
      ) : (
        <h3>Sorry! you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
