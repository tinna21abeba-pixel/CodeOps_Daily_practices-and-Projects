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
        """O(1) lookup by account number. Returns None if not found."""
        return self._accounts.get(account_number)

    def list_all(self):
        """Return every account, ordered by account number."""
        return sorted(self._accounts.values(), key=lambda acc: acc.account_number)

    def __len__(self):
        return len(self._accounts)


# ---------------------- Testing ----------------------

sms = SMSAlert()
audit = AuditLog()
registry = AccountRegistry()

# Create accounts using Factory

semu = AccountFactory.create(
    "savings",
    "Semu",
    "ACC-001",
    10000
)

abebe = AccountFactory.create(
    "current",
    "Abebe",
    "ACC-002",
    5000
)

# Register accounts

registry.add(semu)
registry.add(abebe)

# Subscribe observers

semu.subscribe(sms)
semu.subscribe(audit)

abebe.subscribe(sms)
abebe.subscribe(audit)

# Savings account operations

print("\n========== Savings Account ==========")

semu.deposit(2000)
semu.withdraw(1000)
semu.add_interest()
semu.statement()

# Current account operations

print("\n========== Current Account ==========")

abebe.deposit(1500)
abebe.withdraw(6000)
abebe.statement()

# Singleton demonstration

config1 = BankConfig()
config2 = BankConfig()

print("\nSingleton Test:", config1 is config2)

print("Interest Rate :", config1.interest_rate)
print("Overdraft Limit :", config1.overdraft_limit)

# Registry demonstration

print("\n========== Registry ==========")

found = registry.find("ACC-002")
print("Found via find('ACC-002'):", found.owner if found else None)

print("Missing lookup find('ACC-999'):", registry.find("ACC-999"))

print("\nAll accounts (ordered by account number):")
for acc in registry.list_all():
    print(f"  {acc.account_number} - {acc.owner} - {acc.balance:.2f} ETB")

# Undo demonstration

print("\n========== Undo ==========")

print(f"Semu's balance before undo: {semu.balance:.2f} ETB")
semu.undo_last()  # reverses add_interest's deposit
print(f"Semu's balance after undo : {semu.balance:.2f} ETB")

print(f"\nAbebe's balance before undo: {abebe.balance:.2f} ETB")
abebe.undo_last()  # reverses the withdrawal of 6000
print(f"Abebe's balance after undo : {abebe.balance:.2f} ETB")

# Undo with an empty history
brand_new = AccountFactory.create("savings", "Marta", "ACC-003", 500)
registry.add(brand_new)
brand_new.undo_last()  # nothing to undo yet