import "./App.css";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

function App() {
  return (
    <>
      {console.log("Clerk key:", import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)}
      <header>
        <h1>chat app</h1>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </>
  );
}

export default App;
