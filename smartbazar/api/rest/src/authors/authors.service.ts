import { Injectable } from '@nestjs/common';
import { UpdateAuthorDto } from '@packages/commerce/dist/authors/dto/update-author.dto';
import { plainToInstance } from 'class-transformer';
import authorsJson from './authors.json';
import { Author } from '@packages/commerce/dist/authors/entities/author.entity';
import Fuse from 'fuse.js';
import { GetAuthorDto } from '@packages/commerce/dist/authors/dto/get-author.dto';
import { paginate } from '@packages/commerce/dist/common/pagination/paginate';
import { GetTopAuthorsDto } from '@packages/commerce/dist/authors/dto/get-top-authors.dto';
import { CreateAuthorDto } from '@packages/commerce/dist/authors/dto/create-author.dto';

const authors = plainToInstance(Author, authorsJson);

const options = {
  keys: ['name', 'slug'],
  threshold: 0.3,
};

const fuse = new Fuse(authors, options);

@Injectable()
export class AuthorsService {
  private authors: Author[] = authors;

  create(createAuthorDto: CreateAuthorDto) {
    return this.authors[0];
  }

  getAuthors({ page, limit, search }: GetAuthorDto) {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Author[] = this.authors;
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }

    const results = data.slice(startIndex, endIndex);

    const url = `/authors?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  getAuthorBySlug(slug: string): Author {
    return this.authors.find((p) => p.slug === slug);
  }

  async getTopAuthors({ limit = 10 }: GetTopAuthorsDto): Promise<Author[]> {
    return this.authors.slice(0, limit);
  }

  update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const author = this.authors.find((p) => p.id === id);

    // Update author
    author.is_approved = updateAuthorDto.is_approved ?? true;

    return author;
  }

  remove(id: string) {
    return `This action removes a #${id} product`;
  }
}
