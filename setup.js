const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Function to run a command and display its output
function runCommand(command, cwd = null) {
  try {
    console.log(`Running: ${command}${cwd ? ` in ${cwd}` : ""}`);
    execSync(command, { stdio: "inherit", cwd });
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

// Install frontend dependencies
console.log("Installing frontend dependencies...");
runCommand("npm install");

// Install backend dependencies
console.log("\nInstalling backend dependencies...");
const serverDir = path.join(__dirname, "server");
runCommand("npm install", serverDir);

// Check if server .env file exists
const envPath = path.join(serverDir, ".env");
const envExamplePath = path.join(serverDir, ".env.example");

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log("Creating server .env file from .env.example...");
  fs.copyFileSync(envExamplePath, envPath);
  console.log(
    "\n⚠️ IMPORTANT: Please update the server/.env file with your MongoDB connection string and JWT secret!"
  );
}

console.log("\n✅ Setup completed successfully!");
console.log("\nTo start the frontend development server:");
console.log("npm run dev");
console.log("\nTo start the backend server:");
console.log("cd server && npm run dev");
console.log("\nFor production, you should start both servers separately.");
