# NestJS Microservice CRUD CLI

A powerful CLI tool to generate CRUD modules for NestJS microservices following Clean Architecture principles.

## Features

- 🚀 **Fast CRUD Generation**: Create complete CRUD modules in seconds
- 🏗️ **Clean Architecture**: Follows Clean Architecture patterns with separation of concerns
- 🔄 **Multiple Database Support**: PostgreSQL (TypeORM) and MongoDB (Mongoose)
- 📦 **Auto-Import**: Automatically registers modules in the appropriate files
- 🧪 **Test Ready**: Generates complete test suites with Jest
- 🔒 **Type Safe**: Full TypeScript support with proper validation
- 🎯 **Multiple Templates**: Core, Module, Library, Infrastructure, and CRUD generators

## Installation

```bash
npm install -g @mikemajesty/microservice-crud
```

Or use directly with npx:

```bash
npx @mikemajesty/microservice-crud
```

## Usage

Navigate to your NestJS microservice project root directory and run:

```bash
microservice-crud
```

Or using npm script:

```bash
npm run crud
```

### Available Templates

The CLI will prompt you to select a template:

1. **POSTGRES:CRUD** - Complete CRUD with PostgreSQL/TypeORM
2. **MONGO:CRUD** - Complete CRUD with MongoDB/Mongoose
3. **LIB** - Library module (shared services)
4. **INFRA** - Infrastructure module (adapters, external services)
5. **MODULE** - Simple module (controller + module only)
6. **CORE** - Core use case (single domain logic)

## What Gets Generated

### POSTGRES:CRUD / MONGO:CRUD

Creates a complete CRUD module with:

```
src/
├── core/
│   └── [name]/
│       ├── entity/
│       │   └── [name].ts           # Domain entity with validation
│       ├── repository/
│       │   └── [name].ts           # Repository interface
│       └── use-cases/
│           ├── [name]-create.ts    # Create use case
│           ├── [name]-update.ts    # Update use case
│           ├── [name]-delete.ts    # Delete use case
│           ├── [name]-list.ts      # List with pagination
│           ├── [name]-get-by-id.ts # Get by ID use case
│           └── __tests__/          # Complete test suite
│               ├── [name]-create.spec.ts
│               ├── [name]-update.spec.ts
│               ├── [name]-delete.spec.ts
│               ├── [name]-list.spec.ts
│               └── [name]-get-by-id.spec.ts
├── modules/
│   └── [name]/
│       ├── adapter.ts              # Adapter interfaces
│       ├── controller.ts           # REST controller with decorators
│       ├── module.ts               # NestJS module
│       └── repository.ts           # Repository implementation
└── infra/
    └── database/
        └── [postgres|mongo]/
            └── schemas/
                └── [name].ts       # Database schema
```

**Features:**
- ✅ Complete CRUD operations (Create, Read, Update, Delete, List)
- ✅ Input validation with Zod schemas
- ✅ Pagination support
- ✅ Search and filters
- ✅ Soft delete support
- ✅ Permission-based access control
- ✅ Swagger documentation ready
- ✅ Full test coverage

### LIB (Library Module)

Creates a shared library module:

```
src/libs/[name]/
├── adapter.ts    # Service adapter interface
├── index.ts      # Public exports
├── module.ts     # Library module
└── service.ts    # Service implementation
```

**Use cases:** Event handlers, i18n, metrics, tokens, shared utilities

### INFRA (Infrastructure Module)

Creates an infrastructure module:

```
src/infra/[name]/
├── adapter.ts    # Infrastructure adapter interface
├── index.ts      # Public exports
├── module.ts     # Infrastructure module
└── service.ts    # Service implementation
```

**Use cases:** Cache, database connections, email, HTTP clients, loggers, secrets

### MODULE (Simple Module)

Creates a basic module:

```
src/modules/[name]/
├── controller.ts # Basic controller
└── module.ts     # Module definition
```

**Use cases:** Health checks, status endpoints, simple routes

### CORE (Single Use Case)

Creates a single domain use case:

```
src/core/[name]/
├── entity/
│   └── [name].ts
├── repository/
│   └── [name].ts
└── use-cases/
    └── [name]-rename.ts
```

**Use cases:** Custom business logic, specific operations

## Auto-Import Behavior

The CLI automatically registers generated modules:

- **CRUD/MODULE**: Registered in `src/app.module.ts`
- **LIB**: Registered in `src/libs/module.ts` with `LibModule` suffix
- **INFRA**: Registered in `src/infra/module.ts`

No manual imports needed! 🎉

## Name Validation

Module names are automatically sanitized:

- ✅ Converts to kebab-case
- ✅ Removes special characters
- ✅ Prevents numeric prefixes
- ✅ Handles spaces and underscores

Examples:
- `User Profile` → `user-profile`
- `my_module` → `my-module`
- `Product@123` → `product-123`

## Generated Code Patterns

### Entity
```typescript
export class ProductEntity extends BaseEntity {
  name: string;

  constructor(input: ProductEntityInput) {
    super();
    this.name = input.name;
    this.validate();
    this.ensureID();
  }

  validate() {
    const validation = ProductEntitySchema.safeParse(this);
    if (!validation.success) return validation.error;
  }
}
```

### Use Case
```typescript
export class ProductCreateUsecase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(input: ProductCreateInput): Promise<ProductEntity> {
    const entity = new ProductEntity(input);
    await this.repository.create(entity);
    return entity.toObject();
  }
}
```

### Controller
```typescript
@Controller('products')
export class ProductController {
  @Post()
  @Permission('product:create')
  @ApiBody({ type: ProductCreateInput })
  async create(@Body() input: ProductCreateInput) {
    return await this.createUsecase.execute(input);
  }
}
```

## Requirements

Your NestJS project must have:

- `src/core/` directory
- `src/modules/` directory
- `src/app.module.ts` file

For library modules: `src/libs/module.ts`

For infrastructure modules: `src/infra/module.ts`

## Best Practices

1. **Run from project root**: Always execute the CLI from your NestJS project root
2. **Descriptive names**: Use clear, descriptive module names
3. **Follow conventions**: Stick to kebab-case naming
4. **Review generated code**: Always review and customize generated code for your needs
5. **Run tests**: Execute `npm test` after generation to ensure everything works

## Testing Generated Code

After generating a module, verify it works:

```bash
# Build the project
npm run build

# Run linter
npm run lint

# Run tests
npm test
```

## Customization

All generated templates are in `src/templates/`:

- `core/` - Core domain templates
- `mongo/` - MongoDB templates
- `postgres/` - PostgreSQL templates
- `libs/` - Library templates
- `infra/` - Infrastructure templates
- `module/` - Simple module templates

Modify these to match your project's patterns.

## Troubleshooting

**Error: "select nestjs microservice api root"**
- Ensure you're running from the correct directory
- Verify `src/core/` and `src/modules/` exist

**Module not imported automatically**
- Check if target module file exists
- Verify import paths are correct
- Module may already be imported

**Build errors after generation**
- Run `npm run build` to check TypeScript errors
- Verify dependencies are installed
- Check for naming conflicts

## Contributing

Contributions are welcome! Please submit issues and pull requests on GitHub.

## License

MIT

## Author

Mike Majesty - [@mikemajesty](https://github.com/mikemajesty)

## Related Projects

- [NestJS Microservice Boilerplate](https://github.com/mikemajesty/nestjs-microservice-boilerplate-api)
