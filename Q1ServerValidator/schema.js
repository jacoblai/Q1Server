module.exports = {
    type: Object,
    schema: {
        user: { type: String, required: true },
        pass: { type: String, required: true },
        localction: [{ lat: { type: Number }, lon: { type: Number } }],
        ptime: { type: Date }
    }
};