Federal Employee Performance Monitoring System with Wellness Indicators
Purpose and Motivation behind this project

Federal employees serve as the backbone of the United States government, representing crucial human capital essential to our nation's functioning. These dedicated professionals ensure continuity across diverse and vital sectors of American life. From providing compassionate care to our veterans and coordinating rapid response during natural disasters to maintaining our safety, these critical government functions garner broad bipartisan support. Yet despite their universal importance, each of these essential services are facing significant challenges and disruptions in recent years as they are being laid off under the grounds of redundancies and unnecessary functions.
In a simple effort to address the lack of appropriate performance evaluation for federal workers which can very well serve as backing evidence for them to contest unjust terminations, this project integrates comprehensive wellness indicators with tailormade performance metrics for the US Department of health and home services && US Department of homeland security. By documenting both productivity contributions and wellness challenges faced by federal employees this system creates a more holistic portrait of employee value and circumstances. This dual-faceted approach provides federal workers a substantive documentation offering empirical evidence of their overall performance context and potentially revealing when external factors or workplace conditions may have impacted their performance outcomes.

Technologies Used

Backend – Python fastAPI framework 

FrontEnd – tailWind CSS, TypeScript , React 

DB – PostGRESQL 

Cloud – AWS EC2

Monitoring – Grafana

Repository - gitHub
https://github.com/madhunica-balasubramanian/EmployeePerfMonitoringSystem/tree/development Links to an external site.

Feature branches will be created from the development branch and complete end-end working functionality will only be moved to development branch.
This contains basic user login (user - employee, supervisor or admin) Each can view their respective dashboards.
https://github.com/madhunica-balasubramanian/EmployeePerfMonitoringSystem/tree/InitialSetupFE-BE Links to an external site.

Running your Backend

python -m venv venv
source venv/bin/activate
export SECRET_KEY=””
uvicorn app.main:app --reload
run main.py

Running your frontend

cd frontend/
npm install 
npm run dev 
Note:: Dont modify package.json

If you run into any dependencies, follow these steps
rm package-lock.json , rm -rf node_modules 
npm cache clean --force
npm install
npm run dev

npm list

frontend@0.1.0 /<< >>/PROJECT/EmployeePerfMonitoringSystem/frontend-perf-wellness-sys
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


Detailed Description and UseCases

In our web application, we will be incorporating employee’s wellness indicators and customized performance metrics specifically for the Department of health , Postal Services and transportation.  The system also aims to provide customizable dashboards ensuring an ethical implementation and aims to foster a healthier and more productive federal workforce that better serves the public interest. This aims to provide the agencies or supervisors with comprehensive insights to support data-driven decisions that enhance both federal employee’s success and agency effectiveness.  The roles taken into account for this project is department agnostic and this can be improvised in the future to accommodate more federal departments.

Roles and Department details considered 

**Postal Workers (USPS)**
 **Performance Metrics**
-Mail/package delivery on-time rate
-Customer complaints or praise
-Delivery accuracy
 **Wellness Metrics**
Daily physical activity (steps/miles walked)
Injury reports or risk level
Weather exposure logs


**Healthcare (e.g., VA hospitals, CDC staff)**
 **Performance Metrics**
Number of patients attended
Patient satisfaction score
Timeliness of reporting and response
 **Wellness Metrics**
Burnout risk (based on hours worked, breaks taken)
Self-assessment surveys
Sleep & stress tracking (manual input or wearables integration)


https://docs.google.com/document/d/e/2PACX-1vRegqZOl3i0YTdlZSqvOnCUrabUzu6uWfJ6G-TUSGkxZGvjuMyFjvSWoI4mltDJZMpx4qEXxivOGlK5/pub  

Please refer this project guide for the design, unit test cases and code flow : 
https://docs.google.com/document/d/e/2PACX-1vRegqZOl3i0YTdlZSqvOnCUrabUzu6uWfJ6G-TUSGkxZGvjuMyFjvSWoI4mltDJZMpx4qEXxivOGlK5/pub Links to an external site. 
