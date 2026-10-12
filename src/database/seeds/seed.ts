import * as argon2 from 'argon2';
import dataSource from '../data-source';
import { Amenity } from '../../amenities/entities/amenity.entity';
import { Users } from '../../users/entities/users.entity';
import { Property } from '../../properties/entities/property.entity';
import { PropertyImage } from '../../properties/entities/property-image.entity';
import { Role } from '../../common/enums/role.enum';
import { AMENITIES, CITIES, PROPERTIES, USERS } from './data';

async function seed() {
  await dataSource.initialize();

  // Amenities: upsert on the unique slug, so reruns don't duplicate.
  const amenityRepo = dataSource.getRepository(Amenity);
  await amenityRepo.upsert(AMENITIES, ['slug']);
  const bySlug = new Map((await amenityRepo.find()).map((a) => [a.slug, a]));

  // Users: create only if the email doesn't exist yet.
  const userRepo = dataSource.getRepository(Users);
  let owner!: Users;
  for (const u of USERS) {
    let user = await userRepo.findOneBy({ email: u.email });
    if (!user) {
      user = await userRepo.save(
        userRepo.create({
          email: u.email,
          passwordHash: await argon2.hash(u.password),
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role,
        }),
      );
    }
    if (u.role === Role.OWNER) owner = user;
  }

  // Properties: skip any title this owner already has (soft-deleted ones included).
  let created = 0;
  for (const [i, p] of PROPERTIES.entries()) {
    const exists = await dataSource.getRepository(Property).findOne({
      where: { title: p.title, ownerId: owner.id },
      withDeleted: true,
    });
    if (exists) continue;

    await dataSource.transaction(async (manager) => {
      const city = CITIES[p.city];
      const property = await manager.save(
        manager.create(Property, {
          title: p.title,
          description: `A comfortable ${p.type.toLowerCase()} in ${p.city} with room for up to ${p.maxGuests} guests. Fully furnished, close to shops, transport, and local sights.`,
          type: p.type,
          pricePeriod: p.period,
          price: p.price,
          currency: 'USD',
          city: p.city,
          address: `${10 + i} Example Street`,
          latitude: city.lat + i * 0.004,
          longitude: city.lng + i * 0.004,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          maxGuests: p.maxGuests,
          isPublished: p.status !== 'draft',
          ownerId: owner.id,
          amenities: p.amenities.map((slug) => {
            const amenity = bySlug.get(slug);
            if (!amenity) throw new Error(`Unknown amenity slug: ${slug}`);
            return amenity;
          }),
        }),
      );

      // 2 to 5 placeholder images per property; the first one is the cover.
      const imageSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const count = 2 + (i % 4);
      await manager.save(
        Array.from({ length: count }, (_, n) =>
          manager.create(PropertyImage, {
            propertyId: property.id,
            url: `https://picsum.photos/seed/${imageSlug}-${n}/800/600`,
            storageKey: `seed-${imageSlug}-${n}.jpg`,
            sortOrder: n,
            isCover: n === 0,
          }),
        ),
      );

      if (p.status === 'deleted') await manager.softRemove(property);
    });
    created++;
  }

  console.log(`Seed complete. New properties created: ${created}`);
}

seed()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (dataSource.isInitialized) await dataSource.destroy();
  });