const mongoose = require("mongoose");

const schemaInfoSchema = new mongoose.Schema({
    _id: { type: String },
    __v: Number,
    load_date_time: Date
});

module.exports = mongoose.model.SchemaInfos || mongoose.model("SchemaInfos", schemaInfoSchema);