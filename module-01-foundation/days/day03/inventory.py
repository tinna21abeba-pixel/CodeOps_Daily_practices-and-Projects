stock = {}


try:
    with open("module-01-foundation/days/day03/stock.txt", "r") as f:
        for line in f:
            item, qty = line.strip().split(",")
            stock[item] = int(qty)
except FileNotFoundError:
    print("No stock file yet – starting empty")

# 2. Function to increase or decrease stock
def adjust(item, amount):
    stock[item] = stock.get(item, 0) + amount

# Example updates
adjust("Paracetamol", 5)    # Add 5
adjust("Ibuprofen", -2)     # Remove 2

# 3. Print low-stock items
print("Low stock:")
for item, qty in stock.items():
    if qty < 10:
        print(f"{item}: {qty}")

# 4. Save updated stock back to stock.txt
with open("module-01-foundation/days/day03/report.txt", "w") as f:
    for item, qty in stock.items():
        f.write(f"{item},{qty}\n")