<div align="center">
  <h3 align="center">Campus-Connect UNIPMA</h3>

  <p align="center">
    A centralized organization and event management platform for Universitas PGRI Madiun.
    <br />
    <a href="https://github.com/Kanzacky/Campus-Connect-UNIPMA"><strong>Explore the repository »</strong></a>
    <br />
    <br />
    <a href="#features">View Features</a>
    ·
    <a href="#getting-started">Getting Started</a>
    ·
    <a href="#project-structure">Project Structure</a>
  </p>
</div>

<!-- BADGES -->
<div align="center">
  <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#architecture">Architecture</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

**Campus-Connect UNIPMA** is a comprehensive campus management ecosystem designed specifically for Universitas PGRI Madiun (UNIPMA). The platform digitalizes the workflow of Student Organizations (Ormawa), Student Activity Units (UKM), and the Student Executive Board (BEM), bridging the communication gap between the campus administration, organization leaders, and the student body.

### Architecture

The project has recently been migrated to a **Headless Architecture**:
* **Backend (API):** A robust RESTful API built with Laravel, utilizing Laravel Sanctum for secure, stateless token-based authentication.
* **Frontend (Client):** A highly performant, SEO-friendly Next.js application taking advantage of modern React paradigms and a premium minimalist design language.

### Built With

* [![Laravel][Laravel.com]][Laravel-url]
* [![Next.js][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![TailwindCSS][TailwindCSS]][Tailwind-url]

## Features

The application is built around a secure Role-Based Access Control (RBAC) system ensuring data integrity and proper authorization boundaries:

* **👑 Administrator (University Staff / Admin):**
  * Global user and organization management.
  * Approval workflows for student organizations and events.
  * Broadcasting university-wide announcements.

* **👔 Organization Board (UKM / Ormawa Leaders):**
  * Manage member registrations (Approve/Reject workflows).
  * Publish internal announcements for organization members.
  * Event management, including scheduling and participant tracking.

* **🎓 Members (Students):**
  * Explore and enroll in various student organizations.
  * Stay updated with personalized announcements.
  * Participate in and register for campus events.

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

* PHP >= 8.2
* Composer
* Node.js >= 18.x
* npm, yarn, or pnpm

### Installation

Since the project uses a decoupled architecture, you need to set up the backend and frontend in separate processes.

1. **Clone the repository**
   ```sh
   git clone https://github.com/Kanzacky/Campus-Connect-UNIPMA.git
   cd Campus-Connect-UNIPMA
   ```

2. **Backend Setup (Laravel API)**
   ```sh
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate --seed
   php artisan serve
   ```
   *The API will be available at `http://localhost:8000`*

3. **Frontend Setup (Next.js)**
   Open a new terminal window:
   ```sh
   cd frontend
   npm install
   # Ensure your .env file has the correct API URL
   # e.g., NEXT_PUBLIC_API_URL=http://localhost:8000
   npm run dev
   ```
   *The client application will be available at `http://localhost:3000`*

## Project Structure

```text
Campus-Connect-UNIPMA/
├── backend/                # Laravel API source code
│   ├── app/                # Controllers, Models, Middleware
│   ├── routes/             # API routes (api.php)
│   └── tests/              # Pest PHP test suites
└── frontend/               # Next.js web application
    ├── src/
    │   ├── app/            # Next.js App Router (Pages & Layouts)
    │   ├── components/     # Reusable React components
    │   └── lib/            # Utilities and API clients
    └── public/             # Static assets
```

## Testing

The backend is fully tested using **Pest PHP**. To run the test suite:

```sh
cd backend
php artisan test
```

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<!-- MARKDOWN LINKS & IMAGES -->
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TailwindCSS]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
