
class Book:
    def __init__ (self,title, author,page ):
        self.title=title
        self.author=author
        self.page=page
    
    def descripe(self):
        print(f"{self.title} published by {self.author} has {self.page} pages")
        
mokingBird=Book("To Kill a Mockingbird","Harper Lee", 281)
hobbit=Book("The Hobbit", "J.R.R. Tolkien", 328)
mokingBird.descripe()
hobbit.descripe()

class Product:
    def __init__(self, name,  quantity, price ):
        self.name=name
        self.price=price
        self.__quantity=quantity
    @property
    def get_restock(self):
         return self.__quantity 
    @get_restock.setter
    def sell(self, n):
        if n <0 :
            print(" negative value is not allowed")
        self.__quantity -= int(n)
        
    @get_restock.setter
    def restock(self,n):
         if n <0 :
            print(" negative value is not allowed")
         self.__quantity +=int(n)
    
    
       
parctamol=Product("paractamon", 5, 1000)
parctamol.restock=5

print(parctamol.restock)   
       
       
   
       
       
