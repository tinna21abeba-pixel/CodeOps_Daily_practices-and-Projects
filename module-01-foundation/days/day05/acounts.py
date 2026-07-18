class Account:
    def __init__(self, owner, account_number, balance):
        self.owner = owner
        self.account_number = account_number
        self._balance = balance          # protected, not name-mangled

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount < 0:
            raise ValueError("No below zero")
        self._balance += amount          # no truncation

    def withdraw(self, amount):
        if amount < 0:
            raise ValueError("No below zero")
        if amount > self._balance:
            raise ValueError("Insufficient balance")
        self._balance -= amount

    def statement(self):
        print(f"[Account] {self.owner} {self.account_number} balance {self._balance} ETB")


class SavingsAccount(Account):
    def __init__(self, owner, account_number, balance, rate=0.05):
        super().__init__(owner, account_number, balance)
        self.rate = rate

    def add_interest(self):
        interest = self.balance * self.rate
        self.deposit(interest)

    def statement(self):
        print(f"[Savings] {self.owner} {self.account_number} balance {self._balance} ETB (rate {self.rate:.2%})")


class CurrentAccount(Account):
    def __init__(self, owner, account_number, balance=0, overdraft=1000):
        super().__init__(owner, account_number, balance)
        self.overdraft = overdraft

    def withdraw(self, amount):
        if amount > self._balance + self.overdraft:
            raise ValueError("overlimit")
        self._balance -= amount

    def statement(self):
        print(f"[Current] {self.owner} {self.account_number} balance {self._balance} ETB (overdraft {self.overdraft})")
        
  
semu=SavingsAccount("semu", "addis-2", 100000) 
semu.deposit(1000)
semu.add_interest()
semu.statement()

accounts=[
    SavingsAccount("Almaz", "CBE-1", 1500),
    CurrentAccount("Dawit", "CBE-2", 800)
]
for account in accounts:
    account.deposit(1000)
    account.statement()
    
     


