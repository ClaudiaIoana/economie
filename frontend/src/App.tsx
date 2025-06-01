// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import { useEffect, useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
// import ShowAllRecipes from "./components/RecipeComponents/showAllRecipes";
import Welcome from "./components/LoginSignUpComponents/Welcome";
import Login from "./components/LoginSignUpComponents/Login";
import SignUp from "./components/LoginSignUpComponents/SignUp";
import ShowAllEvents from "./components/EventsComponent/showAllEvents.tsx";
import Logout from "./components/LoginSignUpComponents/Logout.tsx";
import UserProfile from "./components/UserComponents/userDetailView.tsx";
// import Logout from "./components/LoginSignUpComponents/Logout";

// import UserRecipeList from "./components/RecipeComponents/userRecipes";
// import RecipeDetailsForm from "./components/RecipeComponents/recipeDetailsForm.tsx";
// import BadJokeForm from "./components/RecipeComponents/BadJokeForm.tsx";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  // return (
  //     <>
  //         <ShowAllRecipes></ShowAllRecipes>
  //     </>
  // );

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Welcome
              email={email}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login setLoggedIn={setLoggedIn} setEmail={setEmail} />
          }
        />
        <Route
          path="/signUp"
          element={
            <SignUp setLoggedIn={setLoggedIn} setEmail={setEmail} />
          }
        />
        <Route path="/userDetail" element={<UserProfile></UserProfile>} />
        <Route
          path="/showlist/*"
          element={<ShowAllEvents></ShowAllEvents>}
        />
        <Route path="/logout" element={<Logout></Logout>} />

        {/*<Route*/}

        {/*    path="/userRecipes/*"*/}
        {/*    element={<UserRecipeList ></UserRecipeList>}*/}
        {/*/> */}
      </Routes>
    </div>
  );
}

export default App;
