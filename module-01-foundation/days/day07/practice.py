

import time
import random
from collections import deque



def snippet_list_index(items, i):

    return items[i]


def snippet_single_loop(items):

    total = 0
    for x in items:
        total += x
    return total


def snippet_nested_loop(items):

    pairs = 0
    for i in items:
        for j in items:
            pairs += 1
    return pairs


def snippet_dict_lookup(d, key):
   
    return d.get(key)


def snippet_binary_search(sorted_items, target):
   
    low, high = 0, len(sorted_items) - 1
    while low <= high:
        mid = (low + high) // 2
        if sorted_items[mid] == target:
            return mid
        elif sorted_items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1


def demo_big_o():
    print("\n========== 1. Big-O Demo ==========")
    nums = list(range(10))
    sorted_nums = sorted(nums)
    lookup = {n: f"account-{n}" for n in nums}

    print("list index [3]      ->", snippet_list_index(nums, 3), " (O(1))")
    print("sum via single loop ->", snippet_single_loop(nums), " (O(n))")
    print("pairs via nested loop ->", snippet_nested_loop(nums), " (O(n^2))")
    print("dict lookup key=7   ->", snippet_dict_lookup(lookup, 7), " (O(1) avg)")
    print("binary search for 8 ->", snippet_binary_search(sorted_nums, 8), " (O(log n))")




def demo_list_vs_dict():
    print("\n========== 2. List vs. Dict Lookup ==========")

    n = 100_000

    accounts = [f"ACC-{i:06d}" for i in range(n)]
    accounts_dict = {acc: True for acc in accounts}

   
    target = accounts[n - 10]

  
    start = time.perf_counter()
    found_in_list = target in accounts
    list_time = time.perf_counter() - start

 
    start = time.perf_counter()
    found_in_dict = target in accounts_dict
    dict_time = time.perf_counter() - start

    print(f"Searching for {target} among {n:,} accounts")
    print(f"List lookup  ({found_in_list}): {list_time * 1_000_000:.2f} microseconds")
    print(f"Dict lookup  ({found_in_dict}): {dict_time * 1_000_000:.2f} microseconds")
    print(f"Dict was about {list_time / dict_time:,.0f}x faster")
    print("Why: the list has to scan almost every element (O(n)) to reach")
    print("something near the end, while the dict jumps straight to the")
    print("right bucket via hashing (O(1) average).")




class Stack:
    """Simple LIFO stack backed by a Python list."""

    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        if self.is_empty():
            raise IndexError("pop from an empty stack")
        return self._items.pop()

    def peek(self):
        if self.is_empty():
            raise IndexError("peek from an empty stack")
        return self._items[-1]

    def is_empty(self):
        return len(self._items) == 0

    def __len__(self):
        return len(self._items)


def reverse_names_with_stack(names):
    stack = Stack()
    for name in names:
        stack.push(name)

    reversed_names = []
    while not stack.is_empty():
        reversed_names.append(stack.pop())

    return reversed_names


def demo_stack():
    print("\n========== 3. Stack ==========")
    names = ["Semu", "Abebe", "Marta", "Kebede", "Sara"]
    print("Original :", names)

    reversed_names = reverse_names_with_stack(names)
    print("Reversed :", reversed_names)

    # A quick peek/pop trace to show the stack in action
    s = Stack()
    for n in names:
        s.push(n)
    print("Peek (top of stack) :", s.peek())
    print("Pop                 :", s.pop())
    print("Peek after pop      :", s.peek())



def demo_queue():
    print("\n========== 4. Queue (Bank Service Line) ==========")

    line = deque()

    customers = ["Semu", "Abebe", "Marta", "Kebede", "Sara"]
    for customer in customers:
        line.append(customer)  # enqueue at the back
        print(f"{customer} joined the line.")

    print("\nNow serving customers in order (FIFO):")
    while line:
        customer = line.popleft()  # serve from the front
        print(f"  Serving {customer}...")

    print("Line is now empty:", len(line) == 0)



class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next


class LinkedList:
    """Singly linked list with push_front and print_all."""

    def __init__(self):
        self.head = None

    def push_front(self, value):
        new_node = Node(value, next=self.head)
        self.head = new_node

    def print_all(self):
        values = []
        current = self.head
        while current is not None:
            values.append(str(current.value))
            current = current.next
        print(" -> ".join(values) if values else "(empty list)")


def demo_linked_list():
    print("\n========== 5. Singly Linked List ==========")

    ll = LinkedList()
    print("Empty list:", end=" ")
    ll.print_all()

    for account_number in ["ACC-001", "ACC-002", "ACC-003", "ACC-004"]:
        ll.push_front(account_number)

    print("After push_front('ACC-001'..'ACC-004'):")
    ll.print_all()
    print("(Note: push_front means the LAST one pushed ends up at the head,")
    print(" so ACC-004 appears first.)")



if __name__ == "__main__":
    demo_big_o()
    demo_list_vs_dict()
    demo_stack()
    demo_queue()
    demo_linked_list()