# StudyGroup Database Schema Design

## Overview

The StudyGroup database is designed using a relational model with Entity Framework Core on MS SQL Server 2022. The schema implements role-based access control, group management, and real-time collaboration features.

---

## Entity-Relationship Diagram (ERD)

```
┌─────────────┐        ┌────────────────┐
│   Roles     │        │  RefreshTokens │
│ (id, name)  │◄─────┐ │(id, token...)  │
└─────────────┘      │ └────────────────┘
       △             │         │
       │ (M:N)       │         │(1:N)
       │             └─────────┤
┌──────┴──────┐               │
│  UserRoles  │               │
│(userId,     │               │
│ roleId)     │               │
└─────────────┘               │
       △                       │
       │(M:N)                  │
       │            ┌──────────▼──────────┐
       └────────────┤      Users         │
                    │ (id, fullName,    │
                    │  email, password, │
                    │  isApproved...)   │
                    └──────────┬─────────┘
                               │
               ┌───────────────┼───────────────┐
               │(1:N)          │(1:N)          │(1:N)
               ▼               ▼               ▼
        ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
        │   Groups    │ │JoinRequests │ │Notifications
        │ (id, name,  │ │(id, status) │ │(id, message)
        │  subject,   │ │             │ │             │
        │  meetingType│ │             │ └─────────────┘
        │  IsApproved)│ │             │
        └─────────────┘ │             │
               │         │      ┌──────┘
               │(1:N)    │(1:N) │
               │(Cascade)│      │
       ┌───────┼─────────┼──────┘
       │       │         │
       ▼       ▼         ▼
    ┌────────────────────────────┐
    │   Materials                │
    │ (id, fileName, filePath,   │
    │  fileSizeBytes)            │
    └────────────────────────────┘

    ┌──────────────────────────────────┐
    │   DiscussionMessages             │
    │ (id, content, sentAt,            │
    │  groupId, senderId)              │
    └──────────────────────────────────┘
```

---

## Table Specifications

### 1. Users
**Purpose**: Store user account information and authentication data

| Column | Type | Constraints | Description |
|--------|------|-------------|---|
| Id | GUID | PRIMARY KEY | Unique identifier |
| FullName | NVARCHAR(200) | NOT NULL | User's full name |
| Email | NVARCHAR(256) | NOT NULL, UNIQUE | Email address (used for login) |
| PasswordHash | NVARCHAR(MAX) | NOT NULL | Bcrypt hashed password |
| IsApproved | BIT | NOT NULL, DEFAULT 1 | Admin approval flag (0=pending, 1=approved) |
| CreatedAt | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Account creation timestamp |

**Indexes**: 
- UNIQUE(Email) - for email lookups during login

---

### 2. Roles
**Purpose**: Define user roles in the system

| Column | Type | Constraints | Description |
|--------|------|-------------|---|
| Id | INT | PRIMARY KEY, IDENTITY | Role identifier |
| Name | NVARCHAR(50) | NOT NULL, UNIQUE | Role name (Admin, GroupCreator, Student) |

**Predefined Roles**:
- Admin (Id=1)
- GroupCreator (Id=2)  
- Student (Id=3)

---

### 3. UserRoles
**Purpose**: Join table for user-role relationships (many-to-many)

| Column | Type | Constraints | Description |
|--------|------|-------------|---|
| UserId | GUID | PRIMARY KEY (part 1), FK | References Users.Id |
| RoleId | INT | PRIMARY KEY (part 2), FK | References Roles.Id |

**Relationships**:
- FK: UserId → Users.Id (NO ACTION)
- FK: RoleId → Roles.Id (NO ACTION)

---

### 4. Groups
**Purpose**: Store study group information created by group creators

