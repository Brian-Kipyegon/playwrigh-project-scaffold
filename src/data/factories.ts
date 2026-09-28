import { faker } from '@faker-js/faker';

export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export type NewProduct = {
  title: string;
  description: string;
  price: number;
  category: string;
};

/** Factories return fresh, unique data per call. Pass overrides to pin specific fields. */
export function buildCustomer(overrides: Partial<Customer> = {}): Customer {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode(),
    ...overrides,
  };
}

export function buildProduct(overrides: Partial<NewProduct> = {}): NewProduct {
  return {
    title: `${faker.commerce.productName()} ${faker.string.alphanumeric(6)}`,
    description: faker.commerce.productDescription(),
    price: Number(faker.commerce.price({ min: 1, max: 500 })),
    category: 'automation-test',
    ...overrides,
  };
}
