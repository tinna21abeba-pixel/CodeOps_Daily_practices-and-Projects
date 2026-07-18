from abc import  ABC, abstractmethod

class Vehicle(ABC):
    def __init__(self, make, model):
        self.make=make
        self.model=model
    def describe(self):
        print(f" make: {self.make} model:{self.model}")
        
    @abstractmethod
    def wheel(self):
        pass
class Truck(Vehicle):
    def __init__(self, make, model, capacity):
        super().__init__(make, model)
        self.capacity=capacity
        
    def descripe(self):
         print(f" make: {self.make} model:{self.model}  capacity {self.capacity}")
    
    def wheel(self):
        return 4
class Car(Vehicle):
    def descripe(self):
         print(f" make: {self.make} model:{self.model} ")
    
    def wheel(self):
        return 6


car1 = Car("Toyota", "Corolla")
car2 = Car("Honda", "Civic")

truck1 = Truck("Volvo", "FH16", "45 Tons")
truck2 = Truck("Mercedes", "Actros", "30 Tons")

vehicles=[
    car1,
    car2,
    truck1,
    truck2
   
]
for vehicle in vehicles:
    vehicle.describe()
    print(f"wheel:{vehicle.wheel()}")
    print("-"*40)