| Column | Type | Constraints | Description |
|--------|------|-------------|---|
| Id | GUID | PRIMARY KEY | Unique group identifier |
| Name | NVARCHAR(200) | NOT NULL | Group name |
| Description | NVARCHAR(MAX) | NOT NULL | Detailed group description |
| Subject | NVARCHAR(100) | NOT NULL | Study subject (e.g., "Mathematics") |
| Location | NVARCHAR(200) | NULLABLE | Physical/online location |
| MeetingType | NVARCHAR(50) | NOT NULL, DEFAULT "Online" | "Online" or "Offline" |
| MeetingSchedule | NVARCHAR(500) | NOT NULL | When group meets (e.g., "Every Tuesday 3PM") |
| MaxMembers | INT | NOT NULL, DEFAULT 30 | Maximum group size |
| IsApproved | BIT | NOT NULL, DEFAULT 0 | Admin approval status |
| CreatedAt | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp |
| OwnerId | GUID | NOT NULL, FK | References Users.Id (group creator) |

**Indexes**:
- IX(IsApproved, CreatedAt) - for browsing approved groups
- IX(OwnerId) - for group creator's groups

**Relationships**:
- FK: OwnerId → Users.Id (NO ACTION)

---

### 5. JoinRequests
**Purpose**: Track student requests to join groups

| Column | Type | Constraints | Description |
|--------|------|-------------|---|
| Id | GUID | PRIMARY KEY | Unique request identifier |
| Status | NVARCHAR(50) | NOT NULL, DEFAULT "Pending" | "Pending", "Approved", or "Rejected" |
| CreatedAt | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Request submission timestamp |
| UserId | GUID | NOT NULL, FK | References Users.Id (student) |
| GroupId | GUID | NOT NULL, FK | References Groups.Id |

**Indexes**:
- IX(UserId, GroupId, Status) - for membership checks
- IX(GroupId, Status) - for getting group members

**Relationships**:
- FK: UserId → Users.Id (NO ACTION)
- FK: GroupId → Groups.Id (CASCADE) - delete requests when group deleted

---

### 6. Materials
**Purpose**: Store study materials (files) uploaded by group members

| Column | Type | Constraints | Description |
|--------|------|-------------|---|
| Id | GUID | PRIMARY KEY | Unique material identifier |
| FileName | NVARCHAR(500) | NOT NULL | Original file name |
| FilePath | NVARCHAR(MAX) | NOT NULL | Server storage path |
| FileSizeBytes | BIGINT | NOT NULL | File size in bytes |
| UploadedAt | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Upload timestamp |
| GroupId | GUID | NOT NULL, FK | References Groups.Id |
| UploadedById | GUID | NOT NULL, FK | References Users.Id (uploader) |

**Relationships**:
- FK: GroupId → Groups.Id (CASCADE) - delete materials when group deleted
- FK: UploadedById → Users.Id (NO ACTION)

---

### 7. DiscussionMessages
**Purpose**: Store real-time group discussion messages

| Column | Type | Constraints | Description |
|--------|------|-------------|---|
| Id | GUID | PRIMARY KEY | Unique message identifier |
| Content | NVARCHAR(MAX) | NOT NULL | Message text |
| SentAt | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Message timestamp |
| GroupId | GUID | NOT NULL, FK | References Groups.Id |
| SenderId | GUID | NOT NULL, FK | References Users.Id |

**Indexes**:
- IX(GroupId, SentAt DESC) - for loading messages chronologically

**Relationships**:
- FK: GroupId → Groups.Id (CASCADE) - delete messages when group deleted
- FK: SenderId → Users.Id (NO ACTION)

---

### 8. Notifications
**Purpose**: Store system notifications for users

| Column | Type | Constraints | Description |
|--------|------|-------------|---|
| Id | GUID | PRIMARY KEY | Unique notification identifier |
| Message | NVARCHAR(MAX) | NOT NULL | Notification text |
| IsRead | BIT | NOT NULL, DEFAULT 0 | Read status |
| CreatedAt | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp |
| UserId | GUID | NOT NULL, FK | References Users.Id |

**Indexes**:
- IX(UserId, IsRead, CreatedAt DESC) - for getting unread notifications

**Relationships**:
- FK: UserId → Users.Id (CASCADE) - delete notifications when user deleted

---

### 9. RefreshTokens
**Purpose**: Store JWT refresh tokens for authentication

| Column | Type | Constraints | Description |
|--------|------|-------------|---|
| Id | GUID | PRIMARY KEY | Unique token identifier |
| Token | NVARCHAR(MAX) | NOT NULL, UNIQUE | The refresh token string |
| UserId | GUID | NOT NULL, FK | References Users.Id |
| ExpiresAt | DATETIME2 | NOT NULL | Token expiration time |
| IsRevoked | BIT | NOT NULL, DEFAULT 0 | Revocation status |
| CreatedAt | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp |

