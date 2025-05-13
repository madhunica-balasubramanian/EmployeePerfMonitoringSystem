# Federal Employee Performance Monitoring System with Wellness Indicators

## Overview

This project creates a comprehensive performance evaluation system for federal employees, integrating wellness indicators with tailored performance metrics. Designed specifically for the US Department of Health and Human Services and US Department of Postal Services, this system provides a holistic approach to employee evaluation.

## Purpose & Motivation

Federal employees are the backbone of the United States government, representing crucial human capital essential to our nation's functioning. These professionals ensure continuity across diverse sectors of American life - from providing care to veterans and coordinating disaster responses to maintaining national safety.

Despite their importance, many federal workers face challenges including potential termination based on claims of redundancy. This project addresses the lack of appropriate performance evaluation by:

- Integrating wellness indicators with custom performance metrics
- Creating a holistic portrait of employee value and circumstances
- Providing empirical evidence of performance context
- Identifying when external factors or workplace conditions impact performance

## Technology Stack

### Backend
- Python FastAPI framework
- PostgreSQL database
- AWS EC2 for cloud deployment

### Frontend
- React 19
- Next.js 15
- TypeScript
- Tailwind CSS

## Project Structure

The project follows a feature branch workflow:
- Feature branches are created from the development branch
- Only complete, end-to-end working functionality is merged to the development branch
- The system includes basic user login (employee or supervisor roles) with respective dashboards

## Installation & Setup

### Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate

# Set environment variables
export SECRET_KEY="<<any-key>>"

# Run the application
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend-perf-wellness-sys/

# If encountering issues during installation
npm cache clean --force
rm package-lock.json
rm -rf node_modules

# Ensure Node.js version 20+ is installed

# Install additional dependencies if needed
npm install --save-dev typescript @types/react @types/node
npm install @radix-ui/react-slot
npm install clsx

# Install and run
npm install
npm run dev
```

## Frontend Dependencies

```
frontend@0.1.0
├── @types/node@20.17.38
├── @types/react-dom@19.1.3
├── @types/react@19.1.2
├── autoprefixer@10.4.21
├── axios@1.9.0
├── clsx@2.1.1
├── date-fns@4.1.0
├── lucide-react@0.507.0
├── next-themes@0.4.6
├── next@15.3.1
├── postcss@8.5.3
├── react-dom@19.1.0
├── react@19.1.0
├── tailwind-merge@3.2.0
├── tailwindcss-animate@1.0.7
├── tailwindcss@3.4.3
└── typescript@5.8.3
```

## System Features

The system implements specialized metrics for different federal departments:

### Postal Workers (USPS)
**Performance Metrics:**
- Mail/package delivery on-time rate
- Customer complaints or praise
- Delivery accuracy

**Wellness Metrics:**
- Daily physical activity (steps/miles walked)
- Injury reports or risk level
- Weather exposure logs

### Healthcare Workers (VA hospitals, CDC staff)
**Performance Metrics:**
- Number of patients attended
- Patient satisfaction score
- Timeliness of reporting and response

**Wellness Metrics:**
- Burnout risk (based on hours worked, breaks taken)
- Self-assessment surveys
- Sleep & stress tracking (manual input or wearables integration)

## Documentation

For detailed design specifications, unit test cases, and code flow, please refer to the [project guide](https://docs.google.com/document/d/e/2PACX-1vRegqZOl3i0YTdlZSqvOnCUrabUzu6uWfJ6G-TUSGkxZGvjuMyFjvSWoI4mltDJZMpx4qEXxivOGlK5/pub).

## Notes

- Do not modify package.json
- Ensure all package versions match those specified
- The current implementation is department-agnostic and can be extended to accommodate more federal departments
