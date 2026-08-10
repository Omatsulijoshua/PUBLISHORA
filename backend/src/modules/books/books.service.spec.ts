import { BooksService } from './books.service';

describe('Phase 20 — Monograph & Academic Book Publishing Specs', () => {
  let service: BooksService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new BooksService(mockPrisma);
  });

  it('should create a new academic monograph with hardcover and paperback ISBNs', async () => {
    const book = await service.createBook({
      title: 'Topological Photonic Crystals and Metamaterials',
      bookType: 'MONOGRAPH',
      publisherName: 'PUBLISHORA Academic Press',
      isbnHardcover: '978-3-16-148410-0',
      isbnPaperback: '978-3-16-148411-7',
      editors: ['Dr. Elena Rostova'],
    });

    expect(book.title).toBe('Topological Photonic Crystals and Metamaterials');
    expect(book.doi).toContain('10.5555/publishora.book.2026.');
  });

  it('should add chapter with distinct chapter-level DOI', async () => {
    const chapter = await service.addChapter({
      bookId: 'book-101',
      chapterNumber: 3,
      title: 'Non-Linear Optical Solitons in Photonic Lattice',
      authors: ['Kenji Sato', 'Liang Wei'],
      startPage: 93,
      endPage: 135,
    });

    expect(chapter.doi).toBe('10.5555/publishora.book.2026.101.ch3');
    expect(chapter.authors.length).toBe(2);
  });

  it('should calculate accurate book cover spine width in mm and inches', () => {
    const spine = service.calculateSpineWidth({
      pageCount: 320,
      paperStock: '60lb_cream',
      bindingType: 'HARDCOVER',
    });

    expect(spine.spineWidthInches).toBeGreaterThan(0.8);
    expect(spine.spineWidthMillimeters).toBeGreaterThan(20);
    expect(spine.ppi).toBe(434);
  });
});
