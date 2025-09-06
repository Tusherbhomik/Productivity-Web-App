import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['note', 'link', 'image'], 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    default: '' // Provide a default value instead of leaving it undefined
  },
  description: {
    type: String,
    default: ''
  },
}, {
  _id: true // Explicitly enable _id for subdocuments
});

const cardSchema = new mongoose.Schema({
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SidebarCategory', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  resources: {
    type: [resourceSchema],
    default: [] // Provide a default empty array
  },
  order: { 
    type: Number, 
    default: 0 
  },
}, {
  timestamps: true, // Add createdAt and updatedAt timestamps
  toJSON: { virtuals: true }, // Include virtuals when converting to JSON
  toObject: { virtuals: true } // Include virtuals when converting to Object
});

// Add index for better query performance
cardSchema.index({ category: 1, order: 1 });

export default mongoose.model('Card', cardSchema);