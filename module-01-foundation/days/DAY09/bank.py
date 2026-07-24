

from collections import deque




class BankConfig:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.interest_rate = 0.05
            cls._instance.overdraft_limit = 1000
        return cls._instance


# ---------------------- Observer Pattern ----------------------

class SMSAlert:
    def update(self, message):
        print(f"[SMS] {message}")


class AuditLog:
    def update(self, message):
        print(f"[AUDIT] {message}")


# ---------------------- Account Classes ----------------------

class Account:

    def __init__(self, owner, account_number, balance=0):
        self.owner = owner
        self.account_number = account_number
        self._balance = balance
        self._observers = []
        self._history = []  # stack of transactions, most recent at the end

    @property
    def balance(self):
        return self._balance

    @property
    def history(self):
        """Read-only view of this account's transaction history."""
        return self._history

    def subscribe(self, observer):
        self._observers.append(observer)

    def _notify(self, message):
        for observer in self._observers:
            observer.update(message)

    def _push_history(self, tx_type, amount):
        """Push a transaction record onto this account's history stack."""
        self._history.append({
            "type": tx_type,
            "amount": amount,
            "balance_after": self.balance,
        })

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be greater than zero")

        self._balance += amount
        self._push_history("deposit", amount)
        self._notify(
            f"{self.owner} deposited {amount} ETB. Balance = {self.balance} ETB"
        )

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be greater than zero")

        if amount > self.balance:
            raise ValueError("Insufficient balance")

        self._balance -= amount
        self._push_history("withdraw", amount)

        self._notify(
            f"{self.owner} withdrew {amount} ETB. Balance = {self.balance} ETB"
        )

    def undo_last(self):
        """Pop the most recent transaction and reverse its effect on the balance."""
        if not self._history:
            print(f"[UNDO] No transactions to undo for {self.owner}")
            return None

        last_tx = self._history.pop()

        if last_tx["type"] == "deposit":
            self._balance -= last_tx["amount"]
            self._notify(
                f"UNDO: reversed a deposit of {last_tx['amount']} ETB for "
                f"{self.owner}. Balance = {self.balance} ETB"
            )
        elif last_tx["type"] == "withdraw":
            self._balance += last_tx["amount"]
            self._notify(
                f"UNDO: reversed a withdrawal of {last_tx['amount']} ETB for "
                f"{self.owner}. Balance = {self.balance} ETB"
            )

        return last_tx

    def statement(self):
        print("\n----- ACCOUNT STATEMENT -----")
        print(f"Owner   : {self.owner}")
        print(f"Account : {self.account_number}")
        print(f"Balance : {self.balance:.2f} ETB")


# ---------------------- Savings ----------------------

class SavingsAccount(Account):

    def __init__(self, owner, account_number, balance=0):
        super().__init__(owner, account_number, balance)

        config = BankConfig()
        self.rate = config.interest_rate

    def add_interest(self):
        interest = self.balance * self.rate
        self.deposit(interest)

    def statement(self):
        print("\n----- SAVINGS ACCOUNT -----")
        print(f"Owner   : {self.owner}")
        print(f"Account : {self.account_number}")
        print(f"Balance : {self.balance:.2f} ETB")
        print(f"Interest Rate : {self.rate:.2%}")


# ---------------------- Current ----------------------

class CurrentAccount(Account):

    def __init__(self, owner, account_number, balance=0):
        super().__init__(owner, account_number, balance)

        config = BankConfig()
        self.overdraft = config.overdraft_limit

    def withdraw(self, amount):

        if amount <= 0:
            raise ValueError("Amount must be greater than zero")

        if amount > self.balance + self.overdraft:
            raise ValueError("Overdraft limit exceeded")

        self._balance -= amount
        self._push_history("withdraw", amount)

        self._notify(
            f"{self.owner} withdrew {amount} ETB. Balance = {self.balance} ETB"
        )

    def statement(self):
        print("\n----- CURRENT ACCOUNT -----")
        print(f"Owner   : {self.owner}")
        print(f"Account : {self.account_number}")
        print(f"Balance : {self.balance:.2f} ETB")
        print(f"Overdraft : {self.overdraft} ETB")


# ---------------------- Factory Pattern ----------------------

class AccountFactory:

    @staticmethod
    def create(kind, owner, number, balance=0):

        if kind.lower() == "savings":
            return SavingsAccount(owner, number, balance)

        elif kind.lower() == "current":
            return CurrentAccount(owner, number, balance)

        else:
            raise ValueError("Unknown account type")


