

import random



def total(nums):
    """Recursively sum a list of numbers."""
    if not nums:
        return 0  # base case: empty list sums to 0
    first, *rest = nums
    return first + total(rest)


def count_down(n):
    """Recursively print n, n-1, ..., down to 1."""
    if n < 1:
        return  # base case: nothing left to print
    print(n)
    count_down(n - 1)


def demo_recursion():
    print("\n========== 1. Recursive Sum & Count Down ==========")
    nums = [10, 20, 30, 40, 50]
    print(f"total({nums}) = {total(nums)}")

    print("\ncount_down(5):")
    count_down(5)




def binary_search(items, target):
    """
    Iterative binary search on a sorted list.
    Returns the index of `target`, or -1 if it isn't present.
    O(log n): each step halves the remaining search space.
    """
    low, high = 0, len(items) - 1

    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1


def demo_binary_search():
    print("\n========== 2. Binary Search ==========")
    balances = sorted([1200, 500, 27000, 11550, 600, 8300, 42000, 150])
    print("Sorted balances:", balances)

    for target in (600, 42000, 999):
        idx = binary_search(balances, target)
        print(f"binary_search(balances, {target}) -> index {idx}")





def merge(left, right):
    """Merge two already-sorted lists into one sorted list."""
    merged = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1

    # Append whatever is left over (only one of these has items in it)
    merged.extend(left[i:])
    merged.extend(right[j:])

    return merged


def merge_sort(items):
    """Classic recursive merge sort. O(n log n)."""
    if len(items) <= 1:
        return items  # base case: a list of 0 or 1 items is already sorted

    mid = len(items) // 2
    left_half = merge_sort(items[:mid])
    right_half = merge_sort(items[mid:])

    return merge(left_half, right_half)


def demo_merge_sort():
    print("\n========== 3. Merge Sort ==========")

    for trial in range(3):
        random_list = [random.randint(-100, 100) for _ in range(20)]
        mine = merge_sort(random_list)
        builtin = sorted(random_list)
        matches = mine == builtin
        print(f"Trial {trial + 1}: merge_sort matches sorted()? {matches}")
        if not matches:
            print("  Mismatch!")
            print("  merge_sort:", mine)
            print("  sorted()  :", builtin)


# =====================================================================
# 4. Sort with a key
# =====================================================================

def demo_sort_with_key():
    print("\n========== 4. Sort with a Key ==========")

    accounts = [
        ("Semu", 11550.00),
        ("Abebe", 500.00),
        ("Marta", 27000.00),
        ("Kebede", 600.00),
    ]

    by_balance_desc = sorted(accounts, key=lambda acc: acc[1], reverse=True)

    print("Original         :", accounts)
    print("Sorted by balance (descending):")
    for name, balance in by_balance_desc:
        print(f"  {name:<8} {balance:,.2f} ETB")


# =====================================================================
# 5. Two pointers
# =====================================================================

def has_pair(nums, target):
    """
    Given a SORTED list, return True if any two distinct values sum to
    target, else False. Uses the two-pointer technique: O(n) time,
    O(1) extra space - one pass instead of checking every pair (O(n^2)).
    """
    left, right = 0, len(nums) - 1

    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return True
        elif current_sum < target:
            left += 1   # sum too small, need a bigger left value
        else:
            right -= 1  # sum too big, need a smaller right value

    return False


def demo_two_pointers():
    print("\n========== 5. Two Pointers ==========")
    nums = sorted([150, 500, 600, 1200, 8300, 11550])
    print("Sorted nums:", nums)

    for target in (1700, 8900, 999999):
        result = has_pair(nums, target)
        print(f"has_pair(nums, {target}) -> {result}")




if __name__ == "__main__":
    demo_recursion()
    demo_binary_search()
    demo_merge_sort()
    demo_sort_with_key()
    demo_two_pointers()