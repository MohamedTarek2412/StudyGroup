-- StudyGroup Database Initialization and Seed Data
-- This script runs after migrations to populate initial data

USE StudyGroupDb;
GO

-- ============================================================
-- 1. INSERT ROLES (if not already present from migration)
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM Roles WHERE Name = 'Admin')
BEGIN
    INSERT INTO Roles (Name) VALUES 
        ('Admin'),
        ('GroupCreator'),
        ('Student');
    PRINT 'Roles inserted successfully.';
END
ELSE
BEGIN
    PRINT 'Roles already exist.';
END
GO

-- ============================================================
-- 2. INSERT TEST USERS
-- ============================================================

-- Note: Passwords are hashed using bcrypt
-- Admin: admin@studygroup.local / Admin@123
-- Creator: creator@studygroup.local / Creator@123
-- Student1: student1@studygroup.local / Student@123
-- Student2: student2@studygroup.local / Student@123

IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'admin@studygroup.local')
BEGIN
    INSERT INTO Users (Id, FullName, Email, PasswordHash, IsApproved, CreatedAt)
    VALUES 
        ('11111111-1111-1111-1111-111111111111', 'System Admin', 'admin@studygroup.local', '$2a$11$encrypted_hash_for_Admin@123_here', 1, GETUTCDATE());
    PRINT 'Admin user inserted.';
END
GO

IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'creator@studygroup.local')
BEGIN
    INSERT INTO Users (Id, FullName, Email, PasswordHash, IsApproved, CreatedAt)
    VALUES 
        ('22222222-2222-2222-2222-222222222222', 'John Creator', 'creator@studygroup.local', '$2a$11$encrypted_hash_for_Creator@123_here', 1, GETUTCDATE());
    PRINT 'Creator user inserted.';
END
GO

IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'student1@studygroup.local')
BEGIN
    INSERT INTO Users (Id, FullName, Email, PasswordHash, IsApproved, CreatedAt)
    VALUES 
        ('33333333-3333-3333-3333-333333333333', 'Ahmed Student', 'student1@studygroup.local', '$2a$11$encrypted_hash_for_Student@123_here', 1, GETUTCDATE());
    PRINT 'Student1 user inserted.';
END
GO

IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'student2@studygroup.local')
BEGIN
    INSERT INTO Users (Id, FullName, Email, PasswordHash, IsApproved, CreatedAt)
    VALUES 
        ('44444444-4444-4444-4444-444444444444', 'Fatima Student', 'student2@studygroup.local', '$2a$11$encrypted_hash_for_Student@123_here', 1, GETUTCDATE());
    PRINT 'Student2 user inserted.';
END
GO

-- ============================================================
-- 3. ASSIGN ROLES TO USERS
-- ============================================================

-- Admin role to Admin user
IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UserId = '11111111-1111-1111-1111-111111111111' AND RoleId = 1)
BEGIN
    INSERT INTO UserRoles (UserId, RoleId)
    VALUES ('11111111-1111-1111-1111-111111111111', 1);
    PRINT 'Admin role assigned to admin user.';
END
GO

-- GroupCreator role to Creator user
IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UserId = '22222222-2222-2222-2222-222222222222' AND RoleId = 2)
BEGIN
    INSERT INTO UserRoles (UserId, RoleId)
    VALUES ('22222222-2222-2222-2222-222222222222', 2);
    PRINT 'GroupCreator role assigned to creator user.';
END
GO

-- Student role to Student1 and Student2
IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UserId = '33333333-3333-3333-3333-333333333333' AND RoleId = 3)
BEGIN
    INSERT INTO UserRoles (UserId, RoleId)
    VALUES 
        ('33333333-3333-3333-3333-333333333333', 3),
        ('44444444-4444-4444-4444-444444444444', 3);
    PRINT 'Student roles assigned to student users.';
END
GO

-- ============================================================
-- 4. INSERT SAMPLE STUDY GROUPS (Created by the creator user)
-- ============================================================

IF NOT EXISTS (SELECT 1 FROM Groups WHERE Name = 'Mathematics Study Group')
BEGIN
    INSERT INTO Groups (Id, Name, Description, Subject, Location, MeetingType, MeetingSchedule, MaxMembers, IsApproved, CreatedAt, OwnerId)
    VALUES 
        ('55555555-5555-5555-5555-555555555555', 
         'Mathematics Study Group', 
         'A comprehensive study group focusing on Calculus, Linear Algebra, and Discrete Mathematics for engineering students.',
         'Mathematics',
         'Building A, Room 301 / Online via Zoom',
         'Hybrid',
         'Tuesday and Thursday, 3:00 PM - 5:00 PM',
         25,
         1,
         GETUTCDATE(),
         '22222222-2222-2222-2222-222222222222');
    PRINT 'Mathematics Study Group inserted.';
END
GO

