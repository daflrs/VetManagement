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
    public class OwnersController : ControllerBase
    {
        private readonly VetManagementDbContext _context;

        public OwnersController(VetManagementDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OwnerDto>>> GetOwners()
        {
            var owners = await _context.Owners
                .Select(o => new OwnerDto
                {
                    OwnerId = o.OwnerId,
                    FirstName = o.FirstName,
                    LastName = o.LastName,
                    PhoneNumber = o.PhoneNumber,
                    Email = o.Email,
                    Address = o.Address,
                    PetCount = o.Pets.Count()
                })
                .ToListAsync();

            return Ok(owners);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OwnerDto>> GetOwner(int id)
        {
            var owner = await _context.Owners
                .Where(o => o.OwnerId == id)
                .Select(o => new OwnerDto
                {
                    OwnerId = o.OwnerId,
                    FirstName = o.FirstName,
                    LastName = o.LastName,
                    PhoneNumber = o.PhoneNumber,
                    Email = o.Email,
                    Address = o.Address,
                    PetCount = o.Pets.Count()
                })
                .FirstOrDefaultAsync();

            if (owner == null)
            {
                return ApiResponses.NotFound($"Owner with {id} not found.");
            }

            return Ok(owner);
        }

        [HttpGet("details/{id}")]
        public async Task<ActionResult<OwnerDetailsDto>> GetOwnerDetails(int id)
        {
            var owner = await _context.Owners
                .Where(o => o.OwnerId == id)
                .Select(o => new OwnerDetailsDto
                {
                    OwnerId = o.OwnerId,
                    FirstName = o.FirstName,
                    LastName = o.LastName,
                    PhoneNumber = o.PhoneNumber,
                    Email = o.Email,
                    Address = o.Address,
                    Pets = o.Pets.Select(p => new PetDto
                    {
                        PetId = p.PetId,
                        Name = p.Name,
                        Species = p.Species,
                        Breed = p.Breed,
                        BirthDate = p.BirthDate,
                        Weight = p.Weight
                    })
                    .ToList()
                })
                .FirstOrDefaultAsync();

            if (owner == null)
            {
                return ApiResponses.NotFound($"Owner with {id} not found.");
            }

            return Ok(owner);
        }

        [HttpGet("available-for-owner")]
        public async Task<ActionResult<IEnumerable<PetDto>>> GetPetsAvailableForOwner()
        {
            var pets = await _context.Pets
                .Where(p =>
                    p.OwnerId == null)
                .Select(p => new PetDto
                {
                    PetId = p.PetId,
                    Name = p.Name,
                    Species = p.Species,
                    Breed = p.Breed,
                    BirthDate = p.BirthDate,
                    Weight = p.Weight
                })
                .ToListAsync();

            return Ok(pets);
        }

        [HttpPost]
        public async Task<ActionResult<Owner>> CreateOwner(CreateOwnerDto dto)
        {
            var owner = new Owner
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                Address = dto.Address
            };

            _context.Owners.Add(owner);

            await _context.SaveChangesAsync();

            var result = new OwnerDto
            {
                OwnerId = owner.OwnerId,
                FirstName = owner.FirstName,
                LastName = owner.LastName,
                PhoneNumber = owner.PhoneNumber,
                Email = owner.Email,
                Address = owner.Address,
                PetCount = 0
            };

            return CreatedAtAction(
                nameof(GetOwner),
                new { id = owner.OwnerId },
                result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Owner>> UpdateOwner(int id, UpdateOwnerDto dto)
        {
            var owner = await _context.Owners.FindAsync(id);

            if (owner == null)
            {
                return NotFound();
            }

            owner.FirstName = dto.FirstName;
            owner.LastName = dto.LastName;
            owner.PhoneNumber = dto.PhoneNumber;
            owner.Email = dto.Email;
            owner.Address = dto.Address;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/add-pets")]
        public async Task<ActionResult<Owner>> AddPetsToOwner(int id, AddPetsToOwnerDto dto)
        {
            if (dto.PetIds == null || !dto.PetIds.Any())
            {
                return ApiResponses.BadRequest($"There are no pets selected.");
            }

            var ownerExists = await _context.Owners.AnyAsync(o => o.OwnerId == id);

            if (!ownerExists)
            {
                return ApiResponses.NotFound($"Owner with id of {id} not found.");
            }

            foreach (var petId in dto.PetIds)
            {
                var pet = await _context.Pets.FindAsync(petId);

                if (pet == null)
                {
                    return ApiResponses.NotFound($"Pet with id of {petId} not found.");
                }

                if (pet.OwnerId != null)
                {
                    return ApiResponses.BadRequest($"Pet with id of {petId} already has an owner.");
                }

                pet.OwnerId = id;
            }

            await _context.SaveChangesAsync();

            var owner = await _context.Owners
                .Where(o => o.OwnerId == id)
                .Select(o => new OwnerDetailsDto
                {
                    OwnerId = o.OwnerId,
                    FirstName = o.FirstName,
                    LastName = o.LastName,
                    PhoneNumber = o.PhoneNumber,
                    Email = o.Email,
                    Address = o.Address,
                    Pets = o.Pets.Select(p => new PetDto
                    {
                        PetId = p.PetId,
                        Name = p.Name,
                        Species = p.Species,
                        Breed = p.Breed,
                        BirthDate = p.BirthDate,
                        Weight = p.Weight
                    })
                    .ToList()
                })
                .FirstOrDefaultAsync();

            return Ok(owner);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOwner(int id)
        {
            var hasPets = await _context.Pets.AnyAsync(p => p.OwnerId == id);

            if (hasPets)
            {
                return ApiResponses.Conflict("Cannot delete owner with pets.");
            }

            var owner = await _context.Owners.FindAsync(id);

            if (owner == null)
            {
                return ApiResponses.NotFound($"Owner with {id} not found.");
            }

            _context.Owners.Remove(owner);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