# ---------------------- Binary Search ----------------------

def binary_search(sorted_items, target):
    """
    Classic iterative binary search.
    Returns the index of `target` in `sorted_items` (already sorted),
    or -1 if it isn't found.

    O(log n): every comparison throws away half of what's left to check.
    """
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


# ---------------------- Registry ----------------------

class AccountRegistry:
    """Keeps track of every account created, keyed by account number."""

    def __init__(self):
        self._accounts = {}  # account_number -> Account, O(1) lookup

    def add(self, account):
        if account.account_number in self._accounts:
            raise ValueError(
                f"Account {account.account_number} is already registered"
            )
        self._accounts[account.account_number] = account

    def find(self, account_number):
        """O(1) lookup by account number (dict access). Returns None if not found."""
        return self._accounts.get(account_number)

    def list_all(self):
        """Return every account, ordered by account number."""
        return sorted(self._accounts.values(), key=lambda acc: acc.account_number)

    def top_by_balance(self, n=5):
        """Leaderboard: the n accounts with the highest balances, richest first."""
        accts = sorted(
            self._accounts.values(),
            key=lambda a: a.balance,
            reverse=True,
        )
        return accts[:n]

    def find_by_number(self, number):
        """
        Look up an account by number using binary search over the sorted
        account numbers, instead of a dict lookup or a linear scan.
        This is here to practise binary search - find() above already
        gives O(1) lookup via the dict.
        """
        nums = sorted(self._accounts)  # sorted list of account numbers
        i = binary_search(nums, number)
        return self._accounts[nums[i]] if i >= 0 else None

    def total_transactions(self, number):
        """
        Recursively sum the total transaction volume (deposits + withdrawals,
        regardless of direction) for one account, found by number.
        Returns 0 if the account doesn't exist or has no history.
        """
        account = self.find_by_number(number)
        if account is None:
            return 0
        return self._sum_history(account.history)

    @staticmethod
    def _sum_history(history):
        """
        Recursive helper: sums the `amount` field across a list of
        transaction records. Base case is an empty list; the recursive
        case peels off the first record and adds it to the sum of the rest.
        """
        if not history:
            return 0
        first, *rest = history
        return first["amount"] + AccountRegistry._sum_history(rest)

    def __len__(self):
        return len(self._accounts)




class Branch:
    """
    A node in the bank's organizational tree.

    A Branch can hold accounts directly (e.g. a local branch counter)
    and/or child Branches (e.g. a region holding several local
    branches, or head office holding several regions). Because a
    Branch is defined in terms of Branches, the tree can nest as
    deep as the bank's real structure requires - total_balance()
    below recurses down through however many levels exist.
    """

    def __init__(self, name):
        self.name = name
        self.children = []   # sub-branches (list[Branch])
        self.accounts = []   # accounts held directly at this branch

    def add_child(self, branch):
        """Attach a sub-branch (e.g. add a Region under Head Office)."""
        self.children.append(branch)
        return branch

    def add_account(self, account):
        """Register an account as being held at this branch."""
        self.accounts.append(account)
        return account

    def total_balance(self):
        """
        Recursively sum every account balance in this branch AND all
        of its descendants.

        Base case: a branch with no children just sums its own
        accounts. Recursive case: add each child's total_balance()
        (which itself recurses down to its own children) on top of
        that. This is what lets a single call at Head Office roll up
        balances from every region and every local branch beneath it.
        """
        total = sum(a.balance for a in self.accounts)
        for child in self.children:
            total += child.total_balance()
        return total

    def account_count(self):
        """Recursively count every account in this branch and its descendants."""
        count = len(self.accounts)
        for child in self.children:
            count += child.account_count()
        return count

    def print_tree(self, indent=0):
        """Pretty-print the branch tree with indentation showing depth."""
        pad = "  " * indent
        print(f"{pad}- {self.name}  "
              f"({self.total_balance():.2f} ETB across {self.account_count()} accounts)")
        for account in self.accounts:
            print(f"{pad}    * {account.account_number} - {account.owner} "
                  f"- {account.balance:.2f} ETB")
        for child in self.children:
            child.print_tree(indent + 1)

    def __repr__(self):
        return f"Branch({self.name!r})"


# ---------------------- Transfers Graph ----------------------

