city_names=["mekelle", "addis abeba", "Awasa", "Gonder", "Jima", "Awasa", "Bahrdar", "addis abeba"]
unique_cities=set(city_names)
print(unique_cities)

print("grocery items and their price\n")
groceries={
     "Milk": 200,
    "Bread":60,
    "Eggs" : 30,
    "Rice": 450,
    "Sugar" : 250,
    "Salt": 60,
}
for name, price in groceries.items():
     print(f"{name} : {price} ETB")
price_compression=[]
for price in  [100, 250, 400, 80]:
      price_compression.append(price + price*15/100)
print(price_compression)
print("===============================================")  
print("cheap items from the groccery") 
cheap_items_list=[price for price in price_compression if price <= 200]
print(cheap_items_list)


with open("module-01-foundation/days/day03/names.txt", "w") as f:
    f.write("hana\n")
    f.write("makbel\n")
    f.write("atnosia\n")
with open("module-01-foundation/days/day03/names.txt") as f:
  print(f.read())


number_input=float(input("enter a number: "))
def safe_division(num):

  try:
      if num !=0:
          print(num/1000)
  except:
      print("invalid input")
safe_division(number_input)
        
 