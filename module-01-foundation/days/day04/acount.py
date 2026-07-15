class Acount:
    
    def __init__(self,owner,acount_number, balance):
        self.owner=owner
        self.acount_number=acount_number
        self.__balance=balance
    
    @property
    def get_balnce(self):
        return self.__balance
    
    @get_balnce.setter
    def deposit(self, amount):
        if amount<0:
            raise ValueError("No below zero")
        self.__balance += int(amount)
      
    def withdraw(self, amount):
        if amount > self.__balance:
            raise ValueError("Insufficient balance")
        self.__balance -= amount
    def statement(self ):
        print(f"{self.owner}  {self.acount_number} balance {self.__balance} ETB")
        
Jack = Acount("Jack", "Addis-1", 1000000)
Hlina = Acount("Hlina", "Addis-2", 100)

print(f"intial {Jack.get_balnce}$") 

Jack.deposit=1000
print(f"after deposit{Jack.get_balnce}$")
Hlina.statement()





            