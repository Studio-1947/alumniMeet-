const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema representing an alumni user profile and auth credentials
const userSchema = new mongoose.Schema(
  {
    // Display name used across the platform
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    // Unique email for login and contact (not exposed publicly)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Hashed password stored securely
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // prevent returning password by default
    },
    // Graduation year/batch
    batchYear: {
      type: Number,
      required: true,
    },
    // Academic department
    department: {
      type: String,
      required: true,
      trim: true,
    },
    // Current career/education status
    currentStatus: {
      type: String,
      required: true,
      trim: true,
    },
    // Optional current role/title
    currentRole: {
      type: String,
      trim: true,
    },
    // Optional organization where the alumni is working/studying
    currentOrganization: {
      type: String,
      trim: true,
    },
    // City/country location
    location: {
      type: String,
      trim: true,
    },
    // Short biography/summary
    shortBio: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    // Social links
    linkedinUrl: {
      type: String,
      trim: true,
    },
    portfolioUrl: {
      type: String,
      trim: true,
    },
    // List of skills
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Hash password before saving if it was modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare provided password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Remove sensitive fields when sending user JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
