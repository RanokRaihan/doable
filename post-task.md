# Post Task Page — Planning Notes

Next up is `/post-task`, one of the most complicated and important pages in the project.

## mandatory all ui must be modern responsive and industry standard.

mandatoy read the api-contract.md file in root directory.

## Image Handling

Users can upload up to **5 photos** per task. The frontend will have a modern, interactive image upload UI.

### Architecture

- Images are a **separate model** in the backend.
- **Cloudinary** is used for image storage.
- upload image from frontend, backend will receive the url, not the image.
- Image upload/management is handled **independently** from the main task submission.
- Image links should be **persisted in the browser** (e.g., `localStorage`, or `indexDB` whichever is preferable) so that if a user closes the tab and returns later, they don't have to re-upload. as well as the other form fields.

### Two Approaches for Saving Image Links

1. **Single endpoint** — Send image links alongside task data; handle both the task creation and image link storage in one request.
2. **Two-step flow** — Submit the task data first, receive the task ID in the response, then hit a separate endpoint to associate the uploaded images with that task.

current `/task/post-task` endpoint only takes text fields, dosen't handles image. I will adjust the backend according to the decision.

### Orphaned Image Cleanup

We need a strategy for images uploaded to Cloudinary but never saved to the database (e.g., the user abandons the form mid-flow). Options to explore:

- A scheduled cleanup job that removes Cloudinary assets with no matching database record.
- Tracking "pending" uploads with a TTL and purging expired ones.
- or a backend cron job to clean up the orphaned images.

### Image Model (Prisma)

```prisma
model Image {
  id        String   @id @default(cuid())
  url       String   @db.VarChar(500)
  altText   String?  @db.VarChar(255)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  taskId String
  task   Task @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@index([taskId])
  @@map("images")
}
```

> **Backend image handling is not yet implemented** — needs design decisions on the best approach.

---

## Task Data

After uploading images, the user fills out the remaining task fields.

### Task Model (Prisma)

```prisma
model Task {
  id                 String       @id @default(cuid())
  title              String       @db.VarChar(200)
  description        String       @db.Text
  category           TaskCategory
  priority           TaskPriority @default(MEDIUM)
  postedById         String
  postedBy           User         @relation(fields: [postedById], references: [id], onDelete: Cascade)
  status             TaskStatus   @default(OPEN)
  location           String       @db.VarChar(255)
  latitude           Float?       @db.DoublePrecision
  longitude          Float?       @db.DoublePrecision
  baseCompensation   Decimal      @db.Decimal(10, 2)
  agreedCompensation Decimal?     @db.Decimal(10, 2)
  scheduledAt        DateTime
  estimatedDuration  Int?         @db.SmallInt // in minutes (TODO: make required)
  expiresAt          DateTime?

  // Approved application
  approvedApplicationId String?      @unique
  approvedApplication   Application? @relation("ApprovedApplication", fields: [approvedApplicationId], references: [id])

  // Soft delete & audit
  isDeleted Boolean   @default(false)
  deletedAt DateTime?
  deletedBy String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Relations
  applications Application[]
  reviews      Review[]
  messages     Message[]
  images       Image[]
  payments     Payment[]
  commissions  CommissionDue[]

  @@index([postedById])
  @@index([status])
  @@index([category])
  @@index([priority])
  @@index([scheduledAt])
  @@index([isDeleted])
  @@index([createdAt])
  @@index([expiresAt])
  @@index([location])
  @@map("tasks")
}
```

---

## create task schema

```ts
const createTaskSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title must be 200 characters or less"),
      description: z.string().min(1, "Description is required"),
      category: z.enum(TaskCategory),
      priority: z.enum(TaskPriority).default(TaskPriority.MEDIUM),
      location: z
        .string()
        .min(1, "Location is required")
        .max(255, "Location must be 255 characters or less"),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      baseCompensation: z
        .number()
        .positive("Base compensation must be positive"),
      scheduledAt: z.iso.datetime("Invalid date format"),
      estimatedDuration: z
        .number()
        .int()
        .positive("Estimated duration is required"),
      expiresAt: z.iso.datetime().optional(),
    })
    .strict(),
});
```

---

## Location Handling

Location is another complex piece. There are multiple input methods to support:

- **Current location** — Use the browser's Geolocation API; reverse-geocode to get an address.
- **Manual address entry** — User types an address; forward-geocode to extract lat/long.

### Open Question

The `Task` model currently stores location as a flat string with optional `latitude`/`longitude` fields. However, there is also a standalone `Location` model that is **not yet in use**:

```prisma
model Location {
  id        String  @id @default(cuid())
  name      String  @db.VarChar(255)
  city      String  @db.VarChar(100)
  state     String  @db.VarChar(100)
  country   String  @db.VarChar(100)
  zipCode   String? @db.VarChar(20)
  latitude  Float   @db.DoublePrecision
  longitude Float   @db.DoublePrecision
  isActive  Boolean @default(true)

  // Audit
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([city])
  @@index([state])
  @@index([country])
  @@index([zipCode])
  @@index([latitude, longitude])
  @@index([isActive])
  @@map("locations")
}
```

**Decision needed:** Should we normalize location into the `Location` model (with a foreign key on `Task`), or keep it inline on the `Task` model? Using the separate model enables reuse and structured queries (e.g., filter by city/state) but adds complexity.

---

---

follow the form handling as login or register.

## Summary of Key Decisions Needed

| Area           | Question                                                  |
| -------------- | --------------------------------------------------------- |
| Image flow     | Single endpoint vs. two-step ?                            |
| Orphan cleanup | Cron job, TTL-based purge, or another strategy?           |
| Image backend  | API design for upload tracking and link persistence       |
| Location model | Normalize into `Location` model or keep inline on `Task`? |
| Location input | Which input methods to support at launch?                 |
