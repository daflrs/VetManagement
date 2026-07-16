using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VetManagement.Common;
using VetManagement.Data;
using VetManagement.DTOs;
using VetManagement.Models;

namespace VetManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PetsController : ControllerBase
    {
        private readonly VetManagementDbContext _context;

        public PetsController(VetManagementDbContext context)
        {
            _context = context;
        }

        private static PetDetailsDto ToDetailsDto(Pet pet)
        {
            return new PetDetailsDto
            {
                PetId = pet.PetId,
                Name = pet.Name,
                Species = pet.Species,
                Breed = pet.Breed,
                BirthDate = pet.BirthDate,
                Weight = pet.Weight,
                Owner = pet.Owner != null
                        ? new OwnerDto
                        {
                            OwnerId = pet.Owner.OwnerId,
                            FirstName = pet.Owner.FirstName,
                            LastName = pet.Owner.LastName,
                            PhoneNumber = pet.Owner.PhoneNumber,
                            Email = pet.Owner.Email,
                            Address = pet.Owner.Address
                        }
                        : null
            };
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PetDto>>> GetPets()
        {
            var pets = await _context.Pets
                .Include(p => p.Owner)
                .Select(p => new PetDto
                {
                    PetId = p.PetId,
                    Name = p.Name,
                    Species = p.Species,
                    Breed = p.Breed,
                    BirthDate = p.BirthDate,
                    Weight = p.Weight,
                    OwnerId = p.OwnerId,
                    OwnerName = p.Owner != null
                        ? $"{p.Owner.FirstName} {p.Owner.LastName}"
                        : null
                })
                .ToListAsync();

            return Ok(pets);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PetDto>> GetPet(int id)
        {
            var pet = await _context.Pets
                .Include(p => p.Owner)
                .Where(p => p.PetId == id)
                .Select(p => new PetDto
                {
                    PetId = p.PetId,
                    Name = p.Name,
                    Species = p.Species,
                    Breed = p.Breed,
                    BirthDate = p.BirthDate,
                    Weight = p.Weight,
                    OwnerId = p.OwnerId,
                    OwnerName = p.Owner != null
                        ? p.Owner.FirstName + " " + p.Owner.LastName
                        : null
                })
                .FirstOrDefaultAsync();

            if (pet == null)
            {
                return ApiResponses.NotFound($"Pet with {id} not found.");
            }

            return Ok(pet);
        }

        [HttpGet("details/{id}")]
        public async Task<ActionResult<PetDetailsDto>> GetPetDetails(int id)
        {
            var pet = await _context.Pets
                .Include(a =>  a.Owner)
                .Where(a => a.PetId == id)
                .FirstOrDefaultAsync();

            if (pet == null)
            {
                return ApiResponses.NotFound($"Pet with {id} not found.");
            }

            return Ok(ToDetailsDto(pet));
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<PetDto>>> SearchPets([FromQuery] string name)
        {
            var pets = await _context.Pets
                .Include(p => p.Owner)
                .Where(p => p.Name.Contains(name))
                .Select(p => new PetDto
                {
                    PetId = p.PetId,
                    Name = p.Name,
                    Species = p.Species,
                    Breed = p.Breed,
                    BirthDate = p.BirthDate,
                    Weight = p.Weight,
                    OwnerId = p.OwnerId,
                    OwnerName = p.Owner != null
                        ? p.Owner.FirstName + " " + p.Owner.LastName
                        : null
                })
                .ToListAsync();

            return Ok(pets);
        }

        [HttpPost]
        public async Task<ActionResult<PetDto>> CreatePet(CreatePetDto dto)
        {
            var pet = new Pet
            {
                Name = dto.Name,
                Species = dto.Species,
                Breed = dto.Breed,
                BirthDate = dto.BirthDate,
                Weight = dto.Weight,
                OwnerId = dto.OwnerId
            };

            _context.Pets.Add(pet);

            await _context.SaveChangesAsync();

            var result = new PetDto
            {
                PetId = pet.PetId,
                Name = pet.Name,
                Species = pet.Species,
                Breed = pet.Breed,
                BirthDate = pet.BirthDate,
                Weight = pet.Weight,
                OwnerId = pet.OwnerId,
                OwnerName = pet.Owner != null
                    ? pet.Owner.FirstName + " " + pet.Owner.LastName
                    : null
            };

            return CreatedAtAction(
                nameof(GetPet),
                new { id = pet.PetId },
                result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<PetDetailsDto>> UpdatePet(int id, UpdatePetDto dto)
        {
            var pet = await _context.Pets.FindAsync(id);

            if (pet == null)
            {
                return ApiResponses.NotFound($"Pet with {id} not found.");
            }

            pet.Name = dto.Name;
            pet.Species = dto.Species;
            pet.Breed = dto.Breed;
            pet.BirthDate = dto.BirthDate;
            pet.Weight = dto.Weight;

            await _context.SaveChangesAsync();

            await _context.Entry(pet)
                .Reference(p => p.Owner)
                .LoadAsync();

            return Ok(ToDetailsDto(pet));
        }

        [HttpPut("{id}/owner")]
        public async Task<ActionResult<PetDetailsDto>> UpdateOwner(int id, AssignOwnerToPetDto dto)
        {
            var pet = await _context.Pets.FindAsync(id);

            if (pet == null)
            {
                return ApiResponses.NotFound($"Pet with {id} not found.");
            }

            var ownerExists = await _context.Owners.AnyAsync(o => o.OwnerId == dto.OwnerId);

            if (!ownerExists)
            {
                return ApiResponses.NotFound($"Owner with {id} not found.");
            }

            if (pet.OwnerId == dto.OwnerId)
            {
                return ApiResponses.BadRequest("This owner is already assigned to this pet.");
            }

            pet.OwnerId = dto.OwnerId;

            await _context.SaveChangesAsync();

            await _context.Entry(pet)
                .Reference(p => p.Owner)
                .LoadAsync();

            return Ok(ToDetailsDto(pet));
        }

        [HttpDelete("{id}/owner")]
        public async Task<ActionResult<PetDetailsDto>> RemoveOwner(int id)
        {
            var pet = await _context.Pets.FindAsync(id);

            if (pet == null)
            {
                return ApiResponses.NotFound($"Pet with {id} not found.");
            }

            if (pet.OwnerId == null)
            {
                return ApiResponses.BadRequest("This pet does not have an owner to remove.");
            }

            pet.OwnerId = null;

            await _context.SaveChangesAsync();

            await _context.Entry(pet)
                .Reference(p => p.Owner)
                .LoadAsync();

            return Ok(ToDetailsDto(pet));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePet(int id)
        {
            var pet = await _context.Pets.FindAsync(id);

            if (pet == null)
            {
                return ApiResponses.NotFound($"Pet with {id} not found.");
            }

            _context.Pets.Remove(pet);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
