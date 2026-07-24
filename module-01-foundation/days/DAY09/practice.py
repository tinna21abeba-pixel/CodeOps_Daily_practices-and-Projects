

from collections import deque
import heapq


class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(root, value):
    """Insert value into the BST rooted at root. Returns the (possibly new) root."""
    if root is None:
        return Node(value)
    if value < root.value:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)
    return root


def inorder(root, result=None):
    """In-order traversal: left, node, right. Produces sorted order for a BST."""
    if result is None:
        result = []
    if root:
        inorder(root.left, result)
        result.append(root.value)
        inorder(root.right, result)
    return result




def height(node):
    """Height = number of edges on the longest path to a leaf.
    Empty tree -> -1, single node -> 0."""
    if node is None:
        return -1
    return 1 + max(height(node.left), height(node.right))




def bfs(graph, start):
    """Breadth-first search. Returns (set of reachable vertices, visit order list)."""
    visited = {start}
    queue = deque([start])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return visited, order



def dfs(graph, start, visited=None, order=None):
    """Depth-first search. Returns (set of reachable vertices, visit order list)."""
    if visited is None:
        visited = set()
        order = []
    visited.add(start)
    order.append(start)
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited, order)
    return visited, order




def run_priority_queue_demo(tasks):
    """Push (priority, task) tuples in mixed order, pop them all in priority order."""
    pq = []
    for priority, task in tasks:
        heapq.heappush(pq, (priority, task))

    popped = []
    while pq:
        popped.append(heapq.heappop(pq))
    return popped



def main():
    print("=" * 60)
    print("1. BST + in-order traversal")
    print("=" * 60)
    values = [50, 30, 70, 20, 40, 60, 80]
    root = None
    for v in values:
        root = insert(root, v)
    print(f"Inserted:  {values}")
    print(f"In-order:  {inorder(root)}")

    print()
    print("=" * 60)
    print("2. Tree height")
    print("=" * 60)
    print(f"Height of BST above: {height(root)}")

    print()
    print("=" * 60)
    print("3 & 4. Graph BFS vs DFS")
    print("=" * 60)
    graph = {
        'A': ['B', 'C'],
        'B': ['A', 'D', 'E'],
        'C': ['A', 'F'],
        'D': ['B'],
        'E': ['B', 'F'],
        'F': ['C', 'E'],
    }

    bfs_reachable, bfs_order = bfs(graph, 'A')
    dfs_reachable, dfs_order = dfs(graph, 'A')

    print(f"Graph: {graph}")
    print(f"BFS reachable set: {bfs_reachable}")
    print(f"BFS visit order:   {bfs_order}")
    print(f"DFS reachable set: {dfs_reachable}")
    print(f"DFS visit order:   {dfs_order}")

    print()
    print("=" * 60)
    print("5. Priority queue with heapq")
    print("=" * 60)
    tasks = [
        (3, "write report"),
        (1, "fix critical bug"),
        (4, "reply to email"),
        (2, "review PR"),
        (5, "clean desk"),
    ]
    print(f"Pushed (mixed order): {tasks}")
    popped = run_priority_queue_demo(tasks)
    print("Popped (priority order):")
    for priority, task in popped:
        print(f"  {priority}  {task}")


if __name__ == "__main__":
    main()