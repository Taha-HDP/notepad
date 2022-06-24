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
        });
        const salt = await bcrypt.genSalt(10);
        const new_pass = await bcrypt.hash(req.body.password, salt);
        newMember.password = new_pass;
        await newMember.save();
        const token = newMember.createAuthToken();
        res.header("Access-Control-Expose-headers", "x-auth-token").header("x-auth-token", token).send();
    }
    async login(req, res) {
        const userA = await Customer.findOne({ email: req.body.username });
        const userB = await Customer.findOne({ username: req.body.username });
        if (userA || userB) {
            let result;
            if (userA)
                result = await bcrypt.compare(req.body.password, userA.password);
            else
                result = await bcrypt.compare(req.body.password, userB.password);
            if (!result) {
                return res.status(404).send();
            }
            const token = userA.createAuthToken();
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
        let user = await Customer.findById(req.user._id);
        const result = await bcrypt.compare(req.body.current, user.password);
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
        const newNote = new Notes({
            name: req.body.name,
            data: req.body.data,
            create_date: dateTime.create().format('Y-m-d'),
            person: req.user._id,
        });
        item.notes.push(newNote);
        await user.save((err) => {
            if (err) {
                return res.status(500).send();
            } else {
                res.status(200).send();
            }
        });
    }
    async editNote(req, res) {
        await Members.updateMany({ _id: req.user._id }, {
            $set: {
                name: req.body.name,
                text: req.body.text
            }
        })
        res.status(200).send();
    }
    async deleteNote(req, res) {
        await Members.updateMany(
            {},
            { $pull: { notes: { _id: req.params.id } } }
        );
        res.status(200).send();
    }
});