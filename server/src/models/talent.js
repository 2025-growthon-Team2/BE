const mongoose = require('mongoose');
const talentSchema = new mongoose.Schema({
    writer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appliedTalents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    matchedTalents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    category: {type: String, required: true},
    title: {type: String, required: true},
    subtitle: {type: String, required: true},
    shortDescription: { type: String, required: true },
    detailedDescription: { type: String, required: true },
    address: { type: String, required: true },
    status: {type: String},
    createdAt: {type: Date, required: true},
    teachAt: {type: Date, required: true}
});

module.exports = mongoose.model('Talent', talentSchema);