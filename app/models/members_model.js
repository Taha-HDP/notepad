const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const schema_note = new mongoose.Schema({
    name: { type: String, required: true },
    text: { type: String, required: true },
    create_date : String ,
})
const schema = new mongoose.Schema({
    username: { type: String , unique : true },
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    password: String,
    notes: [schema_note] ,
});

schema.methods.createAuthToken = function () {
    const data = {
        _id: this.id,
        name: this.username,
        email: this.email,
    }
    return jwt.sign(data, config.get("jwtPrivetKey"));
}
const MemberModel = mongoose.model('member', schema);

module.exports = MemberModel;