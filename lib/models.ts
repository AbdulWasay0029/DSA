import mongoose, { Schema } from 'mongoose';

// --- Sub-schemas for cleaner structure ---
const ComplexitySchema = new Schema({
    time: String,
    space: String,
    analysis: String
}, { _id: false });

const ExampleSchema = new Schema({
    input: { type: String, required: true },
    output: String,
    explanation: String
}, { _id: false });

const SolutionSchema = new Schema({
    title: { type: String, required: true },
    language: { type: String, default: 'python' },
    code: { type: String, required: true },
    isPseudo: { type: Boolean, default: false },
    complexity: ComplexitySchema
}, { _id: false });

// --- Main Note Schema ---
const NoteSchema = new Schema({
    // We can use MongoDB's default _id, but we used string 'id' in our app.
    // Let's keep a consistent 'id' field for URL-friendliness if we want, 
    // or just map _id to id. For now, let's allow a custom id if provided, else defaults.
    id: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    fullDescription: { type: String, default: '' },
    tags: [String],
    tips: [String],
    examples: [ExampleSchema],
    solutions: [SolutionSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// --- Suggestion Schema ---
// Extending Note structure but with suggestion-specific metadata
const SuggestionSchema = new Schema({
    // Base Note Data embedded
    title: String,
    description: String,
    fullDescription: String,
    tags: [String],
    tips: [String],
    examples: [ExampleSchema],
    solutions: [SolutionSchema],

    // Suggestion Metadata
    suggestionId: { type: String, unique: true, required: true },
    originalId: String, // If editing an existing note
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    submittedBy: String, // Email or User ID if available
    submittedAt: { type: Date, default: Date.now }
});

// --- User Progress Schema ---
// Tracks user completion since we are using JWT strategy (no User collection by default)
const UserProgressSchema = new Schema({
    email: { type: String, required: true, unique: true },
    completedNotes: { type: [String], default: [] }, // Array of Note IDs
    lastActive: { type: Date, default: Date.now }
});

// --- Link Schema ---
const LinkSchema = new Schema({
    id: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    category: { type: String, required: true },
    platform: { type: String, default: 'Other' },
    difficulty: String,
    createdAt: { type: Date, default: Date.now }
});

// Prevent overwriting models if they already exist (hot reload issue in dev)
export const NoteModel = mongoose.models.Note || mongoose.model('Note', NoteSchema);
export const SuggestionModel = mongoose.models.Suggestion || mongoose.model('Suggestion', SuggestionSchema);
export const UserProgress = mongoose.models.UserProgress || mongoose.model('UserProgress', UserProgressSchema);
export const LinkModel = mongoose.models.Link || mongoose.model('Link', LinkSchema);
