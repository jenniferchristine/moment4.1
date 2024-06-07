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
userSchema.statics.register = async function(username, password) {
    try {
        const user = new this({ username, password }); // skapar ny instans av modellen user
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
        const user = await this.findOne(); // söker efter användare med angivet användarnamn
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