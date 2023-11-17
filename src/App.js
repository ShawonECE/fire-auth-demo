import './App.css';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import firebaseConfig from './fire-config';
import { useState } from 'react';


const app = initializeApp(firebaseConfig);

function App() {
  const provider = new GoogleAuthProvider();
  const userDefault = {
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: ''
  }
  const [existingUser, setExistingUser] = useState(false);
  const [submitBtn, setSubmitBtn] = useState('Sign up');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [user, setUser] = useState(userDefault);
  const handleSignIn = () => {
    const auth = getAuth(app);
    signInWithPopup(auth, provider)
    .then(res => {
      const {displayName, email, photoURL} = res.user;
      const userSignedIn = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      };
      setUser(userSignedIn);
      setMessage('Successfully Signed in');
      setMessageColor('green');
      //console.log(res.user);
    })
    .catch(error => setMessage(error.message));
    }
    const handleSignOut = () => {
      const auth = getAuth(app);
      signOut(auth)
      .then(() => {
        setUser(userDefault);
        setMessage('Successfully Signed Out');
        //console.log(user);
      })
      .catch(error => {
        setMessage(error.message)
        setMessageColor('red');
      });
  }
    const handleBlur = (event) => {
      let validForm = true;
      if (event.target.name === 'email') {
        const validEmail = /^\S+@\S+\.\S+$/.test(event.target.value);
        validForm = validForm && validEmail;
        //console.log(validEmail);
      }
      else if (event.target.name === 'password') {
        const validPassword = /\d{1}/.test(event.target.value) && event.target.value.length > 6;
        validForm = validPassword && validForm;
        //console.log(validPassword);
      }
      if(validForm) {
        const newUser = {...user};
        newUser[event.target.name] = event.target.value;
        setUser(newUser);
      }
    }
  const handleSubmit = (event) => {
    if(!existingUser && user.email && user.password) {
      const auth = getAuth(app);
      createUserWithEmailAndPassword(auth, user.email, user.password)
      .then(() => {
        // Signed up 
        // const userInfo = userCredential.user;
        // console.log(userInfo)
        updateUserName(user.name);
        setMessage('Successfully Signed Up');
        setMessageColor('green');
      })
      .catch((error) => {
        //const errorCode = error.code;
        const errorMessage = error.message;
        setMessage(errorMessage);
        setMessageColor('red');
      })
    }
    else if(existingUser && user.email && user.password) {
      const auth = getAuth(app);
      signInWithEmailAndPassword(auth, user.email, user.password)
      .then(res => {
        const {displayName, email, photoURL} = res.user;
        const userSignedIn = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        };
        setUser(userSignedIn);
        setMessage('Successfully Signed in');
        setMessageColor('green');
  })
      .catch((error) => {
        const errorMessage = error.message;
        setMessage(errorMessage);
      });
    }
    event.preventDefault();
  }
  const updateUserName = (name) => {
    const auth = getAuth(app);
    updateProfile(auth.currentUser, {
      displayName: name
    })
    .then(() => {
      console.log('Name updated successfully');
    }).catch((error) => {
      console.log(error);
    });
  }
  return (
    <div className='App'>
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> : <button onClick={handleSignIn}>Sign In with Google</button>
      }
      <br />
      <small style={{color: messageColor}}>{message}</small>
      {
        user.isSignedIn && <>
          <h1>{user.name}</h1>
          <h4>{user.email}</h4>
          <img src={user.photo} alt="" />
        </>
      }
      
      <h1>Our own Authentication</h1>
      <input type="checkbox" name="existingUser" id="existingUser" onChange={() =>{
        setExistingUser(!existingUser);
        const btn = submitBtn === 'Sign up' ? 'Sign in' : 'Sign up';
        setSubmitBtn(btn);
      }} />
      <label for="existingUser">Already registered</label>
      <form onSubmit={handleSubmit}>
        {!existingUser && <input type="text" name="name" placeholder="Enter your name" onBlur={handleBlur} required />}
        <br />
        <input type="text" name="email" placeholder="Enter your email" onBlur={handleBlur} required />
        <br />
        <input type="password" name="password" placeholder="Enter your password" onBlur={handleBlur} required />
        <br />
        <input type="submit" value={submitBtn} />
      </form>
    </div>
  );
}

export default App;