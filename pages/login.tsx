import Metatags from "@components/Metatags";
import { UserContext } from "@lib/context";
import { User, userToFirestore } from "@lib/models";
import { auth, db } from "@lib/services/firebase";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import Google from "@mui/icons-material/Google";
import SendOutlined from "@mui/icons-material/SendOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export default function Login() {
  const { user, fUser } = useContext(UserContext);
  const router = useRouter();

  if (user) {
    router.push("/");
  }

  return (
    <main>
      <Metatags
        title="RankIO | Sign in"
        description="Sign in to your RankIO account"
      ></Metatags>

      {fUser && !user ? <UsernameForm /> : <SignIn />}
    </main>
  );
}

// Sign in with Google button
function SignIn() {
  return (
    <Box>
      <Grid container mt={1} spacing={4} textAlign="center">
        <Grid item xs={12}>
          <Typography variant="h4">
            Join RankIO using your Google account
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            color="inherit"
            size="large"
            variant="outlined"
            startIcon={<Google />}
            onClick={async () =>
              await signInWithPopup(auth, new GoogleAuthProvider())
            }
          >
            JOIN
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

// Username form
function UsernameForm() {
  const [username, setUsername] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { fUser } = useContext(UserContext);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = doc(db, "users", fUser!.uid);
    const usernameDoc = doc(db, "usernames", username);

    // Commit both docs together as a batch write.
    const batch = writeBatch(db);

    const data: User = {
      username: username,
      uid: fUser!.uid,
      displayName: fUser!.displayName!,
      photoURL: fUser!.photoURL!,
      preferences: {
        ratingSystem: "tierlist",
        tierlistNames: {
          1: "Unwatchable",
          2: "Awful",
          3: "Bad",
          4: "Good",
          5: "Great",
          6: "Excellent",
          7: "Masterpiece",
        },
      },
      bio: "",
    };
    batch.set(userDoc, userToFirestore(data));
    batch.set(usernameDoc, { uid: fUser!.uid });

    await batch.commit();
  };

  const onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (
    e
  ) => {
    e.preventDefault();
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,25}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set username if length is < 3 OR it passes regex
    if (val.length < 3) {
      setUsername(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setUsername(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const snap = await getDoc(doc(db, "usernames", username));
        setIsValid(!snap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    checkUsername(username);
  }, [username, checkUsername]);

  return (
    <Box component="form" onSubmit={onSubmit} autoComplete="off">
      <Grid container mt={1} rowSpacing={4} direction="column">
        <Grid item xs textAlign="center">
          <Typography variant="h4">Choose an username</Typography>
        </Grid>
        <Grid item xs textAlign="center" mx={3}>
          <TextField
            autoFocus
            color={isValid ? "success" : "error"}
            sx={{ accentColor: "#ff0000" }}
            fullWidth
            id="input-username"
            label="Username"
            variant="standard"
            value={username}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs textAlign="center">
          <Button
            disabled={!isValid}
            color="success"
            type="submit"
            size="large"
            variant="outlined"
            startIcon={isValid ? <SendOutlined /> : <ErrorOutline />}
          >
            {isValid
              ? "CHOOSE"
              : loading
              ? "LOOKING UP..."
              : "USERNAME NOT AVAILABLE"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}