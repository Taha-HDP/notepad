const Members = require("../../models/members_model");
const bcrypt = require("bcrypt");
const dateTime = require('node-datetime');
module.exports = new (class Members_controller {
    async signUp(req, res) {
        const uniqe = await Members.findOne({ email: req.body.email });
        if (uniqe) {
            return res.status(400).send();
        }
        const newMember = new Members({
            email: req.body.email,
            password: req.body.password,
            username: req.body.email.substring(0, req.body.email.lastIndexOf("@"))
        });
        const salt = await bcrypt.genSalt(10);
        const new_pass = await bcrypt.hash(req.body.password, salt);
        newMember.password = new_pass;
        await newMember.save();
        const token = newMember.createAuthToken();
        res.header("Access-Control-Expose-headers", "x-auth-token").header("x-auth-token", token).send();
    }
    async login(req, res) {
        const userA = await Members.findOne({ email: req.body.username });
        const userB = await Members.findOne({ username: req.body.username });
        if (userA || userB) {
            let result, token ;
            if (userA) {
                result = await bcrypt.compare(req.body.password, userA.password);
                token = userA.createAuthToken();
            }
            else {
                result = await bcrypt.compare(req.body.password, userB.password);
                token = userB.createAuthToken();
            }
            if (!result) {
                return res.status(404).send();
            }
            res.header("Access-Control-Expose-headers", "x-auth-token").header("x-auth-token", token).send();
        } else {
            return res.status(404).send();
        }
    }
    async member_info(req, res) {
        let user = await Members.findById(req.user._id);
        if (!user) return res.status(404).send();
        res.send(user);
    }
    async edit_member_info(req, res) {
        let user = await Members.findById(req.user._id);
        let result = await Members.findOne({ username: req.body.username });
        if (result) {
            return res.status(400).send();
        } else {
            result = await Members.findOne({ email: req.body.email });
            if (result && result._id != req.user._id) {
                return res.status(400).send();
            }
        }
        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
        user.username = req.body.username;
        user.email = req.body.email;
        await user.save((err) => {
            if (err) {
                return res.status(500).send();
            } else {
                res.status(200).send();
            }
        });
    }
    async change_password(req, res) {
        let user = await Members.findById(req.user._id);
        const result = await bcrypt.compare(req.body.current_password, user.password);
        if (!result) {
            return res.status(400).send();
        } else {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.new_password, salt);
            await user.save((err) => {
                if (err) {
                    return res.status(500).send();
                } else {
                    res.status(200).send();
                }
            });
        }
    }
    async notes(req, res) {
        const user = await Members.findById(req.user._id);
        if (!user)
            res.status(404).send();
        res.send(user.notes);
    }
    async addNote(req, res) {
        const user = await Members.findById(req.user._id);
        const newNote = {
            name: req.body.name,
            text: req.body.text,
            create_date: dateTime.create().format('Y-m-d'),
        }
        user.notes.push(newNote);
        await user.save((err) => {
            if (err) {
                return res.status(500).send();
            } else {
                res.status(200).send();
            }
        });
    }
    async getNote(req, res) {
        const user = await Members.findById(req.user._id);
        user.notes.map((data) => {
            if (data._id == req.params.id) {
                return res.send(data);
            }
        })
    }
    async editNote(req, res) {
        await Members.updateOne({ 'notes._id': req.params.id }, {
            '$set': {
                'notes.$.name': req.body.name,
                'notes.$.text': req.body.text
            }
        })
        res.status(200).send();
    }
    async deleteNote(req, res) {
        await Members.updateOne(
            { "_id": req.user._id },
            { "$pull": { "notes": { "_id": req.params.id } } },
            { "multi": true }
        )
        res.status(200).send();
    }
    async send_email(req, res) {
        const unique = await Members.findOne({ email: req.params.email })
        if (!unique)
            return res.status(404).send();
        let val = Math.floor(1000 + Math.random() * 9000);
        res.status(200).send({ val });
    }
    async new_password(req, res) {
        const user = await Members.findOne({ email: req.body.email })
        const salt = await bcrypt.genSalt(10);
        const new_pass = await bcrypt.hash(req.body.password, salt);
        user.password = new_pass;
        await user.save();
        res.send();
    }
});