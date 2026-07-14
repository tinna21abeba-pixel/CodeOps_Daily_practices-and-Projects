
print("temperature labe1")
temperature=float(input("Enter the temperature in degree Celsius: "))
if temperature <15:
    print("cold .")
elif temperature >=15 and temperature <=28:
    print("warm")
else:
    print("hot")
    
    
    
print("Numbers from 1 to 10")  
    
for i in range(1,11):
     print(f"Receipt #{i}")
    
    
    
print("even Numbers from 0 to 20")
for i in range(1, 20):
        if i%2==0:
            print(i)


print("Discount function")
def apply_discount(price, percent=10):
     discount=price * (percent / 100)
     return price-discount
price=apply_discount(100, 20)
print("the price is ", price)
price=apply_discount(100)
print("the price is ", price)



print("Countdown from 5 to 1") 
x=5
while x>0:
    print(x)
    x -= 1
print("Liftoff!")

    