def bfs(transfers, start):
    """
    Breadth-first search over the transfers graph.

    `transfers` is a directed graph as an adjacency list: a dict
    mapping an account number to the list of account numbers it has
    paid. Starting from `start`, this explores outward one "hop" at a
    time (all direct payees first, then payees-of-payees, and so on)
    and returns the full set of account numbers reachable from start
    - i.e. every account that start's money has reached, directly or
    through a chain of transfers. `start` itself is included.

    Accounts that only receive transfers but never send any (or that
    don't appear as a key in `transfers`) are simply treated as having
    no outgoing edges, via transfers.get(node, []).
    """
    visited = {start}
    queue = deque([start])

    while queue:
        node = queue.popleft()
        for neighbor in transfers.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return visited


# ---------------------- Testing ----------------------

if __name__ == "__main__":
    sms = SMSAlert()
    audit = AuditLog()
    registry = AccountRegistry()

    # Create accounts using Factory

    semu = AccountFactory.create("savings", "Semu", "ACC-001", 10000)
    abebe = AccountFactory.create("current", "Abebe", "ACC-002", 5000)
    marta = AccountFactory.create("savings", "Marta", "ACC-003", 25000)
    kebede = AccountFactory.create("current", "Kebede", "ACC-004", 1200)
    hana = AccountFactory.create("savings", "Hana", "ACC-005", 8000)
    dawit = AccountFactory.create("current", "Dawit", "ACC-006", 3000)

    for acc in (semu, abebe, marta, kebede, hana, dawit):
        registry.add(acc)
        acc.subscribe(sms)
        acc.subscribe(audit)

    print("\n========== Transactions ==========")

    semu.deposit(2000)
    semu.withdraw(1000)
    semu.add_interest()

    abebe.deposit(1500)
    abebe.withdraw(6000)

    marta.deposit(5000)
    marta.withdraw(3000)

    kebede.deposit(300)
    kebede.withdraw(900)

    hana.deposit(1200)
    dawit.deposit(500)

    print("\n========== Leaderboard (top_by_balance) ==========")
    for rank, acc in enumerate(registry.top_by_balance(3), start=1):
        print(f"  #{rank}: {acc.account_number} - {acc.owner} - {acc.balance:.2f} ETB")

    print("\n========== Binary Search (find_by_number) ==========")
    found = registry.find_by_number("ACC-003")
    print("find_by_number('ACC-003') ->", found.owner if found else None)

    missing = registry.find_by_number("ACC-999")
    print("find_by_number('ACC-999') ->", missing)

    print("\n========== Recursive Transaction Total ==========")
    for number in ("ACC-001", "ACC-002", "ACC-003", "ACC-004", "ACC-999"):
        total = registry.total_transactions(number)
        print(f"  total_transactions('{number}') = {total:.2f} ETB")

    # ---------------- Branch Tree (3 levels: Head Office -> Region -> Branch) ----------------

    print("\n========== Branch Tree ==========")

    head_office = Branch("Head Office")

    addis_region = head_office.add_child(Branch("Addis Ababa Region"))
    oromia_region = head_office.add_child(Branch("Oromia Region"))

    bole_branch = addis_region.add_child(Branch("Bole Branch"))
    piassa_branch = addis_region.add_child(Branch("Piassa Branch"))
    adama_branch = oromia_region.add_child(Branch("Adama Branch"))

    bole_branch.add_account(semu)
    bole_branch.add_account(abebe)
    piassa_branch.add_account(marta)
    adama_branch.add_account(kebede)
    adama_branch.add_account(hana)
    adama_branch.add_account(dawit)

    head_office.print_tree()

    print(f"\nTotal balance, whole bank (head_office.total_balance()): "
          f"{head_office.total_balance():.2f} ETB")
    print(f"Total balance, Addis Ababa Region only: "
          f"{addis_region.total_balance():.2f} ETB")
    print(f"Total balance, Bole Branch only: "
          f"{bole_branch.total_balance():.2f} ETB")

    

    print("\n========== Transfers Graph (BFS) ==========")

   
    transfers = {
        "ACC-001": ["ACC-002", "ACC-003"],   # Semu paid Abebe and Marta
        "ACC-002": ["ACC-004"],              # Abebe paid Kebede
        "ACC-003": ["ACC-005"],              # Marta paid Hana
        "ACC-004": [],                       # Kebede hasn't paid anyone
        "ACC-005": ["ACC-006"],              # Hana paid Dawit
        "ACC-006": ["ACC-001"],              # Dawit paid Semu (a cycle)
    }

    for start in ("ACC-001", "ACC-004", "ACC-999"):
        reachable = bfs(transfers, start)
        print(f"  bfs(transfers, '{start}') -> {sorted(reachable)}")