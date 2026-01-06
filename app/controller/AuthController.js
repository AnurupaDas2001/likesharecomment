const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {

  async register(req, res) {
    try {
      const { name, email, phone, password } = req.body;

      if (!name || !email || !phone || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields required"
        });
      }

      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(409).json({
          success: false,
          message: "Email already registered"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword
      });

      res.status(201).json({
        success: true,
        message: "User registered",
        user: {
          id: user._id,
          name,
          email,
          phone
        }
      });

    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email & password required"
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid password"
        });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '2h' }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token
      });

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }
}

module.exports = new AuthController();
