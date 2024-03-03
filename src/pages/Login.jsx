import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { auth } from "../Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Sign in user using Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      // Successful login
      // You can redirect the user to a new page or perform other actions here
      toast({
        title: "Login Success!",
        description: "Redirecting to home page.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setError(error.message);
      toast({
        title: "Login Failed.",
        description: "Incorrect email or password entered.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-div">
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button
          mt={4}
          colorScheme="teal"
          type="submit"
          isLoading={isLoading}
        >
          Log In
        </Button>
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </form>
    </div>
  );
}

export default Login;