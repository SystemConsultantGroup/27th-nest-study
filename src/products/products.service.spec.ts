import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { BadRequestException, HttpException, MethodNotAllowedException } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('처음에는 아무 제품도 등록이 안되어 있다.', () => {
    expect(service.findAll()).toEqual([]);
  });

  describe('create', () => {
    it('CreateProductDto의 정보를 가진 제품을 생성한다.', () => {
      const createProductDto = new CreateProductDto();
      createProductDto.name = 'name';
      createProductDto.price = 100;
      createProductDto.description = 'description';
      service.create(createProductDto);

      const product = service.findAll()[0];

      expect(product.name).toBe(createProductDto.name);
      expect(product.price).toBe(createProductDto.price);
      expect(product.description).toBe(createProductDto.description);
    });

    it('첫 번째로 생성된 제품은 id가 1이다.', () => {
      const createProductDto = new CreateProductDto();
      createProductDto.name = 'name';
      createProductDto.price = 100;
      createProductDto.description = 'description';
      service.create(createProductDto);

      const products = service.findAll();

      expect(products).toHaveLength(1);
      expect(products[0].id).toBe(1);
    });

    it('생성할 때마다 id가 1씩 증가한다.', () => {
      const createProductDto1 = new CreateProductDto();
      createProductDto1.name = 'name1';
      createProductDto1.price = 100;
      createProductDto1.description = 'description1';
      service.create(createProductDto1);

      const createProductDto2 = new CreateProductDto();
      createProductDto2.name = 'name2';
      createProductDto2.price = 200;
      createProductDto2.description = 'description2';
      service.create(createProductDto2);

      const products = service.findAll();

      expect(products).toHaveLength(2);
      expect(Math.abs(products[1].id - products[0].id)).toBe(1);
    });
  });

  describe('findAll', () => {
    it('제품 배열을 반환한다.', () => {
      expect(Array.isArray(service.findAll())).toBeTruthy();
    });
  });

  describe('findOne', () => {
    it('id로 제품을 찾을 수 있다.', () => {
      const createProductDto = new CreateProductDto();
      createProductDto.name = 'name';
      createProductDto.price = 100;
      createProductDto.description = 'description';
      service.create(createProductDto);
      const id = service.findAll()[0].id;

      expect(service.findOne(id).id).toBe(id);
    });

    it('존재하지 않는 id로 제품을 찾으려고 하면 BadRequestException을 던진다.', () => {
      expect(() => service.findOne(-1)).toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('UpdateProductDto에 포함된 정보들만 업데이트 한다.', () => {
      const createProductDto = new CreateProductDto();
      createProductDto.name = 'name';
      createProductDto.price = 100;
      createProductDto.description = 'description';
      service.create(createProductDto);
      const product = JSON.parse(JSON.stringify(service.findAll()[0]));

      const updateProductDto = new UpdateProductDto();
      updateProductDto.price = 10000;
      const updatedProduct = service.update(product.id, updateProductDto);

      expect(product.id).toBe(updatedProduct.id);
      expect(product.name).toBe(updatedProduct.name);
      expect(product.description).toBe(updatedProduct.description);
      expect(product.price).not.toBe(updatedProduct.price);
    });

    it('업데이트되면 제품 정보가 업데이트된 시간을 저장한다', () => {
      const createProductDto = new CreateProductDto();
      createProductDto.name = 'name';
      createProductDto.price = 100;
      createProductDto.description = 'description';
      service.create(createProductDto);
      const product = JSON.parse(JSON.stringify(service.findAll()[0]));

      const updateProductDto = new UpdateProductDto();
      updateProductDto.price = 10000;
      const updatedProduct = service.update(product.id, updateProductDto);

      expect(updatedProduct.createdAt !== updatedProduct.updatedAt).toBe(true);
    });

    it('존재하지 않는 id로 제품을 업데이트하려고 하면 BadRequestException을 던진다.', () => {
      expect(() => service.update(-1, null)).toThrow(BadRequestException);
    });

    it('잠긴 제품을 업데이트하려고 하면 Locked Exception을 던진다.', () => {
      const createProductDto = new CreateProductDto();
      createProductDto.name = 'name';
      createProductDto.price = 100;
      createProductDto.description = 'description';
      service.create(createProductDto);
      const id = service.findAll()[0].id;

      const updateProductDto = new UpdateProductDto();
      updateProductDto.isLocked = true;
      service.update(id, updateProductDto);

      expect(() => service.update(id, updateProductDto)).toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('id로 제품을 삭제할 수 있다.', () => {
      const createProductDto = new CreateProductDto();
      createProductDto.name = 'name';
      createProductDto.price = 100;
      createProductDto.description = 'description';
      service.create(createProductDto);
      const id = service.findAll()[0].id;

      service.remove(id);

      expect(service.findAll()).toEqual([]);
    });

    it('존재하지 않는 id로 제품을 삭제하려고 하면 BadRequestException을 던진다.', () => {
      expect(() => service.remove(-1)).toThrow(BadRequestException);
    });
  });
});
