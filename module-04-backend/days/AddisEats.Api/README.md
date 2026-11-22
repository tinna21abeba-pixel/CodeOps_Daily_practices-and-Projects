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