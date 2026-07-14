

Customers=[
    ("Almaz", 1500), ("dawit", 700), ("Tigist", 200), ("hana", 1200), ("samuel", 450)
]
x=5
y="5"
z=x==y
print(z)
 

def tier(balance):
    if balance>=1000:
        return "Premium"
    elif balance>=500:
        return "standard"
    else:
        return "Basic"
    
    

for name, balance in Customers:
    print(f"{name}  :  {tier(balance)} {balance} ETB")
    
    
    
premium=0
standard=0
basic=0
for name, balance in Customers:
    if balance>=1000:
        premium+=1
    elif balance>=500:
        standard+=1
    else:
        basic+=1
        
        
print("Customer report")


print(f"Premium customers: {premium}")
print(f"Standard customers: {standard}")
print(f"Basic customers: {basic}")