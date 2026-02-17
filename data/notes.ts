export interface Complexity {
    time?: string;
    space?: string;
    analysis?: string;
}

export interface Note {
    id: string;
    title: string;
    description: string;
    category?: string; // For Date/Session grouping
    fullDescription: string;
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

export const notes: Note[] = [
    {
        id: "1",
        title: "Valid Triangle",
        description: "Program to check if three given sides form a valid triangle using the Triangle Inequality Theorem.",
        fullDescription: "The notes implement a C program to accept three integer values (a, b, c). It checks the condition: (a+b > c) AND (b+c > a) AND (c+a > b). If all satisfy, it prints 'Yes', otherwise 'No'.",
        tags: ["Basics", "Conditionals", "C"],
        examples: [
            {
                input: "a=6, b=7, c=8",
                output: "Yes",
                explanation: "Sum of any two sides is greater than the third."
            }
        ],
        solutions: [
            {
                title: "Triangle Check Logic",
                language: "c",
                code: `#include <stdio.h>

int main() {
    int a, b, c;
    printf("Enter a,b,c values: ");
    scanf("%d %d %d", &a, &b, &c);
    
    if (a+b > c && b+c > a && c+a > b) {
        printf("Yes\\n");
    } else {
        printf("No\\n");
    }
    return 0;
}`
            },
            {
                title: "Fixed Values",
                language: "c",
                code: `#include <stdio.h>
    int main() {
    int a=6, b=7, c=8;
    if (a+b>c && b+c>a && c+a>b)
        printf("Yes");
    else
        printf("No");
    return 0;
}`
            }
        ]
    },
    {
        id: "2",
        title: "First & Last Occurrence",
        description: "Find the first and last index of a target element K in an array.",
        fullDescription: "The notes define an array as a collection of elements. The problem requires finding the first occurrence (iterating forward) and the last occurrence. Multiple approaches for last occurrence: iterating backward, or calculating index (n-1-i).",
        tags: ["Arrays", "Searching", "Python"],
        complexity: {
            time: "O(N)",
            space: "O(1)",
            analysis: "Requires iterating through the array up to two times (once forward, once backward)."
        },
        examples: [
            {
                input: "Arr: [5,3,4,6,7,3,2,1,7,5], K=7",
                output: "First: 4, Last: 8"
            }
        ],
        solutions: [
            {
                title: "Brute Force",
                language: "python",
                code: `n = int(input())
lst = list(map(int, input().split()))
k = int(input())

#Finding first occurrence
for i in range(n):
    if a[i] == k:
        print(i)
        break

# Finding last occurrence
for i in range(n):
    if a[n-1-i] == k:
        print(n-1-i)
        break`
            },
            {
                title: "State Tracking",
                language: "python",
                code: `n = int(input())
lst = list(map(int, input().split()))
k = int(input())

first = last = -1

for i in range(n):
    if a[i] == k and first == -1:
        first = i
        last = i
    elif a[i] == k:
        last = i

print(first, last)`
            },
            {
                title: "Auxiliary List Method",
                language: "python",
                code: `n = int(input())
lst = list(map(int, input().split()))
k = int(input())

b = []

for i in range(n):
    if a[i] == k:
        b.append(i)

print(b[0], b[-1])`
            }
        ]
    },
    {
        id: "3",
        title: "Run Length Encoding (String Compression)",
        description: "Compress a string by counting consecutive characters (e.g., 'aaabb' -> 'a3b2').",
        fullDescription: "Given a string S, iterate through it and count occurrences of the current character. If the next character is different, print the current character and its count.",
        tags: ["Strings", "Two Pointers", "Python"],
        complexity: {
            time: "O(N)",
            analysis: "Single pass through the string."
        },
        examples: [
            {
                input: "aaabbccdeaa",
                output: "a3b2c2d1e1a2"
            }
        ],
        solutions: [
            {
                title: "String Compression",
                language: "python",
                code: `s = input()
n = len(s)
count = 1

for i in range(n-1):
    if s[i] == s[i+1]:
        count += 1
    else:
        print(s[i], count, sep="", end="")
        count = 1
# Print the last character set
print(s[n-1], count, sep="")`
            }
        ]
    },
    {
        id: "4",
        title: "Binary Representation & Data Types",
        description: "Understanding how integers are stored, signed vs unsigned ranges, and 2's complement.",
        fullDescription: "Notes cover signed integers (using MSB as sign bit) vs unsigned integers. It details 1's complement and 2's complement for negative numbers.",
        tags: ["Computer Architecture", "Bitwise", "Theory"],
        tips: [
            "Range of signed n-bit integer: -2^(n-1) to 2^(n-1) - 1.",
            "Range of unsigned n-bit integer: 0 to 2^n - 1.",
            "Negative numbers are stored as 2's complement."
        ],
        solutions: []
    },
    {
        id: "5",
        title: "Bitwise Operators & Properties",
        description: "Fundamental bitwise operations (AND, OR, XOR, NOT, Shifts) and their properties.",
        fullDescription: "Lists operators: & (AND), | (OR), ^ (XOR), ~ (NOT), << (Left Shift), >> (Right Shift). Key XOR properties noted: a^a = 0, a^0 = a. Also covers swapping two numbers without a temporary variable using XOR.",
        tags: ["Bit Manipulation", "Math"],
        examples: [
            {
                input: "a=1011, b=0101",
                output: "a^b = 1110",
                explanation: "XOR results in 1 only if bits are different."
            }
        ],
        solutions: [
            {
                title: "Swap using XOR",
                language: "cpp",
                code: `// Logic derived from tracing in notes
a = a ^ b;
b = a ^ b;
a = a ^ b;`,
                isPseudo: true
            }
        ]
    },
    {
        id: "6",
        title: "Calculate Power of 2 (2^N)",
        description: "Using Left Shift to calculate 2^N efficiently.",
        fullDescription: "The problem asks to find 2^N. Instead of a loop or `pow` function, use left shift: `1 << N`. The notes warn that for N >= 31, simple `int` overflows.",
        tags: ["Bit Manipulation", "Optimization", "CPP"],
        complexity: {
            time: "O(1)",
            space: "O(1)",
            analysis: "Bitwise shift is a constant time CPU instruction."
        },
        tips: [
            "1 << N is equivalent to 2^N.",
            "Use '1LL << N' or 'unsigned' for values exceeding 32-bit integer limits."
        ],
        solutions: [
            {
                title: "Method 1: Iterative Loop",
                language: "cpp",
                code: `int val = 1;
for (int i = 0; i < N; i++) {
    val = val * 2;
}
return val;`
            },
            {
                title: "Method 2: Bitwise Shift (O(1))",
                language: "cpp",
                code: `long long powerOfTwo(int N) {
    // Use Long Long for N >= 31
    return 1LL << N;
}`
            }
        ]
    },
    {
        id: "7",
        title: "Check if i-th Bit is Set",
        description: "Determine if the bit at index 'i' is 1 or 0 for a number N.",
        fullDescription: "To check the i-th bit, perform an AND operation with a mask created by shifting 1 left by i positions (`1 << i`). Alternatively, right shift N by i and check the last bit.",
        tags: ["Bit Manipulation"],
        solutions: [
            {
                title: "Method 1: Left Shift Mask",
                language: "cpp",
                code: `bool checkBit(int N, int i) {
    if ((N & (1 << i)) != 0) {
        return true;
    }
    return false;
}`
            },
            {
                title: "Method 2: Right Shift Check",
                language: "cpp",
                code: `bool checkBit(int N, int i) {
    return ((N >> i) & 1) == 1;
}`
            }
        ]
    },
    {
        id: "8",
        title: "Count Set Bits",
        description: "Count how many 1s are in the binary representation of N.",
        fullDescription: "Efficiently count set bits. Standard method iterates all bits. Optimized 'Brian Kernighan's Algorithm' uses `N & (N-1)` to remove the last set bit repeatedly.",
        tags: ["Bit Manipulation", "Algorithm"],
        complexity: {
            time: "O(set bits)",
            analysis: "Brian Kernighan's is faster than O(log N) which iterates all bits."
        },
        examples: [
            {
                input: "N = 10 (1010)",
                output: "2",
                explanation: "1010 -> 1000 -> 0000 (2 iterations)"
            }
        ],
        solutions: [
            {
                "title": "Naive Approach (Check all bits)",
                "language": "cpp",
                "code": `int count = 0;
while(N > 0) {
    if (N & 1) count++;
    N = N >> 1;
}`,
                "isPseudo": true
            },
            {
                title: "Brian Kernighan’s Algorithm (Optimal)",
                language: "cpp",
                code: `int countSetBits(int N) {
    int count = 0;
    while (N != 0) {
        N = N & (N - 1); // Removes the rightmost set bit
        count++;
    }
    return count;
}`
            }
        ]
    },
    {
        id: "9",
        title: "Modular Arithmetic & Exponentiation",
        description: "Rules for handling modulo M and calculating (a^N) % m efficiently.",
        fullDescription: "Covers properties (a+b)%m, (a*b)%m, and (a-b)%m. Includes Binary Exponentiation (Iterative) to calculate powers in O(log N).",
        tags: ["Math", "Modular Arithmetic", "Optimization"],
        complexity: {
            time: "O(log N)",
            analysis: "Binary exponentiation halves the power in every step."
        },
        tips: [
            "(a + b) % m = ((a % m) + (b % m)) % m",
            "(a - b) % m = ((a % m) - (b % m) + m) % m  <-- Note the +m"
        ],
        solutions: [
            {
                title: "Iterative Binary Exponentiation",
                language: "cpp",
                code: `int res = 1;
while (N > 0) {
    if (N & 1) { // If N is odd
        res = (res * a) % m;
    }
    a = (a * a) % m;
    N = N >> 1; // Divide N by 2
}
return res;`
            }
        ]
    },
    {
        id: "10",
        title: "Find Divisors of N",
        description: "Find all divisors of a number N, optimizing from O(N) to O(sqrt(N)).",
        fullDescription: "Naive approach iterates 1 to N. Optimized approach iterates 1 to sqrt(N). If `i` divides `N`, then both `i` and `N/i` are divisors.",
        tags: ["Math", "Number Theory", "Optimization"],
        complexity: {
            time: "O(sqrt(N))",
            analysis: "Loop runs up to square root of N."
        },
        solutions: [
            {
                title: "Brute Force O(N)",
                language: "cpp",
                code: `int count = 0;
for (int i = 1; i <= N; i++) {
    if (N % i == 0) count++;
}`
            },
            {
                title: "Count Divisors Optimized",
                language: "cpp",
                code: `int countDivisors(int N) {
    int count = 0;
    for (int i = 1; i * i <= N; i++) {
        if (N % i == 0) {
            if (i == N / i)
                count += 1;
            else
                count += 2;
        }
    }
    return count;
}`
            }
        ]
    },
    {
        id: "11",
        title: "Set Matrix Zeroes",
        description: "If a zero is found in the matrix, set its entire row or column to zero.",
        fullDescription: "Nested loop approach to traverse the matrix. If a[i][j] == 0, it triggers a process to set elements to 0. (WIP)",
        tags: ["Matrix", "2D Arrays", "WIP"],
        solutions: [
            {
                title: "Brute Force Logic",
                language: "python",
                code: `
n,m = map(int,input().split())
a = list(map(int,input().split()))
temp = a.copy()
for i in range(n):
    for j in range(m):
        if a[i][j] == 0:
            for k in range(m):
                temp[i][k] = 0
            for l in range(n):
                temp[l][j] = 0

for row in temp:
    print(*row)`,

            },
            {
                title: "Mark -1 Approach",
                language: "python",
                code: `
for i in range(n):
    for j in range(m):
        if a[i][j] == 0:

            for k in range(m):
                if a[i][k] != 0:
                    a[i][k] = -1

            for l in range(n):
                if a[l][j] != 0:
                    a[l][j] = -1


for i in range(n):
    for j in range(m):
        if a[i][j] == -1:
            a[i][j] = 0`,

            }
        ]
    },
    {
        id: "12",
        title: "Find the Unique Element",
        description: "Given an array where every element appears twice except one, find the unique element.",
        fullDescription: "Approaches: 1. Hash Map (O(N) space) to count frequencies. 2. Bitwise XOR (O(1) space). XOR property `x^x=0` cancels out duplicates.",
        tags: ["Bit Manipulation", "Arrays", "Optimization"],
        complexity: {
            time: "O(N)",
            space: "O(1)",
            analysis: "XOR solution uses constant space compared to O(N) for Hash Map."
        },
        examples: [
            {
                input: "[10, 15, 4, 6, 10, 15, 4]",
                output: "6",
                explanation: "All pairs cancel out via XOR, leaving 6."
            }
        ],
        solutions: [
            {
                title: "Optimal Solution (XOR)",
                language: "python",
                code: `n = int(input())
arr = list(map(int, input().split()))

xor_sum = 0
for x in arr:
    xor_sum = xor_sum ^ x

print(xor_sum)`
            },
            {
                title: "Hash Map Solution (Higher Space)",
                language: "python",
                code: `# Concept only
freq = {}
for x in arr:
    freq[x] = freq.get(x, 0) + 1
for k, v in freq.items():
    if v == 1:
        print(k)`
            }
        ]
    },
    {
        id: "13",
        title: "Time Complexity Analysis",
        description: "Understanding Big-O notation, growth rates, and execution time estimation.",
        fullDescription: "Comparison of comparisons (N^3 vs N^2 vs log N). Estimation of execution time based on input size. Rule of thumb: ~10^8 operations take 1 second.",
        tags: ["Theory", "Big-O"],
        tips: [
            "10^8 operations ≈ 1 second.",
            "For N = 10^5, O(N^2) will TLE. Need O(N log N).",
            "Constants are dropped in Big-O."
        ],
        solutions: []
    }
];
