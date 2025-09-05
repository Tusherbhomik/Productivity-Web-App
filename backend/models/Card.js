import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  type: { type: String, enum: ['note', 'link', 'image'], required: true },
  content: { type: String, required: true },
});

const cardSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'SidebarCategory', required: true },
  title: { type: String, required: true },
  resources: [resourceSchema],
  order: { type: Number, default: 0 },
});

export default mongoose.model('Card', cardSchema);
