export interface LinkItem {
    id: string;
    title: string;
    url: string;
    category: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export const links: LinkItem[] = [
    {
        id: '1',
        title: 'Two Sum - LeetCode',
        url: 'https://leetcode.com/problems/two-sum/',
        category: 'Arrays & Hashing',
        difficulty: 'Easy'
    },
    {
        id: '2',
        title: 'Valid Anagram - LeetCode',
        url: 'https://leetcode.com/problems/valid-anagram/',
        category: 'Arrays & Hashing',
        difficulty: 'Easy'
    },
    {
        id: '3',
        title: 'Group Anagrams - LeetCode',
        url: 'https://leetcode.com/problems/group-anagrams/',
        category: 'Arrays & Hashing',
        difficulty: 'Medium'
    },
    {
        id: '4',
        title: 'Top K Frequent Elements - Codeforces',
        url: 'https://codeforces.com/problemset/problem/123/A',  // Placeholder URL
        category: 'Arrays & Hashing',
        difficulty: 'Medium'
    }
];
