export interface Complexity {
    time?: string;
    space?: string;
    analysis?: string;
}

export interface Note {
    id: string;
    title: string;
    description: string;
    date?: Date | string; // Date when the problem was studied/created
    fullDescription: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    tags?: string[]; // e.g. "Incomplete", "Concept", "Important"
    tips?: string[]; // For tips, tricks, and side notes found on the page
    complexity?: Complexity; // General complexity for the problem/note
    examples?: {     // For example arrays, input/output cases drawn in notes
        input: string;
        output?: string;
        explanation?: string;
    }[];
    solutions: {
        title: string;
        language: string;
        code: string;
        isPseudo?: boolean; // For incomplete code or logic outlines
        complexity?: Complexity; // Complexity specific to a solution
    }[];
}

export interface Suggestion extends Note {
    originalId?: string; // If editing an existing note
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    suggestionId?: string;
    submittedBy?: string; // Added field based on usage in API routes
}

export interface LinkItem {
    id: string;
    title: string;
    url: string;
    category: string;
    platform?: string;
    difficulty?: string;
}
