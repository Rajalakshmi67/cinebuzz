const User = require("../models/User");

// @desc    Register a user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`🔵 Signup attempt for email: ${email}, name: ${name}`);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`🔴 Signup failed: Email ${email} already registered`);
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Generate a username from name
    let username = name.toLowerCase().replace(/\s+/g, '_');
    
    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      // Add random numbers to make username unique
      username = `${username}_${Math.floor(Math.random() * 1000)}`;
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      username
    });

    console.log(`🟢 Signup successful: User ${name} (${email}) created with ID: ${user._id}`);

    // Send JWT token in response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error(`🔴 Signup error for request body: ${JSON.stringify(req.body)}`, error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/signin
// @access  Public
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`🔵 Signin attempt for email: ${email}`);

    // Validate email & password
    if (!email || !password) {
      console.log(`🔴 Signin failed: Missing email or password`);
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log(`🔴 Signin failed: No user found with email ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`🔴 Signin failed: Incorrect password for email ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log(`🟢 Signin successful: User ${user.name} (${email}) with ID: ${user._id}`);

    // Send JWT token in response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error(`🔴 Signin error for email: ${req.body.email}`, error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(`🔵 User ${user.name} (${user.email}) fetched their profile`);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(`🔴 Error fetching user profile: ${req.user.id}`, error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Helper function to create token, set cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};