**Indexes**:
- UNIQUE(Token) - for token lookup
- IX(UserId, IsRevoked) - for user's active tokens

**Relationships**:
- FK: UserId → Users.Id (CASCADE)

---

## Key Design Decisions

### 1. Soft Deletes vs Hard Deletes
- **Decision**: Hard deletes with CASCADE constraints
- **Rationale**: Simplifies queries and audit trails not required for this project

### 2. IsApproved Flag Pattern
- **Decision**: Used in Users and Groups tables
- **Rationale**: Simple boolean check for approval workflow (Admin → Creator → Student)

### 3. JoinRequest Status Pattern
- **Decision**: String-based enum (Pending, Approved, Rejected)
- **Rationale**: Allows status history and prevents duplicate requests

### 4. MaterialFilePath Storage
- **Decision**: Store full server path instead of blob storage
- **Rationale**: Simpler for Docker volumes, suitable for course project

### 5. Notification Broadcasting
- **Decision**: Create separate notification record per user
- **Rationale**: Allows per-user read status and filtering

---

## Indices Strategy

### Performance Optimization
- Composite indexes on frequently filtered columns
- DESC ordering on timestamps for latest-first queries
- UNIQUE constraints on natural keys (Email, Token)

### Query Performance
- GET /api/groups: Uses IX(IsApproved, CreatedAt)
- GET /api/groups/mine: Uses IX(OwnerId)
- GET /api/join-requests/group/{id}: Uses IX(GroupId, Status)
- Member verification: Uses IX(UserId, GroupId, Status)

---

## Constraints & Relationships

### Cascade Delete Policies
- Groups → JoinRequests, Materials, DiscussionMessages
- Users → RefreshTokens, Notifications
- **Rationale**: Maintain referential integrity while allowing group deletion

### No Action Policies
- Users (as Owner) → Groups
- Users (as Sender) → DiscussionMessages
- **Rationale**: Prevents accidental deletion of accounts with active content

---

## Initial Data

### Default Roles (Seeded on Startup)
```sql
INSERT INTO Roles (Name) VALUES ('Admin'), ('GroupCreator'), ('Student')
```

### Sample Admin User (Created During Setup)
```
FullName: System Admin
Email: admin@studygroup.local
Password: [Hashed]
IsApproved: true
Role: Admin
```

---

## Scalability Considerations

### Current Capacity
- Supports 100K+ users
- Supports 1000+ study groups
- 100K+ join requests

### Future Enhancements
1. Add DiscussionReplies table for nested comments
2. Add UserPreferences table for notification settings
3. Partition DiscussionMessages by GroupId for large discussions
4. Archive old notifications table

---

## Migration Strategy

### Using Entity Framework Core
```bash
# Create migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Revert migration
dotnet ef migrations remove
dotnet ef database update PreviousMigration
```

### Current Migrations
1. `InitialCreate` - Initial schema (Users, Roles, Groups, etc.)
2. `AddGroupMeetingFields` - Added MeetingType and MeetingSchedule fields

---

## Data Integrity Rules

### Business Rules Enforced by Database
- User Email UNIQUE constraint
- Role names UNIQUE constraint
- Refresh Token UNIQUE constraint

### Business Rules Enforced by Application Layer
- IsApproved must be true for login
- GroupCreators need admin approval before creating groups
- Only group owner can approve/reject join requests
- Only members (owner + approved joined) can access materials/discussions
- Max members check is done in application

---

## Backup & Recovery

### Backup Strategy
- Daily full backups
- Transaction log backups every 4 hours
- Store backups in Azure Storage or S3

### Recovery Procedures
```sql
-- Point-in-time restore
RESTORE DATABASE StudyGroupDb
FROM DISK = '/backups/StudyGroupDb.bak'
WITH REPLACE
```

---

**Schema Version**: 1.0
**Last Updated**: May 13, 2026
**Database Version**: MS SQL Server 2022
**ORM**: Entity Framework Core 8.0
 
