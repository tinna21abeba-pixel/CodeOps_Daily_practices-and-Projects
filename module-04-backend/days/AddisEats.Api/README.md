http://localhost:5095/swagger/index.html


## Exercise 7 - Missing Dependency Registration

### Exception

System.InvalidOperationException:

Unable to resolve service for type
'AddisEats.Api.Services.IPaymentProvider'
while attempting to activate
'AddisEats.Api.Controllers.PaymentController'.

### Explanation

The exception told me that the Dependency Injection container
could not create PaymentController because IPaymentProvider
had no registered implementation.

## Day 57 Exercise 6 - Empty Cases Explanation

404 Not Found indicates that the restaurant entity itself does not exist in the system, whereas 200 OK with an empty array indicates that the restaurant exists successfully but currently has zero menu items.

## Day 57 Exercise 6 - Empty Cases Explanation

404 Not Found indicates that the restaurant entity itself does not exist in the system, whereas 200 OK with an empty array indicates that the restaurant exists successfully but currently has zero menu items.
