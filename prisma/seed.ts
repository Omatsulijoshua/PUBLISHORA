import { PrismaClient, AvailabilityStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Countries and Publishing Availability Policies...');

  const countriesData = [
    { name: 'Nigeria', isoCode: 'NG', region: 'Africa', currency: 'NGN', flagEmoji: '🇳🇬', defaultStatus: AvailabilityStatus.FULLY_AVAILABLE },
    { name: 'United States', isoCode: 'US', region: 'North America', currency: 'USD', flagEmoji: '🇺🇸', defaultStatus: AvailabilityStatus.FULLY_AVAILABLE },
    { name: 'United Kingdom', isoCode: 'GB', region: 'Europe', currency: 'GBP', flagEmoji: '🇬🇧', defaultStatus: AvailabilityStatus.FULLY_AVAILABLE },
    { name: 'Canada', isoCode: 'CA', region: 'North America', currency: 'CAD', flagEmoji: '🇨🇦', defaultStatus: AvailabilityStatus.FULLY_AVAILABLE },
    { name: 'Kenya', isoCode: 'KE', region: 'Africa', currency: 'KES', flagEmoji: '🇰🇪', defaultStatus: AvailabilityStatus.LIMITED },
    { name: 'Ghana', isoCode: 'GH', region: 'Africa', currency: 'GHS', flagEmoji: '🇬🇭', defaultStatus: AvailabilityStatus.LIMITED },
    { name: 'Germany', isoCode: 'DE', region: 'Europe', currency: 'EUR', flagEmoji: '🇩🇪', defaultStatus: AvailabilityStatus.FULLY_AVAILABLE },
    { name: 'India', isoCode: 'IN', region: 'Asia', currency: 'INR', flagEmoji: '🇮🇳', defaultStatus: AvailabilityStatus.LIMITED },
    { name: 'Australia', isoCode: 'AU', region: 'Oceania', currency: 'AUD', flagEmoji: '🇦🇺', defaultStatus: AvailabilityStatus.FULLY_AVAILABLE },
    { name: 'Restricted State Alpha', isoCode: 'RA', region: 'Global', currency: 'USD', flagEmoji: '🏳️', defaultStatus: AvailabilityStatus.PREPARATION_ONLY },
    { name: 'Restricted State Beta', isoCode: 'RB', region: 'Global', currency: 'USD', flagEmoji: '🏴', defaultStatus: AvailabilityStatus.UNAVAILABLE },
  ];

  for (const cData of countriesData) {
    const country = await prisma.country.upsert({
      where: { isoCode: cData.isoCode },
      update: {
        name: cData.name,
        region: cData.region,
        currency: cData.currency,
        flagEmoji: cData.flagEmoji,
        defaultStatus: cData.defaultStatus,
      },
      create: cData,
    });

    // Create policy entries
    await prisma.countryPublishingPolicy.create({
      data: {
        countryId: country.id,
        status: cData.defaultStatus,
        publishingAllowed: cData.defaultStatus === AvailabilityStatus.FULLY_AVAILABLE || cData.defaultStatus === AvailabilityStatus.LIMITED,
        preparationAllowed: true,
        printAllowed: cData.defaultStatus === AvailabilityStatus.FULLY_AVAILABLE,
        digitalAllowed: cData.defaultStatus !== AvailabilityStatus.UNAVAILABLE,
        peerReviewAllowed: cData.defaultStatus === AvailabilityStatus.FULLY_AVAILABLE,
        notes: cData.defaultStatus === AvailabilityStatus.PREPARATION_ONLY
          ? 'Press publishing is currently unavailable for this region due to local distribution licensing. You can prepare and export manuscripts for external publishing.'
          : cData.defaultStatus === AvailabilityStatus.UNAVAILABLE
          ? 'Publishing through our press is legally or operationally unavailable in this region.'
          : 'Full publishing press services are operational.',
      },
    });

    // Create service entries
    await prisma.countryService.create({
      data: {
        countryId: country.id,
        serviceName: 'DIGITAL_PUBLISHING',
        status: cData.defaultStatus === AvailabilityStatus.UNAVAILABLE ? AvailabilityStatus.UNAVAILABLE : AvailabilityStatus.FULLY_AVAILABLE,
      },
    });

    await prisma.countryService.create({
      data: {
        countryId: country.id,
        serviceName: 'PRINT_ON_DEMAND',
        status: cData.defaultStatus === AvailabilityStatus.FULLY_AVAILABLE ? AvailabilityStatus.FULLY_AVAILABLE : AvailabilityStatus.PREPARATION_ONLY,
      },
    });
  }

  // Seed Publication Types
  const pubTypesData = [
    { name: 'Book', code: 'BOOK', category: 'Books', description: 'Fiction, Non-fiction, Textbooks, Biographies, Technical Books' },
    { name: 'E-book', code: 'EBOOK', category: 'Books', description: 'Digital publications formatted for EPUB and online readers' },
    { name: 'Journal Article', code: 'JOURNAL_ARTICLE', category: 'Academic', description: 'Peer-reviewed research articles for scholarly journals' },
    { name: 'Research Paper', code: 'RESEARCH_PAPER', category: 'Academic', description: 'Original scientific, technical, or humanities research papers' },
    { name: 'Conference Paper', code: 'CONFERENCE_PAPER', category: 'Academic', description: 'Academic papers submitted for conference proceedings' },
    { name: 'Thesis / Dissertation', code: 'THESIS', category: 'Academic', description: 'University doctoral dissertations and master theses' },
    { name: 'Magazine', code: 'MAGAZINE', category: 'Periodicals', description: 'Regular periodical issues with articles and features' },
    { name: 'Newsletter', code: 'NEWSLETTER', category: 'Periodicals', description: 'Organizational or independent subscriber updates' },
    { name: 'Report', code: 'REPORT', category: 'Professional', description: 'Corporate, institutional, or government technical reports' },
    { name: 'White Paper', code: 'WHITE_PAPER', category: 'Professional', description: 'Authoritative guide or report addressing specific issues' },
  ];

  for (const pt of pubTypesData) {
    await prisma.publicationType.upsert({
      where: { code: pt.code },
      update: pt,
      create: pt,
    });
  }

  console.log('✅ Countries and Publication Types successfully seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
