const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// schema för användare
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// hasha lösenord
userSchema.pre("save", async function(next) {
    try {
        if (this.isNew || this.isModified("password")) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
});

// registrera användare
userSchema.statics.register = async function(username, password) {
    try {
        const user = new this({ username, password });
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
};

// jämför lösenord
userSchema.methods.comparePassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

// logga in
userSchema.statics.login = async function(username, password) {
    try {
        const user = await this.findOne();
        if (!user) {
            throw new Error("Invalid username or password");
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            throw new Error("Invalid username or password");
        }
        return user;
    } catch (error) {
        throw error;
    }
};

const User = mongoose.model("User", userSchema);
module.exports = User;