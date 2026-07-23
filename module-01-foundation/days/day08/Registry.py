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

    for acc in (semu, abebe, marta, kebede):
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