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
    return this.productService.all();
  }

  @Post()
  async createProducts(
    @Body('title') title: string,
    @Body('image') image: string,
  ) {
    const product = await this.productService.create({ title, image });

    this.client.emit('product_created', product);
    return product;
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
    await this.productService.update(id, { title, image });

    const product = await this.productService.get(id);

    this.client.emit('product-updated', product);
    return product;
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    await this.productService.delete(id);

    this.client.emit('product-deleted', id);
  }

  @Post(':id/like')
  async like(@Param('id') id: number) {
    const product = await this.productService.get(id);

    return this.productService.update(id, {
      likes: product.likes++,
    });
  }
}
