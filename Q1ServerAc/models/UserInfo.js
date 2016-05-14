module.exports = {
    userId: { type: String, required: true, match: /^[a-zA-Z0-9]+$/ },
    pwd: { type: String, required: true, match: /^[a-zA-Z0-9]+$/ },
    userName: { type: String },
    department: { type: String },
    mobilePhone: { type: String }
};