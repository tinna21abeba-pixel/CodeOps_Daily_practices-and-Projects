
namespace AddisEats.Api.DTOs;

public record ResturantDTO
(
    int Id,
    string Name,
    string Area,
    string Phone,
    bool IsAcitve
)
{
    public bool IsActive => IsAcitve;
}

public record RestuarantDTO
(
    int Id,
    string Name,
    string Area,
    string Phone,
    bool IsAcitve
) : ResturantDTO(Id, Name, Area, Phone, IsAcitve);
