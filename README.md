# Employee Development Matrix Dashboard

A comprehensive web application for tracking employee training progress and skill development across an organization. Built with React, FastAPI, and SQLite, containerized with Docker.

## Features

- **Interactive Matrix UI**: Visual grid showing employee progress across training modules
- **Role-based Access**: Admin, Manager, and Employee views with different permissions
- **Analytics Dashboard**: Skill distribution charts and competency heatmaps
- **CSV Import/Export**: Bulk data management capabilities
- **Customizable Settings**: Configurable levels, colors, and preferences
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: Keyboard navigation and screen reader support

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Running the Application

1. Clone the repository:
```bash
git clone <repository-url>
cd employee-development-matrix
```

2. Start the application:
```bash
docker-compose up --build
```

3. Access the application at: http://localhost:8010

The application will automatically seed with sample data including 12 employees and 5 training modules.

## Project Structure

```
employee-development-matrix/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core configuration
│   │   ├── db/             # Database models and migrations
│   │   ├── services/       # Business logic
│   │   └── main.py         # FastAPI application
│   ├── tests/              # Backend tests
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend Docker configuration
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   ├── package.json        # Node dependencies
│   └── Dockerfile          # Frontend Docker configuration
├── docker-compose.yml      # Docker orchestration
├── nginx.conf              # Nginx reverse proxy config
└── README.md               # This file
```

## API Endpoints

### Employees
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### Training Columns
- `GET /api/columns` - List all training columns
- `POST /api/columns` - Create new training column
- `PUT /api/columns/{id}` - Update training column
- `DELETE /api/columns/{id}` - Delete training column

### Scores
- `GET /api/scores` - Get all scores
- `POST /api/scores` - Create/update score
- `GET /api/matrix` - Get complete matrix data

### Settings
- `GET /api/settings` - Get application settings
- `PUT /api/settings` - Update settings

## CSV Import/Export

### Employee CSV Format
```csv
name,role,department,avatar
John Doe,Software Engineer,Engineering,https://example.com/avatar.jpg
Jane Smith,Product Manager,Product,
```

### Training Scores CSV Format
```csv
employee_id,column_id,level,notes,updated_by
1,c1,2,Completed course,admin
1,c2,1,In progress,manager
```

## Customization

### Adding New Training Levels
1. Access Admin Settings panel
2. Navigate to "Training Levels" section
3. Add new levels with custom labels and colors
4. Save settings to update across the application

### Changing Color Schemes
1. Go to Settings panel
2. Select "Appearance" tab
3. Choose from predefined themes or create custom colors
4. Changes apply immediately

### Database Migration
To switch from SQLite to PostgreSQL:

1. Update `backend/app/core/database.py`:
```python
DATABASE_URL = "postgresql://user:password@localhost/dbname"
```

2. Update `docker-compose.yml` to include PostgreSQL service
3. Run migrations: `docker-compose exec backend alembic upgrade head`

## Development

### Running Locally (without Docker)

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Running Tests

#### Backend Tests
```bash
cd backend
pytest
```

#### Frontend Tests
```bash
cd frontend
npm test
```

## Acceptance Tests

After running `docker-compose up --build`:

1. **Dashboard Access**: Visit http://localhost:8010/ should return the main dashboard (200 OK)

2. **Matrix Data**: 
```bash
curl http://localhost:8010/api/matrix
```
Should return JSON with seeded employee and training data.

3. **Create Employee**:
```bash
curl -X POST http://localhost:8010/api/employees \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","role":"Developer","department":"Engineering"}'
```

4. **Create Training Column**:
```bash
curl -X POST http://localhost:8010/api/columns \
  -H "Content-Type: application/json" \
  -d '{"title":"New Training","category":"Technical","targetLevel":2}'
```

## Troubleshooting

### Port Already in Use
If port 8010 is already in use, update the port in `docker-compose.yml`:
```yaml
ports:
  - "8011:8010"  # Change 8011 to your preferred port
```

### Database Issues
To reset the database:
```bash
docker-compose down -v
docker-compose up --build
```

### Frontend Build Issues
Clear node modules and rebuild:
```bash
docker-compose down
docker-compose build --no-cache frontend
docker-compose up
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details
