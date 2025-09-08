# 💰 Finanztracker Development Roadmap

## Übersicht

Roadmap zur Erweiterung der bestehenden NestJS API zu einem vollständigen persönlichen Finanztracker mit Budgetplanung.

---

## 🚀 NÄCHSTE SCHRITTE - Start hier!

### Sofort umsetzbare Aktionen (nächste 1-2 Stunden):

#### 1. Dependencies installieren

```bash
npm install @nestjs/schedule @nestjs/cron date-fns csv-writer
npm install @types/cron --save-dev
```

#### 2. Prisma Schema erweitern - ERSTE MODELS

Öffne `prisma/schema.prisma` und füge nach dem bestehenden Bookmark-Model hinzu:

```prisma
model Account {
  id          Int      @id @default(autoincrement())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  name        String
  type        String   // "checking", "savings", "credit_card", "cash"
  balance     Float    @default(0)
  currency    String   @default("EUR")

  userId      Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  transactions Transaction[]

  @@map("accounts")
}

model Category {
  id          Int      @id @default(autoincrement())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  name        String
  color       String?  // für UI-Farbe
  icon        String?  // für UI-Icon

  userId      Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  transactions Transaction[]

  @@map("categories")
}

model Transaction {
  id          Int      @id @default(autoincrement())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  amount      Float
  description String
  date        DateTime @default(now())
  type        String   // "income" oder "expense"

  userId      Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  accountId   Int
  account     Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)

  categoryId  Int?
  category    Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  @@map("transactions")
}
```

#### 3. User Model erweitern

Füge zu deinem bestehenden User Model diese Relations hinzu:

```prisma
model User {
  // ... existing fields ...

  // Neue Relations hinzufügen:
  accounts     Account[]
  categories   Category[]
  transactions Transaction[]
}
```

#### 4. Migration ausführen

```bash
npx prisma migrate dev --name "add_finance_models"
npx prisma generate
```

#### 5. Erste Service erstellen - TransactionService

Erstelle Ordner und Dateien:

```bash
mkdir src/transaction
mkdir src/transaction/dto
mkdir src/account
mkdir src/account/dto
mkdir src/category
mkdir src/category/dto
```

---

## 📋 SOFORT-CHECKLISTE für heute:

- [ ] ✅ Dependencies installiert
- [ ] ✅ Prisma Schema erweitert (Account, Category, Transaction)
- [ ] ✅ User Relations hinzugefügt
- [ ] ✅ Migration ausgeführt
- [ ] ✅ Ordnerstruktur für neue Services erstellt
- [ ] 🎯 **TransactionService erstellen** (nächster Schritt)
- [ ] 🎯 **TransactionController erstellen**
- [ ] 🎯 **Erste DTOs definieren**

---

## 🎯 DIESE WOCHE: Transaction-System (Phase 1A)

### Tag 1-2: Transaction Grundlagen

#### TransactionService erstellen (`src/transaction/transaction.service.ts`):

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(userId: number, dto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        ...dto,
        userId,
      },
      include: {
        account: true,
        category: true,
      },
    });
  }

  async getTransactions(userId: number) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        account: true,
        category: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  // Weitere Methods folgen...
}
```

### Tag 3-4: Account & Category Services

#### Nächste Priorität:

1. **AccountService** - Kontoverwaltung
2. **CategoryService** - Kategorienverwaltung
3. **Basis-Controller** für alle drei

---

## 🗓️ WOCHENPLAN - Detailliert

### Woche 1: Grundlagen schaffen

**Mo-Di:** Prisma Models + Migration
**Mi-Do:** TransactionService + Controller
**Fr-Sa:** AccountService + CategoryService
**So:** Testing der Basis-Endpoints

### Woche 2: CRUD vervollständigen

**Mo-Di:** Alle DTOs definieren
**Mi-Do:** Update/Delete Funktionen
**Fr-Sa:** Validation & Error Handling
**So:** Erste Tests mit Postman/Insomnia

### Woche 3: Budget-System

**Mo-Di:** Budget Model + Migration
**Mi-Do:** BudgetService
**Fr-Sa:** Budget-Controller
**So:** Budget-Überwachung Logic

---

## 📝 CODE-TEMPLATES für schnellen Start

### Transaction DTO Template (`src/transaction/dto/create-transaction.dto.ts`):

```typescript
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsIn(['income', 'expense'])
  type: 'income' | 'expense';

  @IsNumber()
  @IsNotEmpty()
  accountId: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsOptional()
  date?: Date;
}
```

### Controller Template:

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto';

@UseGuards(JwtGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  getTransactions(@GetUser('id') userId: number) {
    return this.transactionService.getTransactions(userId);
  }

  @Post()
  createTransaction(
    @GetUser('id') userId: number,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionService.createTransaction(userId, dto);
  }
}
```

