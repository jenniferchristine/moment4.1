const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// schema för användare
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [20, "Username cannot be longer than 20 characters"]
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(v) { // avgör om lösenordet innehåller minst en siffra
                return /\d/.test(v); // reguljärt uttryck som matchar siffror
            },
            message: "Password must contain atleast one number"
        }
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        maxlength: [25, "First name cannot be longer than 20 characters"]
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        maxlength: [30, "Last name cannot be longer than 20 characters"]
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"] // giltig adress får ej börja med mellanslag eller @ följt av @ och sedan tecken som återigen inte består av mellanrum eller @ följt av en punk och tecken
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// hasha lösenord
userSchema.pre("save", async function(next) { // funktionen körs innan dokumentet sparas
    try {
        if (this.isNew || this.isModified("password")) { // kontroll om det skapas för första gången + om fältet ändrats
            const hashedPassword = await bcrypt.hash(this.password, 10); // hashingalgorytm som körs tio ggr
            this.password = hashedPassword; // hashade lösenordet skickas tillbaka (ersätter gamla)
        }
        next(); // kallas på nästa middleware
    } catch (error) {
        next(error);
    }
});

// registrera användare
userSchema.statics.register = async function(username, password, firstname, lastname, email) {
    try {
        const user = new this({ username, password, firstname, lastname, email }); // skapar ny instans av modellen user
        await user.save(); // väntar på att operationen ska slutföras och sparar sedan användaren
        return user;
    } catch (error) {
        throw error;
    }
};

// jämför lösenord
userSchema.methods.comparePassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password); // jämför inskrivet lösenord med de hashade lösenordet som är sparat
    } catch (error) {
        throw error;
    }
};

// logga in
userSchema.statics.login = async function(username, password) {
    try {
        const user = await this.findOne({ username }); // söker efter användare med angivet användarnamn
        if (!user) {
            throw new Error("Invalid username or password");
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            throw new Error("Invalid username or password");
        }
        return user; // returneras om både användarnamn och lösenord är korrekta
    } catch (error) {
        throw error;
    }
};

const User = mongoose.model("User", userSchema); // skapar modell baserat på userSchema
module.exports = User; // exporterar modellen så den kan användas i andra filer