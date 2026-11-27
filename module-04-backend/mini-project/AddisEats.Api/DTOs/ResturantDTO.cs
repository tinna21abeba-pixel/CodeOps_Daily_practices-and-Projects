namespace AddisEats.Api.DTOs;

/// <summary>
/// Legacy restaurant summary DTO retained for compatibility.
/// </summary>
public record ResturantDTO
{
    /// <summary>
    /// Unique identifier of the restaurant.
    /// </summary>
    /// <example>1</example>
    public int Id { get; init; }

    /// <summary>
    /// Restaurant display name.
    /// </summary>
    /// <example>Yod Abyssinia</example>
    public string Name { get; init; }

    /// <summary>
    /// Addis Ababa neighborhood or street address.
    /// </summary>
    /// <example>Bole</example>
    public string Address { get; init; }

    /// <summary>
    /// Contact mobile phone number in Ethiopian format.
    /// </summary>
    /// <example>0911234567</example>
    public string Phone { get; init; }

    /// <summary>
    /// Whether the restaurant is currently active.
    /// </summary>
    /// <example>true</example>
    public bool IsAcitve { get; init; }

    /// <summary>
    /// Normalized alias indicating whether the restaurant is active.
    /// </summary>
    /// <example>true</example>
    public bool IsActive => IsAcitve;

    public ResturantDTO(int id, string name, string address, string phone, bool isAcitve)
    {
        Id = id;
        Name = name;
        Address = address;
        Phone = phone;
        IsAcitve = isAcitve;
    }
}

/// <summary>
/// Alias legacy restaurant DTO retained for compatibility.
/// </summary>
public record RestuarantDTO : ResturantDTO
{
    public RestuarantDTO(int id, string name, string address, string phone, bool isAcitve)
        : base(id, name, address, phone, isAcitve)
    {
    }
}
