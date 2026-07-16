# Groups

Groups facilitate multi-recipient internal communications on specific projects or departments.

## Member Restrictions
- **Creator Rules**: Only `OWNER`, `ADMIN`, and `SUPERVISOR` roles have the capability to create groups. Employees are restricted to viewing and replying within groups they are added to.
- **Group Metadata**:
  - `name`: Identifies the group's objective.
  - `description`: Scope of group messaging.
  - `createdBy`: Username tracking of the creator.
  - `memberUsernames`: JSON array listing members.

## Feature Exclusions
To maintain strict focus:
- No file sharing (architecture path prepared inside schema)
- No emojis, gifs, voice notes, reactions, or seen receipts.
