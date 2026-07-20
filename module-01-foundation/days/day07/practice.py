# Current implementation uses an Array (List)
printer_queue = []
def receive_document(doc):
  printer_queue.append(doc)
def print_next():
 # We must process the FIRST document that arrived
 if len(printer_queue) > 0:
 # pop(0) removes the item at the absolute front of the list
    document = printer_queue.pop()
    print(f"Printing: {document}")
receive_document("abel")
receive_document("makbel")
receive_document("maya")

print(printer_queue)
print(print_next())
print(printer_queue)