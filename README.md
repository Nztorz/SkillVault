# [SkillVault]

## Database Schema Design

![db-schema]

## API Documentation

- Base URL ![base-url] http://localhost:5000/api

| Method | Endpoint          | Description         | Auth Required |
|--------|-------------------|---------------------|---------------|
|**POST**|*/users/register*  | Register a new user |❌ No         |
|**POST**|*/users/login*     | Log in and receive JWT token |❌ No|
|**GET** |*/entries*         | Get all user entries|✅ Yes        |
|**POST**|*/entries*         | Create a new entry  |✅ Yes        |
|**PUT** |*/entries/:id*     | Update an entry by id|✅ Yes       |
|**Delete**|*/entries/:id*   | Delete an entry by Id|✅ Yes       |









[db-schema]: ./images/Database%20Schema%20Design.png
[base-url]: http://localhost:5000/api