spending = {}

try:
    with open("module-01-foundation/days/day03/transaction.txt", "r") as file:
        for line in file:
            line = line.strip()

            name, amount = line.split(",")
            amount = int(amount)

            if name in spending:
                spending[name] += amount
            else:
                spending[name] = amount

except FileNotFoundError:
    print("transactions.txt not found.")

else:
    sorted_spending = sorted(
        spending.items(),
        key=lambda item: item[1],
        reverse=True
    )

    print("Customer Summary")
    for name, total in sorted_spending:
        print(f"{name}: {total}")

    with open("report.txt", "w") as report:
        report.write("Customer Summary\n")
        report.write("----------------\n")

        for name, total in sorted_spending:
            report.write(f"{name}: {total}\n")

    print("\nSummary written to report.txt")