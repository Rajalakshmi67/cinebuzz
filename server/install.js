const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Function to run a command and display its output
function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

// Install dependencies
console.log("Installing server dependencies...");
runCommand("npm install");

// Check if .env file exists
const envPath = path.join(__dirname, ".env");
const envExamplePath = path.join(__dirname, ".env.example");

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log("Creating .env file from .env.example...");
  fs.copyFileSync(envExamplePath, envPath);
  console.log("Please update the .env file with your MongoDB connection string and JWT secret.");
}

console.log("\nSetup completed successfully!");
console.log("\nTo start the server in development mode:");
console.log("npm run dev");
console.log("\nTo start the server in production mode:");
console.log("npm start");
