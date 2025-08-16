#  PANTOhealth IoT Data Management System

##  Overview
This project is an **IoT Data Management System** for x-ray devices, built with **NestJS**, **MongoDB**, and **RabbitMQ**.  
It is designed to:
1. Receive data from IoT devices through **RabbitMQ**
2. Process and analyze the incoming x-ray data
3. Store the processed information in **MongoDB**
4. Expose RESTful **API endpoints** for data retrieval and management

---

##  Features
-  **RabbitMQ Integration**: Consumer for IoT device x-ray data  
-  **Data Processing**: Extracts and calculates key parameters (data length, data volume, stats, etc.)  
-  **MongoDB Storage**: Stores processed data in `signals` collection  
-  **API Endpoints**:
  - CRUD operations for signals
  - Filtering and retrieval endpoints
  - Health check endpoints (`/health/live` and `/health/ready`)
-  **Dockerized**: Entire project runs via `docker-compose` (API, Producer, MongoDB, RabbitMQ)

---

##  Project Structure
```
PANTOhealth-IoT-clean/
├── api/               # NestJS API (consumer + endpoints)
│   ├── src/
│   │   ├── rabbitmq/  # RabbitMQ module & consumer
│   │   ├── signals/   # Signals module, schema & service
│   │   ├── health/    # Health check module
│   │   └── main.ts
│   └── Dockerfile
├── producer/          # NestJS producer (sends test x-ray data)
│   └── Dockerfile
├── docker-compose.yml
├── .env
└── README.md
```

---

##  Getting Started

### 1️ Clone repository
```bash
git clone https://github.com/<your-username>/PANTOhealth-IoT-clean.git
cd PANTOhealth-IoT-clean
```

### 2️ Environment setup
Create a `.env` file with:
```env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/pantohealth
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
RABBITMQ_XRAY_QUEUE=xray
```

### 3️ Run with Docker
```bash
docker compose build
docker compose up -d
```

### 4️ Check logs
```bash
docker compose logs -f api
docker compose logs -f producer
```

---

##  API Endpoints

###  Health Check
- `GET /health/live` → service liveness  
- `GET /health/ready` → readiness probe  

###  Signals CRUD
- `GET /signals` → List all signals  
- `POST /signals` → Create a new signal  
- `GET /signals/:id` → Get single signal  
- `PATCH /signals/:id` → Update signal  
- `DELETE /signals/:id` → Delete signal  

---

##  Testing Producer
The producer simulates IoT devices by publishing sample data to RabbitMQ.  
To verify data flow:

```bash
curl http://localhost:3000/signals
```

Expected output:
```json
{
  "total": 1,
  "items": [
    {
      "_id": "68a05f3ca9f0e53f612c4408",
      "deviceId": "66bb584d4ae73e488c30a072",
      "time": 1735683480000,
      "dataLength": 563,
      "dataVolume": 72488,
      "stats": { "speed": { "min": 0.04, "max": 4.21, "avg": 2.12 } }
    }
  ]
}
```

---

##  Swagger Documentation
Available at:
```
http://localhost:3000/docs
```

---
## RabbitMQ Management

This project includes a RabbitMQ service with the **management plugin** enabled.  
You can access the management UI at:

http://localhost:15672/


Default Credentials :
- **Username:** guest  
- **Password:** guest  

### Features Available in UI
- Monitor message queues (e.g., `xray` queue).  
- Inspect producers and consumers.  
- Send or consume messages manually for testing.  
- Check system health, connections, and channels.  


##  Development (Optional)
Run API without Docker:
```bash
cd api
npm install
npm run start:dev
```

---

##  Notes
- Designed for testing and assessment purposes.
- Authentication and advanced validations are not included in this version.

---

##  Author
Developed by **Ali Asadi** as part of **PANTOhealth Backend Developer Technical Assessment**.
