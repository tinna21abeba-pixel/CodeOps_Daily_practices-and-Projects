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

    @property
    def balance(self):
        return self._balance

    def subscribe(self, observer):
        self._observers.append(observer)

    def _notify(self, message):
        for observer in self._observers:
            observer.update(message)

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be greater than zero")

        self._balance += amount
        self._notify(
            f"{self.owner} deposited {amount} ETB. Balance = {self.balance} ETB"
        )

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be greater than zero")

        if amount > self.balance:
            raise ValueError("Insufficient balance")

        self._balance -= amount

        self._notify(
            f"{self.owner} withdrew {amount} ETB. Balance = {self.balance} ETB"
        )

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


# ---------------------- Testing ----------------------

sms = SMSAlert()
audit = AuditLog()

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