IF NOT EXISTS (SELECT 1 FROM Groups WHERE Name = 'Physics Lab Discussion')
BEGIN
    INSERT INTO Groups (Id, Name, Description, Subject, Location, MeetingType, MeetingSchedule, MaxMembers, IsApproved, CreatedAt, OwnerId)
    VALUES 
        ('66666666-6666-6666-6666-666666666666',
         'Physics Lab Discussion',
         'Group for discussing laboratory experiments, theory concepts, and problem-solving in Physics.',
         'Physics',
         'Science Building, Lab 5',
         'Offline',
         'Monday, Wednesday, Friday - 2:00 PM - 3:30 PM',
         20,
         1,
         GETUTCDATE(),
         '22222222-2222-2222-2222-222222222222');
    PRINT 'Physics Lab Discussion inserted.';
END
GO

-- ============================================================
-- 5. INSERT SAMPLE JOIN REQUESTS (Students joining groups)
-- ============================================================

IF NOT EXISTS (SELECT 1 FROM JoinRequests WHERE UserId = '33333333-3333-3333-3333-333333333333' AND GroupId = '55555555-5555-5555-5555-555555555555')
BEGIN
    INSERT INTO JoinRequests (Id, UserId, GroupId, Status, CreatedAt)
    VALUES 
        ('77777777-7777-7777-7777-777777777777',
         '33333333-3333-3333-3333-333333333333',
         '55555555-5555-5555-5555-555555555555',
         'Approved',
         GETUTCDATE());
    PRINT 'Student1 join request for Math group inserted (Approved).';
END
GO

IF NOT EXISTS (SELECT 1 FROM JoinRequests WHERE UserId = '44444444-4444-4444-4444-444444444444' AND GroupId = '66666666-6666-6666-6666-666666666666')
BEGIN
    INSERT INTO JoinRequests (Id, UserId, GroupId, Status, CreatedAt)
    VALUES 
        ('88888888-8888-8888-8888-888888888888',
         '44444444-4444-4444-4444-444444444444',
         '66666666-6666-6666-6666-666666666666',
         'Pending',
         GETUTCDATE());
    PRINT 'Student2 join request for Physics group inserted (Pending).';
END
GO

-- ============================================================
-- 6. INSERT SAMPLE MATERIALS
-- ============================================================

IF NOT EXISTS (SELECT 1 FROM Materials WHERE FileName = 'Calculus_Chapter_1.pdf')
BEGIN
    INSERT INTO Materials (Id, FileName, FilePath, FileSizeBytes, UploadedAt, GroupId, UploadedById)
    VALUES 
        ('99999999-9999-9999-9999-999999999999',
         'Calculus_Chapter_1.pdf',
         '/app/uploads/Materials/55555555-5555-5555-5555-555555555555/calculus_chapter_1.pdf',
         2048576,
         GETUTCDATE(),
         '55555555-5555-5555-5555-555555555555',
         '33333333-3333-3333-3333-333333333333');
    PRINT 'Sample material inserted.';
END
GO

-- ============================================================
-- 7. INSERT SAMPLE DISCUSSION MESSAGES
-- ============================================================

IF NOT EXISTS (SELECT 1 FROM DiscussionMessages WHERE SenderId = '33333333-3333-3333-3333-333333333333' AND GroupId = '55555555-5555-5555-5555-555555555555')
BEGIN
    INSERT INTO DiscussionMessages (Id, Content, SentAt, GroupId, SenderId)
    VALUES 
        ('AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA',
         'Hi everyone! Looking forward to studying together. I''ve uploaded my notes on Chapter 1.',
         GETUTCDATE(),
         '55555555-5555-5555-5555-555555555555',
         '33333333-3333-3333-3333-333333333333');
    PRINT 'Sample discussion message inserted.';
END
GO

-- ============================================================
-- 8. INSERT SAMPLE NOTIFICATIONS
-- ============================================================

IF NOT EXISTS (SELECT 1 FROM Notifications WHERE UserId = '33333333-3333-3333-3333-333333333333')
BEGIN
    INSERT INTO Notifications (Id, Message, IsRead, CreatedAt, UserId)
    VALUES 
        ('BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB',
         'Welcome to StudyGroup! Your registration has been approved.',
         0,
         GETUTCDATE(),
         '33333333-3333-3333-3333-333333333333');
    PRINT 'Sample notification inserted.';
END
GO

-- ============================================================
-- 9. DISPLAY SUMMARY
-- ============================================================

SELECT 'Data Seeding Summary' AS 'Operation';
GO

SELECT COUNT(*) AS 'Total Users' FROM Users;
SELECT COUNT(*) AS 'Total Roles' FROM Roles;
SELECT COUNT(*) AS 'Total Groups' FROM Groups;
SELECT COUNT(*) AS 'Total Join Requests' FROM JoinRequests;
SELECT COUNT(*) AS 'Total Materials' FROM Materials;
SELECT COUNT(*) AS 'Total Discussion Messages' FROM DiscussionMessages;
SELECT COUNT(*) AS 'Total Notifications' FROM Notifications;

GO

PRINT '========== Seed Data Initialization Complete ==========';
PRINT 'Test Credentials:';
PRINT '  Admin: admin@studygroup.local / Admin@123';
PRINT '  Creator: creator@studygroup.local / Creator@123';
PRINT '  Student1: student1@studygroup.local / Student@123';
PRINT '  Student2: student2@studygroup.local / Student@123';
PRINT '===================================================';

GO
 
