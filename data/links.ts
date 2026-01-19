export interface LinkItem {
    id: string;
    title: string;
    url: string;
    category: string; // Used for Date grouping
    platform?: 'SmartInterviews' | 'LeetCode' | 'InterviewBit' | 'Codeforces' | 'Other';
    difficulty?: 'Easy' | 'Medium' | 'Hard'; // Keeping for backward compatibility or manual override
}

export const links: LinkItem[] = [
    // 13/08/2025
    {
        id: '13-08-1',
        title: 'Power of 2',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/power-of-2',
        category: '13/08/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '13-08-2',
        title: 'Binary Representation',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/binary-representation',
        category: '13/08/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '13-08-3',
        title: 'Count Set Bits',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/count-set-bits',
        category: '13/08/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '13-08-4',
        title: 'X 1s and Y 0s',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/x-1s-and-y-0s',
        category: '13/08/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '13-08-5',
        title: 'X and Y Set Bits',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/x-and-y-set-bits',
        category: '13/08/2025',
        platform: 'SmartInterviews'
    },

    // 29/08/2025
    {
        id: '29-08-1',
        title: 'SI Sample Codes',
        url: 'https://smartinterviews.in/samplecodes/',
        category: '29/08/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '29-08-2',
        title: 'SI Primary Contest',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary',
        category: '29/08/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '29-08-3',
        title: 'SI Basic Contest',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-basic/problems',
        category: '29/08/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '29-08-4',
        title: 'Single Number',
        url: 'https://leetcode.com/problems/single-number',
        category: '29/08/2025',
        platform: 'LeetCode'
    },
    {
        id: '29-08-5',
        title: 'Binary Gap',
        url: 'https://leetcode.com/problems/binary-gap',
        category: '29/08/2025',
        platform: 'LeetCode'
    },
    {
        id: '29-08-6',
        title: 'Hamming Distance',
        url: 'https://leetcode.com/problems/hamming-distance',
        category: '29/08/2025',
        platform: 'LeetCode'
    },
    {
        id: '29-08-7',
        title: 'Number Complement',
        url: 'https://leetcode.com/problems/number-complement',
        category: '29/08/2025',
        platform: 'LeetCode'
    },
    {
        id: '29-08-8',
        title: 'Number of 1 Bits',
        url: 'https://www.interviewbit.com/problems/number-of-1-bits',
        category: '29/08/2025',
        platform: 'InterviewBit'
    },
    {
        id: '29-08-9',
        title: 'Single Number (IB)',
        url: 'https://www.interviewbit.com/problems/single-number',
        category: '29/08/2025',
        platform: 'InterviewBit'
    },
    {
        id: '29-08-10',
        title: 'Trailing Zeroes',
        url: 'https://www.interviewbit.com/problems/trailing-zeroes',
        category: '29/08/2025',
        platform: 'InterviewBit'
    },
    {
        id: '29-08-11',
        title: 'Reverse Bits',
        url: 'https://www.interviewbit.com/problems/reverse-bits',
        category: '29/08/2025',
        platform: 'InterviewBit'
    },

    // 03/09/2025
    {
        id: '03-09-1',
        title: 'Time Complexity Course',
        url: 'https://www.interviewbit.com/courses/programming/time-complexity/',
        category: '03/09/2025',
        platform: 'InterviewBit'
    },
    {
        id: '03-09-2',
        title: 'Internal Contest IC1',
        url: 'https://hive.smartinterviews.in/contests/cmrit-cmrtc-2028-ic1',
        category: '03/09/2025',
        platform: 'SmartInterviews'
    },

    // 08/10/2025
    {
        id: '08-10-1',
        title: 'a power b',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/a-power-b',
        category: '08/10/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '08-10-2',
        title: 'Triple Trouble',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/triple-trouble',
        category: '08/10/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '08-10-3',
        title: 'Repeated Numbers',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/repeated-numbers',
        category: '08/10/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '08-10-4',
        title: 'XOR of Sum of Pairs',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/xor-of-sum-of-pairs',
        category: '08/10/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '08-10-5',
        title: 'Sum of XOR of Pairs',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/sum-of-xor-of-pairs',
        category: '08/10/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '08-10-6',
        title: 'Finding Missing Number',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/finding-missing-number',
        category: '08/10/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '08-10-7',
        title: 'Single Element',
        url: 'https://leetcode.com/problems/single-number/description/',
        category: '08/10/2025',
        platform: 'LeetCode'
    },

    // 15/10/2025
    {
        id: '15-10-1',
        title: 'Tower of Hanoi',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/tower-of-hanoi',
        category: '15/10/2025',
        platform: 'SmartInterviews'
    },

    // 16/12/2025
    {
        id: '16-12-1',
        title: 'Bubble Sort',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/bubble-sort',
        category: '16/12/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '16-12-2',
        title: 'Selection Sort',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/selection-sort',
        category: '16/12/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '16-12-3',
        title: 'Insertion Sort',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/insertion-sort',
        category: '16/12/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '16-12-4',
        title: 'Sort 0s and 1s',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/sort-0s-and-1s',
        category: '16/12/2025',
        platform: 'SmartInterviews'
    },

    // 22/12/2025
    {
        id: '22-12-1',
        title: 'Merge Sorted Array',
        url: 'https://leetcode.com/problems/merge-sorted-array/description/',
        category: '22/12/2025',
        platform: 'LeetCode'
    },
    {
        id: '22-12-2',
        title: 'Smaller Elements',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/smaller-elements',
        category: '22/12/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '22-12-3',
        title: 'Sum of Pairs',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/sum-of-pairs',
        category: '22/12/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '22-12-4',
        title: 'Pair with Difference K',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/pair-with-difference-k',
        category: '22/12/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '22-12-5',
        title: 'Triplet with Sum K',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/triplet-with-sum-k',
        category: '22/12/2025',
        platform: 'SmartInterviews'
    },

    // 23/12/2025
    {
        id: '23-12-1',
        title: 'Finding the Floor',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/finding-the-floor',
        category: '23/12/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '23-12-2',
        title: 'Finding Frequency',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/finding-frequency',
        category: '23/12/2025',
        platform: 'SmartInterviews'
    },

    // 29/12/2025
    {
        id: '29-12-1',
        title: 'Finding CubeRoot',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/finding-cuberoot',
        category: '29/12/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '29-12-2',
        title: 'Cabinets Partitioning',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/cabinets-partitioning',
        category: '29/12/2025',
        platform: 'SmartInterviews'
    },
    {
        id: '29-12-3',
        title: 'Protective Villagers',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/protective-villagers',
        category: '29/12/2025',
        platform: 'SmartInterviews'
    },

    // 05/01/2026
    {
        id: '05-01-1',
        title: 'Non Decreasing Subsequences',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/non-decreasing-subsequences',
        category: '05/01/2026',
        platform: 'SmartInterviews'
    },
    {
        id: '05-01-2',
        title: 'Maximum Contiguous Subsequence',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/maximum-contiguous-subsequence',
        category: '05/01/2026',
        platform: 'SmartInterviews'
    },
    {
        id: '05-01-3',
        title: 'Rearrange Sequence 1',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/rearrange-sequence-1',
        category: '05/01/2026',
        platform: 'SmartInterviews'
    },
    {
        id: '05-01-4',
        title: 'Rearrange Sequence 2',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/rearrange-sequence-2',
        category: '05/01/2026',
        platform: 'SmartInterviews'
    },
    {
        id: '05-01-5',
        title: 'Rearrange Sequence 3',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/rearrange-sequence-3',
        category: '05/01/2026',
        platform: 'SmartInterviews'
    },
    {
        id: '05-01-6',
        title: 'Distinct Elements in Window',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/distinct-elements-in-window',
        category: '05/01/2026',
        platform: 'SmartInterviews'
    },

    // 06/01/2026 (Backlog/Review)
    {
        id: '06-01-1',
        title: 'Print Hollow Diamond Pattern',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/print-hollow-diamond-pattern',
        category: '06/01/2026 (Review)',
        platform: 'SmartInterviews'
    },
    {
        id: '06-01-2',
        title: 'Checkerboard Pattern',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/checkerboard-pattern',
        category: '06/01/2026 (Review)',
        platform: 'SmartInterviews'
    },
    {
        id: '06-01-3',
        title: 'Spiral Pattern',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/spiral-pattern',
        category: '06/01/2026 (Review)',
        platform: 'SmartInterviews'
    },
    {
        id: '06-01-4',
        title: 'Rotation of Matrix',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/rotation-of-matrix',
        category: '06/01/2026 (Review)',
        platform: 'SmartInterviews'
    },
    {
        id: '06-01-5',
        title: 'Diagonal Traversal of Matrix',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/diagonal-traversal-of-matrix',
        category: '06/01/2026 (Review)',
        platform: 'SmartInterviews'
    },
    {
        id: '06-01-6',
        title: 'Spiral Traversal of Matrix',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/spiral-traversal-of-matrix',
        category: '06/01/2026 (Review)',
        platform: 'SmartInterviews'
    },
    {
        id: '06-01-7',
        title: 'Product of 2 Matrices',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/product-of-2-matrices',
        category: '06/01/2026 (Review)',
        platform: 'SmartInterviews'
    },
    {
        id: '06-01-8',
        title: 'Flip Bits',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/flip-bits',
        category: '06/01/2026 (Review)',
        platform: 'SmartInterviews'
    },
    {
        id: '06-01-9',
        title: 'Balanced Parentheses',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/balanced-parentheses',
        category: '06/01/2026 (Review)',
        platform: 'SmartInterviews'
    },
    {
        id: '06-01-10',
        title: 'Smart Square',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/smart-square',
        category: '06/01/2026 (Review)',
        platform: 'SmartInterviews'
    },
    {
        id: '06-01-11',
        title: 'Power Game',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/power-game',
        category: '06/01/2026 (Review)',
        platform: 'SmartInterviews'
    },

    // 13/01/2026
    {
        id: '13-01-1',
        title: 'Product of XOR of Pairs',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/product-of-xor-of-pairs',
        category: '13/01/2026',
        platform: 'SmartInterviews'
    },
    {
        id: '13-01-2',
        title: 'Tower of Hanoi Modified',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/tower-of-hanoi-modified',
        category: '13/01/2026',
        platform: 'SmartInterviews'
    },
    {
        id: '13-01-3',
        title: 'N - Queens',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/n-queens',
        category: '13/01/2026',
        platform: 'SmartInterviews'
    },
    {
        id: '13-01-4',
        title: 'Interleavings',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/interleavings',
        category: '13/01/2026',
        platform: 'SmartInterviews'
    },
    {
        id: '13-01-5',
        title: 'First Repeating Character - 1',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/first-repeating-character-1',
        category: '13/01/2026',
        platform: 'SmartInterviews'
    },
    {
        id: '13-01-6',
        title: 'First Repeating Character - 2',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/first-repeating-character-2',
        category: '13/01/2026',
        platform: 'SmartInterviews'
    },
    {
        id: '13-01-7',
        title: 'Check Anagrams',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/check-anagrams',
        category: '13/01/2026',
        platform: 'SmartInterviews'
    },
    {
        id: '13-01-8',
        title: 'Longest Palindromic Substring',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/longest-palindromic-substring',
        category: '13/01/2026',
        platform: 'SmartInterviews'
    },
    {
        id: '13-01-9',
        title: 'Enclosing Substring',
        url: 'https://hive.smartinterviews.in/contests/smart-interviews-primary/problems/enclosing-substring',
        category: '13/01/2026',
        platform: 'SmartInterviews'
    }
];
