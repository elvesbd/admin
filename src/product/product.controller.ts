import { Body, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject('PRODUCT_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get()
  async allProducts() {
    this.client.emit('hello', 'hello from rabbitMQ');
    return this.productService.all();
  }

  @Post()
  async createProducts(
    @Body('title') title: string,
    @Body('image') image: string,
  ) {
    return this.productService.create({ title, image });
  }

  @Get(':id')
  async getProduct(@Param('id') id: number) {
    return this.productService.get(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body('title') title: string,
    @Body('image') image: string,
  ) {
    return this.productService.update(id, { title, image });
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    return this.productService.delete(id);
  }
}
