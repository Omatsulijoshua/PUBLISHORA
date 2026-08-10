import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { BooksService, CreateBookDto, AddChapterDto, SpineCalculatorDto } from './books.service';

@Controller('api/v1/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async createBook(@Body() dto: CreateBookDto) {
    return this.booksService.createBook(dto);
  }

  @Get()
  async getBooks() {
    return this.booksService.getBooks();
  }

  @Post(':id/chapters')
  async addChapter(@Param('id') id: string, @Body() dto: AddChapterDto) {
    return this.booksService.addChapter({ ...dto, bookId: id });
  }

  @Post('spine-calculator')
  calculateSpineWidth(@Body() dto: SpineCalculatorDto) {
    return this.booksService.calculateSpineWidth(dto);
  }
}
