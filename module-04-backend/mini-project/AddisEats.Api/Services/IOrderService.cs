namespace AddisEats.Api.Services;

using AddisEats.Api.Common;
using AddisEats.Api.Models;

public interface IOrderService
{
    Result<Order> GetById(int id);
    IEnumerable<Order> GetAll();
    Result<Order> Place(CreateOrderRequest request);
    Result<Order> UpdateStatus(int id, OrderStatus status);
}