---

## ⚡ QUICK WINS - Schnelle Erfolge

### Diese Features kannst du in 1-2 Stunden umsetzen:

1. **Basis-Transaktionen** - Einnahmen/Ausgaben hinzufügen
2. **Konten-Liste** - Alle Benutzerkonten anzeigen
3. **Kategorien-Management** - Standard-Kategorien erstellen
4. **Saldo-Berechnung** - Aktuellen Kontostand ermitteln

### Testbare Endpoints nach Tag 1:

- `POST /transactions` - Neue Transaktion
- `GET /transactions` - Alle Transaktionen
- `GET /accounts` - Alle Konten
- `POST /accounts` - Neues Konto

---

## 💡 ENTWICKLUNGSTIPPS

### Reihenfolge der Implementierung:

1. **Models & Migration** ✅ (heute!)
2. **Services** (Transaction → Account → Category)
3. **Controller** (parallel zu Services)
4. **DTOs & Validation**
5. **Testing mit echten Daten**

### Debugging-Strategie:

- Prisma Studio nutzen: `npx prisma studio`
- Postman Collection für API-Tests
- Console.log für Service-Debugging

### Git-Workflow:

```bash
git checkout -b feature/transaction-system
# Nach jedem größeren Schritt:
git add .
git commit -m "feat: add transaction model and service"
```

---

## 🛠️ TROUBLESHOOTING - Häufige Probleme

### Prisma Migration Fehler:

```bash
# Schema Reset falls nötig:
npx prisma migrate reset
npx prisma migrate dev --name "init_finance_models"
```

### Import Fehler:

- Alle neuen Services in entsprechende `.module.ts` einbinden
- Exports in `index.ts` Dateien nicht vergessen

### Validation Fehler:

- `class-validator` für alle DTOs nutzen
- `ValidationPipe` in `main.ts` aktiviert lassen

---

## 🗄️ Prisma Schema Erweiterungen

### Neue Models

- [ ] **Account Model** - Bankkonten, Kreditkarten, etc.
- [ ] **Transaction Model** - Einnahmen/Ausgaben
- [ ] **Category Model** - Ausgabenkategorien
- [ ] **Budget Model** - monatliche/jährliche Budgets
- [ ] **Goal Model** - Sparziele
- [ ] **RecurringTransaction Model** - wiederkehrende Zahlungen

### User Relations

- [ ] User-Relations zu allen neuen Models hinzufügen

---

## 🔧 Neue Services & Controller

### Backend Services

- [ ] **TransactionService** - CRUD für Transaktionen
- [ ] **BudgetService** - Budget-Verwaltung & -Überwachung
- [ ] **CategoryService** - Kategorie-Management
- [ ] **AccountService** - Konto-Verwaltung
- [ ] **ReportService** - Finanzberichte & Analytics
- [ ] **GoalService** - Sparziele-Tracking

### Controller

- [ ] **TransactionController**
- [ ] **BudgetController**
- [ ] **CategoryController**
- [ ] **AccountController**
- [ ] **ReportController**
- [ ] **GoalController**

