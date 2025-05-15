import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

// definiert eine Test-Suite namens 'App e2e'
describe('App e2e', () => {
  // variablen deklarieren
  let app: INestApplication;
  let prisma: PrismaService; // Hält den Prisma-Service für Datenbankoperationen

  // setup vor allen Tests
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // erstellt eine neue Instanz der NestJS- Anwendung
    app = moduleRef.createNestApplication();
    // verwendet die ValidationPipe um ungültige Eingaben zu filtern
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    // initialisiert die Anwendung
    await app.init();
    await app.listen(3333);

    // get the PrismaService from the module and call the cleanDb method
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    // set the base url for the requests, so we don't have to write it every time
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    // schließt die Anwendung nach allen Tests
    app.close();
  });

  // let's create some tests
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'arda@test.com',
      password: '123',
    };
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')

          .expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

      describe('Signin', () => {
        it('should throw if email empty', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody({
              password: dto.password,
            })
            .expectStatus(400);
        });
        it('should throw if password empty', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody({
              email: dto.email,
            })
            .expectStatus(400);
        });
        it('should throw if no body provided', () => {
          return pactum
            .spec()
            .post('/auth/signin')

            .expectStatus(400);
        });

        it('should signin', () => {
          return (
            pactum
              .spec()
              .post('/auth/signin')
              .withBody(dto)
              .expectStatus(200)
              // gets access token from the body and it stores it in the variable userAt
              .stores('userAt', 'access_token')
          );
        });
      });
    });

    describe('User', () => {
      describe('Get me', () => {
        it('should get current user', () => {
          return pactum
            .spec()
            .get('/users/me')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200);
        });
      });
      describe('Edit user', () => {
        it('should edit user', () => {
          const dto: EditUserDto = {
            firstName: 'Kekse',
            email: 'kekse@test.com',
          };
          return pactum
            .spec()
            .patch('/users')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .withBody(dto)
            .expectStatus(200)
            .expectBodyContains(dto.firstName)
            .expectBodyContains(dto.email);
        });
      });
    });

    describe('Bookmark', () => {
      describe('Get empty bookmarks', () => {
        it('should get empty bookmarks', () => {
          return pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectBody([]);
        });
      });
      describe('Create bookmark', () => {
        const dto: CreateBookmarkDto = {
          title: 'First Bookmark',
          link: 'https://www.google.com',
        };
        it('should create bookmark', () => {
          return pactum
            .spec()
            .post('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .withBody(dto)
            .expectStatus(201)
            .stores('bookmarkId', 'id');
        });
      });
      describe('Get bookmarks', () => {
        it('should get bookmarks', () => {
          return pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectJsonLength(1);
        });
      });
      describe('Get bookmark by id', () => {
        it('should get bookmark by id', () => {
          return pactum
            .spec()
            .get('/bookmarks/{id}')
            .withPathParams('id', '$S{bookmarkId}')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectBodyContains('$S{bookmarkId}');
        });
      });
      describe('Edit bookmark by id', () => {
        it('should edit bookmark by id', () => {
          const dto: EditBookmarkDto = {
            title: 'Updated Bookmark',
            description: 'Updated Description',
          };
          return pactum
            .spec()
            .patch('/bookmarks/{id}')
            .withPathParams('id', '$S{bookmarkId}')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .withBody(dto)
            .expectStatus(200)
            .expectBodyContains(dto.title)
            .expectBodyContains(dto.description);
        });
      });
      describe('Delete bookmark by id', () => {
        it('should delete bookmark by id', () => {
          return pactum
            .spec()
            .delete('/bookmarks/{id}')
            .withPathParams('id', '$S{bookmarkId}')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(204);
        });

        it('should get empty bookmarks after deletion', () => {
          return pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectJsonLength(0);
        });
      });
    });
  });
});
