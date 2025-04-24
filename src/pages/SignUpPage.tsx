import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuthContext } from "@/context/AuthContext";
import { isAuthenticated } from "@/services/authService";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signup } = useAuthContext();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const validatePasswords = () => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    
    // Only validate after user has attempted to submit once
    if (showPasswordError) {
      if (e.target.value.length < 6) {
        setPasswordError("Password must be at least 6 characters");
      } else if (e.target.value !== confirmPassword) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    
    // Only validate after user has attempted to submit once
    if (showPasswordError) {
      if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters");
      } else if (password !== e.target.value) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show validation errors after first submission attempt
    setShowPasswordError(true);
    
    // Validate passwords match
    if (!validatePasswords()) {
      return;
    }

    try {
      setIsLoading(true);
      
      await signup({ name, email, password });
      
      toast({
        title: "Account created!",
        description: "You have successfully signed up.",
        variant: "default",
      });
      
      // Force a quick refresh of the page to update the navigation
      window.location.href = "/";
    } catch (error: any) {
      console.error("Registration error:", error);
      
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Unable to create account. Please try again.",
        variant: "destructive",
      });
      
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cinebuzz-dark to-black">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-md mx-auto bg-cinebuzz-dark-light rounded-lg shadow-lg p-8 mt-10">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="bg-cinebuzz-dark border-cinebuzz-accent text-white"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-cinebuzz-dark border-cinebuzz-accent text-white"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Create a password"
                className="bg-cinebuzz-dark border-cinebuzz-accent text-white"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm your password"
                className={`bg-cinebuzz-dark border-cinebuzz-accent text-white ${
                  passwordError && showPasswordError ? "border-red-500" : ""
                }`}
                required
                disabled={isLoading}
              />
              {passwordError && showPasswordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required disabled={isLoading} />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-cinebuzz-accent hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-cinebuzz-accent hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-cinebuzz-accent hover:bg-cinebuzz-accent/80 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-white">
              Already have an account?{" "}
              <Link to="/signin" className="text-cinebuzz-accent hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;