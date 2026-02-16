import fs from 'fs/promises';
import path from 'path';
import { Note } from '@/data/notes'; // We will use the type definition, though we might need to move the interface to a shared file later.

// Since we are server-side in API routes, we can use absolute paths or process.cwd()
const DATA_DIR = path.join(process.cwd(), 'data');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');
const SUGGESTIONS_FILE = path.join(DATA_DIR, 'suggestions.json');

export interface Suggestion extends Note {
    originalId?: string; // If editing an existing note
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    suggestionId?: string;
}

export async function getNotes(): Promise<Note[]> {
    try {
        const data = await fs.readFile(NOTES_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading notes:", error);
        return [];
    }
}

export async function saveNotes(notes: Note[]): Promise<void> {
    await fs.writeFile(NOTES_FILE, JSON.stringify(notes, null, 2), 'utf-8');
}

export async function getSuggestions(): Promise<Suggestion[]> {
    try {
        const data = await fs.readFile(SUGGESTIONS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty
        return [];
    }
}

export async function saveSuggestions(suggestions: Suggestion[]): Promise<void> {
    await fs.writeFile(SUGGESTIONS_FILE, JSON.stringify(suggestions, null, 2), 'utf-8');
}

// --- Links Storage ---
const LINKS_FILE = path.join(DATA_DIR, 'links.json');

export interface LinkItem {
    id: string;
    title: string;
    url: string;
    category: string;
    platform?: string;
    difficulty?: string;
}

export async function getLinks(): Promise<LinkItem[]> {
    try {
        const data = await fs.readFile(LINKS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function saveLinks(links: LinkItem[]): Promise<void> {
    await fs.writeFile(LINKS_FILE, JSON.stringify(links, null, 2), 'utf-8');
}
