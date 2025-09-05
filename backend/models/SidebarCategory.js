import mongoose from 'mongoose';

const sidebarCategorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
});

export default mongoose.model('SidebarCategory', sidebarCategorySchema);
