export interface Note {
    id: string;
    title: string;
    description: string;
    fullDescription: string;
    solutions: {
        title: string;
        language: string;
        code: string;
    }[];
}

export const notes: Note[] = [
    {
        id: '1',
        title: 'Two Sum',
        description: 'Find indices of two numbers that add up to target.',
        fullDescription: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
        solutions: [
            {
                title: 'Brute Force',
                language: 'python',
                code: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`
            },
            {
                title: 'Hash Map (Optimized)',
                language: 'python',
                code: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`
            }
        ]
    },
    {
        id: '2',
        title: 'Reverse Linked List',
        description: 'Reverse a singly linked list.',
        fullDescription: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        solutions: [
            {
                title: 'Iterative',
                language: 'python',
                code: `def reverseList(head):
    prev = None
    curr = head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev`
            },
            {
                title: 'Recursive',
                language: 'python',
                code: `def reverseList(head):
    if not head or not head.next:
        return head
    p = reverseList(head.next)
    head.next.next = head
    head.next = None
    return p`
            }
        ]
    }
];
