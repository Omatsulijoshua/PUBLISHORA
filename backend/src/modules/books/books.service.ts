import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateBookDto {
  title: string;
  subtitle?: string;
  bookType: 'MONOGRAPH' | 'EDITED_VOLUME' | 'TEXTBOOK';
  publisherName: string;
  isbnHardcover?: string;
  isbnPaperback?: string;
  editors: string[];
}

export interface AddChapterDto {
  bookId: string;
  chapterNumber: number;
  title: string;
  authors: string[];
  startPage: number;
  endPage: number;
}

export interface SpineCalculatorDto {
  pageCount: number;
  paperStock: '50lb_white' | '60lb_cream' | '70lb_matte';
  bindingType: 'HARDCOVER' | 'PAPERBACK';
}

@Injectable()
export class BooksService {
  private mockBooks: any[] = [
    {
      id: 'book-101',
      title: 'Topological Quantum Error Correction and Fault-Tolerant Architectures',
      subtitle: 'Principles, Hardware Interconnects, and Protocols',
      bookType: 'MONOGRAPH',
      publisherName: 'PUBLISHORA Academic Press',
      isbnHardcover: '978-3-16-148410-0',
      isbnPaperback: '978-3-16-148411-7',
      doi: '10.5555/publishora.book.2026.101',
      editors: ['Dr. Ada Lovelace', 'Dr. Charles Babbage'],
      chapters: [
        { chapterNumber: 1, title: 'Foundations of Anyonic Braiding', authors: ['Ada Lovelace'], doi: '10.5555/publishora.book.2026.101.ch1', startPage: 1, endPage: 45 },
        { chapterNumber: 2, title: 'Surface Code Lattice Surgery', authors: ['Charles Babbage', 'Elena Rostova'], doi: '10.5555/publishora.book.2026.101.ch2', startPage: 46, endPage: 92 },
      ],
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async createBook(dto: CreateBookDto) {
    const book = {
      id: `book-${Date.now()}`,
      title: dto.title,
      subtitle: dto.subtitle || '',
      bookType: dto.bookType,
      publisherName: dto.publisherName,
      isbnHardcover: dto.isbnHardcover || '978-3-16-148410-0',
      isbnPaperback: dto.isbnPaperback || '978-3-16-148411-7',
      doi: `10.5555/publishora.book.2026.${Date.now().toString().slice(-4)}`,
      editors: dto.editors,
      chapters: [],
    };

    this.mockBooks.push(book);
    return book;
  }

  async getBooks() {
    return this.mockBooks;
  }

  async addChapter(dto: AddChapterDto) {
    const book = this.mockBooks.find((b) => b.id === dto.bookId || dto.bookId === 'book-101');
    if (!book) {
      throw new NotFoundException(`Book ${dto.bookId} not found`);
    }

    const chapterDoi = `${book.doi}.ch${dto.chapterNumber}`;
    const chapter = {
      chapterNumber: dto.chapterNumber,
      title: dto.title,
      authors: dto.authors,
      doi: chapterDoi,
      startPage: dto.startPage,
      endPage: dto.endPage,
    };

    book.chapters.push(chapter);
    return chapter;
  }

  calculateSpineWidth(dto: SpineCalculatorDto) {
    // Pages per inch (PPI) constants
    const ppiMap = {
      '50lb_white': 500,
      '60lb_cream': 434,
      '70lb_matte': 380,
    };

    const ppi = ppiMap[dto.paperStock] || 434;
    let spineInches = dto.pageCount / ppi;

    if (dto.bindingType === 'HARDCOVER') {
      spineInches += 0.15; // Hardcover board thickness adjustment
    }

    const spineMm = spineInches * 25.4;

    return {
      pageCount: dto.pageCount,
      paperStock: dto.paperStock,
      bindingType: dto.bindingType,
      ppi,
      spineWidthInches: parseFloat(spineInches.toFixed(4)),
      spineWidthMillimeters: parseFloat(spineMm.toFixed(2)),
    };
  }
}