---

## 📝 Neue DTOs

### Transaction DTOs

- [ ] `CreateTransactionDto`
- [ ] `UpdateTransactionDto`
- [ ] `FilterTransactionDto` (für Datums-/Kategoriefilter)

### Budget DTOs

- [ ] `CreateBudgetDto`
- [ ] `UpdateBudgetDto`

### Account & Category DTOs

- [ ] `CreateAccountDto`
- [ ] `CreateCategoryDto`

---

## ✨ Zusätzliche Features

### Automation

- [ ] **Cron Jobs** für wiederkehrende Transaktionen
- [ ] **Notification Service** für Budget-Überschreitungen

### Export & Analytics

- [ ] **Export Service** (CSV/PDF für Berichte)
- [ ] **Dashboard Analytics** (Ausgaben-Trends, Kategorien-Verteilung)

---

## 📦 Neue Dependencies

### Installation erforderlich:

```bash
npm install @nestjs/schedule @nestjs/cron
npm install date-fns # für Datums-Berechnungen
npm install csv-writer # für Export-Funktionen
```

---

## 🌐 Neue API-Endpoints

### Transaction Management

- [ ] `GET /transactions` - Liste mit Filtering
- [ ] `POST /transactions` - Neue Transaktion
- [ ] `PUT /transactions/:id` - Transaktion bearbeiten
- [ ] `DELETE /transactions/:id` - Transaktion löschen

### Budget Management

- [ ] `GET /budgets` - Budget-Übersicht
- [ ] `POST /budgets` - Neues Budget
- [ ] `GET /budgets/:id/status` - Budget-Status prüfen

### Account Management

- [ ] `GET /accounts` - Konten auflisten
- [ ] `POST /accounts` - Neues Konto
- [ ] `GET /accounts/:id/balance` - Saldo-Tracking

### Categories

- [ ] `GET /categories` - Kategorien auflisten
- [ ] `POST /categories` - Neue Kategorie

### Reports & Analytics

- [ ] `GET /reports/monthly` - Monatsberichte
- [ ] `GET /reports/yearly` - Jahresberichte
- [ ] `GET /reports/trends` - Ausgaben-Trends

### Goals Management

- [ ] `GET /goals` - Sparziele auflisten
- [ ] `POST /goals` - Neues Sparziel
- [ ] `GET /goals/:id/progress` - Fortschritt verfolgen

---

## 🎯 Entwicklungsphasen

### Phase 1: Grundlagen (Woche 1-2)

- [ ] Prisma Schema erweitern
- [ ] Basis-Models implementieren
- [ ] Auth-Relations hinzufügen

### Phase 2: Core Services (Woche 3-4)

- [ ] Transaction-Service & -Controller
- [ ] Account-Service & -Controller
- [ ] Category-Service & -Controller

### Phase 3: Advanced Features (Woche 5-6)

- [ ] Budget-Management
- [ ] Goals-Tracking
- [ ] Recurring Transactions

### Phase 4: Analytics & Export (Woche 7-8)

- [ ] Report-Service
- [ ] Export-Funktionalitäten
- [ ] Dashboard Analytics

### Phase 5: Automation (Woche 9-10)

- [ ] Cron Jobs
- [ ] Notifications
- [ ] Testing & Optimierung

---

## ⚠️ Wichtige Notizen

- **Auth-System**: Bleibt größtenteils unverändert
- **Bestehender Code**: Kann weiterverwendet werden
- **Database**: Prisma Migrationen für neue Models
- **Security**: JWT-Authentication für alle neuen Endpoints

---

## 🚀 Getting Started

1. Prisma Schema um erste Models erweitern
2. Database Migration ausführen
3. Erste Service/Controller-Paare implementieren
4. Schrittweise Features hinzufügen

**Geschätzte Entwicklungszeit:** 10-12 Wochen bei 2 Tagen/Woche
