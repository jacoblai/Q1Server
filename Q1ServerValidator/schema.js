module.exports = {
    type: Object,
    schema: {
        user: { type: String, required: true },
        pass: { type: String, required: true },
        localction: [{ lat: { type: String }, lon: { type: String } }],
        ptime: { type: Date }
    }
};