# Conference Website - Frontend

This repository contains the **frontend application** of the offline conference website.  
The project is built with **Vue 3** and provides a modern single-page application (SPA) interface.

The related backend API is implemented in **Laravel 10** and can be found here:  
[events_api](https://github.com/tkdesign/events_api)

---

## Overview

This application is a part of complete web solution for managing and presenting the annual conference.  
The website provides:

- General information about the conference
- Promotional banners for upcoming events
- Featured participant reviews
- Photo galleries
- Logos and information about sponsors
- Photos and bios of curators
- Map and contacts
- Speaker information and profiles
- Full conference schedule (locations → days → time slots → lectures)
- Informational articles

---

## User Roles and Features

The site works in **three modes**, depending on the user role:

### Guest
- Access to public sections: Home, Speakers, Schedule, Sponsors, Gallery, Contacts
- Can view information and schedule
- Cannot register for lectures without authentication

### Participant
- All guest features
- Can create an account, log in, and register for lectures
- Access to the **Account** section

### Administrator
- All participant features
- Access to the **Admin** section (CMS-like interface)
- Can edit any site content
- Full content management:
    - Users, sponsors, curators, speakers
    - Conferences, schedules, locations (stages), time slots, lectures
    - Assigning speakers to lectures and sponsors to conferences
    - Creating and editing articles via a WYSIWYG editor (TinyMCE), banners, reviews, galleries, and menus
    - Loading images

---

## Technical Stack

- **Framework:** Vue 3 (Options API)
- **Language:** JavaScript (ES6+)
- **UI Library:** Vuetify 3
- **State Management:** Pinia (multiple stores)
- **Routing:** Vue Router (SPA)
- **HTTP Client:** Axios (JSON-based API requests)
- **Authentication:** Login/password via API (Laravel Fortify on backend)
    - Sessions stored in browser cookies
    - User data persisted in Pinia stores
- **User Roles:**
    - Guest (unauthenticated)
    - Participant (1 - authenticated user)
    - Administrator (2 - extended CMS rights)

---

## Environment Configuration

1. Copy the example environment file to `.env` in the project root:

```bash
cp .env.example .env
```

2. Edit the `.env` file according to your domain setup.

### Frontend (`events_front`)
Set the API base URL and TinyMCE editor API key:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_TINYMCE_API_KEY=your_tinymce_api_key
```

> To get a TinyMCE API key, register at [https://www.tiny.cloud](https://www.tiny.cloud) and generate a free or paid API key.

### Backend (`events_api`)
Configure the following parameters in `.env`:

```env
APP_URL=https://api.example.com
CORS_ALLOWED_ORIGINS=https://frontend.example.com
SANCTUM_STATEFUL_DOMAINS=frontend.example.com
SESSION_DOMAIN=.example.com
```

The frontend and backend can run on **different domains**, but proper CORS and cookie/session configuration is required.

---

## Content Structure

- **Conferences** are stored as schedules (one per year)
- **Schedules** contain:
    - Locations (stages)
    - Days of the week
    - Time slots
    - Lectures
- **Lectures** are linked to speakers
- **Sponsors** and **curators** are linked to conferences
- **Galleries** with images are available as separate collections
- **Articles** are editable in the admin panel with TinyMCE
- **Banners** and **reviews** can be managed by administrators and displayed on the homepage

---

## Project Setup

Clone the repository:

```bash
git clone https://github.com/tkdesign/events_front.git
cd events_front
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

## Related Repository

- **Backend API (Laravel 10):** [events_api](https://github.com/tkdesign/events_api)

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Authors: Petr Kovalenko, Andrei Parfirev