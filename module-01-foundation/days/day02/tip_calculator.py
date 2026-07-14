total=input("Enter the total bill amount: ")
people=input("Enter the number of people: ")
tip_rate=input("Enter the tip rate (e.g., 0.1 for 10%): ")

total=float(total)
people=int(people)
tip_rate=float(tip_rate)


def split_bill(total,people, tip_rate=0.01):
    tip=total*tip_rate
    total_with_tip=total+tip
    amount_per_person=total_with_tip/people
    return amount_per_person
#loop over list of names
for i in range(people):
    name=input(f"Enter the name of person {i+1}: ")
    amount=split_bill(total,people,tip_rate)
    print(f"{name} should pay: {amount:.2f}")
    
     