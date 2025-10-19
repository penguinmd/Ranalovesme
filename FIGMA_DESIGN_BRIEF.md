# RanaLovesMe - Design Brief for Figma AI

## Project Overview

**Project Name:** RanaLovesMe

**Type:** Personal Relationship Memory Tracker & Digital Diary

**Purpose:** A private web application for a couple (Rana and Mark) to document, remember, and celebrate their time together by tracking special days, memories, photos, places visited, and shared experiences.

**Target Users:** 2 specific users (Rana and Mark) - intimate, personal use only

**Tone & Feel:** Romantic, warm, personal, sentimental, nostalgic, clean, modern

## Core Concept

This is a **shared digital memory book** where a couple can:
- Document special days together (dates, events, milestones)
- Upload and organize photos from their experiences
- Track places they've visited together
- Remember music and activities they've shared
- Create a timeline of their relationship

Think: A beautiful, private Instagram meets a romantic journal meets a couple's timeline.

## User Accounts

**Fixed Users:**
- **Rana** - One half of the couple
- **Mark** - Other half of the couple

**Authentication:**
- Simple username/password login
- No registration - accounts are pre-created
- JWT token-based session management
- Either user can add/edit any content (full trust model)

## Data Models & What Needs to be Displayed

### 1. Days Together (Primary Content Type)

**Fields:**
- `date` - The specific date (e.g., "January 15, 2025")
- `title` - Optional title for the day (e.g., "First Date", "Anniversary Dinner")
- `description` - Free-form text describing what happened, how they felt, etc.
- `photos[]` - Multiple photos can be attached to a day
- `created_by` - Which user created the entry (Rana or Mark)
- `created_at` / `updated_at` - Timestamps

**Note:** Rating and mood fields exist in the database but have been **removed from the UI** in the current version. Don't include these in the new design.

### 2. Photos

**Fields:**
- `filename` - The photo URL (Vercel Blob storage)
- `original_name` - Original filename
- `caption` - Optional text caption
- `location` - Where the photo was taken
- `taken_date` - When the photo was taken
- `uploaded_by` - Who uploaded it

**Relationships:**
- Photos can be attached to specific days
- Photos can be attached to specific places
- Photos can exist independently in a general gallery

### 3. Places

**Fields:**
- `name` - Name of the place
- `location` - Address or description
- `visit_date` - When they visited
- `description` - What they did there, memories
- `latitude` / `longitude` - GPS coordinates for mapping
- `photos[]` - Photos from this place

### 4. Music

**Fields:**
- `title` - Song name
- `artist` - Artist name
- `album` - Album name
- `significance` - Why this song is special
- `date_added` - When added to their collection

### 5. Activities

**Fields:**
- `name` - Activity name (e.g., "Hiking", "Cooking together", "Movie night")
- `description` - Details about the activity
- `frequency` - How often they do this
- `last_done` - Last time they did this activity

## Current UI Structure (React Frontend)

### Pages/Views:

1. **Login Page**
   - Username field
   - Password field
   - Login button
   - Simple, clean authentication

2. **Calendar/Timeline View** (Main Dashboard)
   - Calendar interface showing all documented days
   - Click on a date to view/create entry
   - Visual indicators for which dates have entries
   - Should feel like browsing through time

3. **Day Detail View**
   - Full view of a specific day's entry
   - Shows: date, title, description, all attached photos
   - Edit and delete options
   - Photo upload capability
   - Navigation to previous/next days with entries

4. **Photos Gallery** (Future/Planned)
   - Grid view of all photos
   - Filter by date, place, or person
   - Click to view full-size with details
   - Organize into albums

5. **Places View** (Future/Planned)
   - List or map view of places visited
   - Click on a place to see details and photos
   - Add new places

6. **Music & Activities** (Future/Planned)
   - Lists of songs and activities
   - Add, edit, view

## Current Technical Stack

**Frontend:**
- React 19 with TypeScript
- Vite for build tooling
- React Router for navigation
- React Calendar library for calendar UI
- Tailwind CSS for styling
- React Query for data fetching
- Axios for API calls

**Backend:**
- Vercel Serverless Functions (API)
- PostgreSQL database (Vercel Postgres)
- JWT authentication
- Vercel Blob for photo storage

**Deployment:**
- Fully hosted on Vercel
- Single-page application (SPA)

## Key User Flows

### Flow 1: Viewing Memories
1. User logs in with username/password
2. Sees calendar/timeline of documented days
3. Clicks on a date that has an entry
4. Views the full day entry with photos and text
5. Can navigate to other days

### Flow 2: Creating a Memory
1. User is on the calendar view
2. Clicks on a date (with or without existing entry)
3. If no entry exists, sees "Create new entry" form
4. Fills in:
   - Optional title
   - Description/story of the day
   - Uploads one or more photos
5. Saves the entry
6. Returns to calendar, now showing this date has an entry

### Flow 3: Editing a Memory
1. User views an existing day entry
2. Clicks "Edit" button
3. Can modify title, description, add/remove photos
4. Saves changes
5. Returns to view mode

### Flow 4: Browsing Photos
1. User navigates to Photos section
2. Sees grid of all photos
3. Can filter by date range, place, or search
4. Clicks photo to see full-size with details
5. Can navigate to the day or place associated with that photo

### Flow 5: Adding a Place
1. User navigates to Places section
2. Clicks "Add Place"
3. Enters name, location, description
4. Optionally adds photos
5. Optionally adds GPS coordinates
6. Saves place
7. Can view on a map or list

## Current Design Patterns (to improve upon)

### What works:
- Calendar interface is intuitive for browsing by date
- Simple login keeps it private
- Clean, minimal interface

### What needs improvement:
- **Visual appeal** - Current design is very basic/utilitarian
- **Photo presentation** - Photos could be showcased better
- **Emotional connection** - UI doesn't feel romantic or special
- **Mobile responsiveness** - Needs to work great on phones
- **Navigation** - Could be more intuitive between sections
- **Empty states** - Better prompts when no content exists
- **Loading states** - More elegant loading indicators

## Design Requirements & Constraints

### Must Haves:
1. **Mobile-first responsive design** - Both users will likely use phones often
2. **Photo-centric** - Photos should be prominent, beautiful display
3. **Easy navigation** - Quick access to different time periods
4. **Simple creation flow** - Adding memories should be effortless
5. **Beautiful typography** - Reading descriptions should feel nice
6. **Fast loading** - Users should never wait unnecessarily
7. **Accessible** - Works with different screen sizes, good contrast

### Nice to Haves:
1. **Dark mode** - For evening browsing
2. **Animations** - Subtle, romantic transitions
3. **Timeline visualization** - See relationship journey visually
4. **Search** - Find specific memories quickly
5. **Export** - Ability to export memories as PDF or print
6. **Sharing** - Generate shareable links to specific memories (with auth)

### Technical Constraints:
1. Single-page application (React SPA)
2. Must work with existing API endpoints
3. Photo uploads via standard file input
4. Date picking should work across all browsers
5. Must support photos from Vercel Blob (URLs, not local files)

## Component Breakdown (for Figma)

### Atoms (Smallest pieces):
- **Button** - Primary, secondary, tertiary styles
- **Input** - Text, date, file upload
- **Text** - Headings (H1-H4), body, captions
- **Icon** - Navigation, actions, status indicators
- **Avatar** - User identifier (Rana vs Mark)
- **Badge** - Dates with entries, tags
- **Image** - Photo display in various sizes

### Molecules (Small combinations):
- **Form field** - Label + Input + Error message
- **Photo thumbnail** - Image + Caption + Metadata
- **Date card** - Date + Entry preview + Thumbnail
- **Navigation item** - Icon + Label
- **Memory card** - Title + Date + Photo + Snippet
- **Empty state** - Icon + Message + CTA button

### Organisms (Larger sections):
- **Navigation bar** - Logo, menu items, user profile
- **Calendar** - Full calendar with date indicators
- **Day entry form** - All fields for creating/editing a day
- **Photo gallery grid** - Collection of photo thumbnails
- **Day detail card** - Full day content display
- **Timeline view** - Chronological list of memories
- **Login form** - Full authentication UI
- **Photo upload zone** - Drag-drop or click to upload

### Templates (Page layouts):
- **Login page layout** - Centered authentication
- **Dashboard layout** - Navigation + Main content area
- **Detail view layout** - Full-screen entry view
- **Gallery layout** - Grid of photos with filters

### Pages (Specific instances):
- **Login page**
- **Calendar dashboard**
- **Day detail view** (with content)
- **Day detail view** (empty state)
- **Photo gallery** (full)
- **Photo gallery** (empty)
- **Places list**
- **Place detail**
- **New entry flow**

## Design Style Inspiration

### Visual Direction:
- **Clean & Modern** - Not cluttered, lots of white space
- **Warm & Romantic** - Soft colors, gentle curves
- **Photo-forward** - Large, beautiful image displays
- **Timeless** - Won't look dated in years
- **Personal** - Feels intimate, not corporate

### Color Palette Suggestions:
- **Primary:** Warm rose/blush tones (#F4C2C2, #E8A0A0, #D47B7B)
- **Secondary:** Soft sage/mint greens (#B8D4C6, #A0C9B4)
- **Neutrals:** Warm grays and off-whites (#F8F6F4, #E8E6E4, #C8C6C4)
- **Accent:** Deep burgundy or wine for important actions (#8B3A5B)
- **Text:** Warm dark gray instead of pure black (#3D3432)

### Typography Suggestions:
- **Headings:** Serif font for elegance (Playfair Display, Lora, Crimson Text)
- **Body:** Sans-serif for readability (Inter, Open Sans, Nunito)
- **Accents:** Script/handwriting for special touches (Dancing Script, Pacifico)

### Image Treatment:
- Rounded corners (8-16px border radius)
- Subtle shadows for depth
- Gentle overlays for text on images
- Fade transitions between images
- Lightbox/modal for full-size viewing

### Spacing:
- Generous padding and margins
- Mobile: 16-24px base unit
- Desktop: 24-32px base unit
- Consistent rhythm throughout

## Specific UI Patterns to Consider

### Calendar View:
- Month view with clear date indicators
- Visual cue for dates with entries (dot, color, photo thumbnail?)
- Quick preview on hover/tap
- Easy navigation between months/years
- "Today" indicator
- Option to switch to timeline/list view

### Day Entry Cards:
- Large featured photo (if available)
- Date prominently displayed
- Title (if exists)
- Description preview (truncated)
- "View more" / "Read full story" CTA
- Edit/delete actions (subtle, not prominent)
- Creator indication (Rana or Mark wrote this)

### Photo Display:
- Grid layout (2-3 columns on mobile, 4-6 on desktop)
- Masonry layout option (Pinterest-style)
- Lightbox for full-size viewing
- Swipe/arrow navigation in lightbox
- Caption and metadata display
- Download option
- Share option

### Forms:
- Single-column layout
- Large, easy-to-tap inputs
- Clear labels
- Helpful placeholder text
- Inline validation
- Success/error states
- Auto-save draft option (nice to have)

### Navigation:
- Bottom tab bar on mobile (Calendar, Photos, Places, More)
- Top navigation on desktop
- Breadcrumbs for deep navigation
- Back button always accessible
- User profile/logout easily accessible

### Empty States:
- Friendly illustrations
- Encouraging message
- Clear CTA to add first item
- Example/template option

## Accessibility Requirements

- **Color contrast:** WCAG AA minimum (4.5:1 for text)
- **Touch targets:** Minimum 44x44px on mobile
- **Keyboard navigation:** All interactive elements accessible via keyboard
- **Screen readers:** Proper ARIA labels and semantic HTML
- **Focus indicators:** Clear visual focus states
- **Form labels:** Every input has a visible label

## Responsive Breakpoints

- **Mobile:** 320px - 767px (primary focus)
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px - 1439px
- **Large Desktop:** 1440px+

## Performance Considerations

- **Images:** Lazy loading, optimized formats (WebP)
- **Animations:** 60fps, reduce motion option
- **Loading states:** Skeleton screens, not spinners
- **Progressive enhancement:** Works without JavaScript (where possible)

## Deliverables Needed from Figma AI

### Priority 1 (Core):
1. **Login page** - Desktop & mobile
2. **Calendar/Dashboard** - Desktop & mobile, with and without entries
3. **Day detail view** - Desktop & mobile, with rich content
4. **Create/Edit day entry** - Desktop & mobile, empty and filled states
5. **Photo gallery** - Desktop & mobile, grid view

### Priority 2 (Important):
6. **Navigation components** - All states and breakpoints
7. **Empty states** - For each major section
8. **Photo lightbox/modal** - Full-size viewing experience
9. **Places list and detail** - Desktop & mobile
10. **Component library** - All reusable UI elements

### Priority 3 (Nice to have):
11. **Timeline view** - Alternative to calendar
12. **Search/filter interface**
13. **Settings page**
14. **Dark mode variants**
15. **Print/export view**

## Current Problems to Solve

1. **Boring calendar UI** - Needs to be visually appealing and romantic
2. **Photo upload is clunky** - Should be drag-and-drop, with preview
3. **No photo gallery** - All photos are only visible on day entries
4. **Mobile experience is poor** - Not optimized for phone use
5. **No visual hierarchy** - Everything looks equally important
6. **Text is hard to read** - Poor typography and spacing
7. **No delight** - App is functional but not enjoyable
8. **Navigation is confusing** - Users get lost easily

## Success Criteria

The new design should make users feel:
- 💕 **Emotional** - Looking at memories brings joy and warmth
- 📸 **Proud** - Want to add more photos and stories
- 🎯 **Focused** - Easy to find and view specific memories
- 📱 **Mobile-first** - Prefer using phone over desktop
- ✨ **Delighted** - Small details make them smile

## Technical Integration Notes

### API Endpoints (already built):
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `GET /api/days` - Get all days
- `POST /api/days` - Create new day
- `GET /api/days/:id` - Get specific day
- `PUT /api/days/:id` - Update day
- `DELETE /api/days/:id` - Delete day
- `GET /api/days/stats` - Get statistics
- `POST /api/photos` - Upload photo
- `GET /api/photos` - Get all photos
- `POST /api/days/:id/photos/:photoId` - Attach photo to day
- `DELETE /api/days/:id/photos/:photoId` - Remove photo from day

### Photo Handling:
- Photos are uploaded to Vercel Blob
- Backend returns full URL to photo
- Frontend displays photo via URL (not local file)
- Multiple photos per day supported
- JPEG, PNG, WebP, HEIC supported

### Authentication:
- JWT token stored in localStorage
- Token expires after 30 days
- Logout clears token
- Protected routes redirect to login

### Date Handling:
- Dates stored as ISO 8601 format (YYYY-MM-DD)
- Displayed in user-friendly format
- Timezone considerations (user's local time)

## Example User Stories

**As Rana:**
"I want to quickly add a photo from today's date night before I go to bed, with a short note about how special it was."

**As Mark:**
"I want to browse through our first year together and see all the places we visited, with our photos from each place."

**As Both:**
"We want to look back at our memories from last summer and relive those moments together."

**As a User:**
"I want to find that photo from the beach trip last July without scrolling through everything."

## Brand Personality

If RanaLovesMe were a person:
- **Romantic** - But not cheesy
- **Warm** - Welcoming and cozy
- **Reliable** - Always there to capture memories
- **Elegant** - Refined and tasteful
- **Personal** - Intimate, not generic
- **Optimistic** - Celebrates love and joy

## Content Examples

### Day Entry Example 1:
```
Date: February 14, 2024
Title: "Our First Valentine's Day"
Description: "Mark surprised me with breakfast in bed and roses. We spent the afternoon at the art museum, then had dinner at that Italian place we've been wanting to try. The tiramisu was incredible! He gave me a handwritten letter that made me cry happy tears. Perfect day with my favorite person."
Photos: [couple selfie at museum, dinner table, roses]
Created by: Rana
```

### Day Entry Example 2:
```
Date: July 4, 2024
Title: "Beach Day"
Description: "Drove to the coast early to beat traffic. Rana taught me how to bodyboard (I was terrible but she was patient!). Built a sandcastle that got destroyed by a wave immediately. Watched the sunset and ate fish tacos. Everything is better with her."
Photos: [beach sunset, sandcastle, Rana in the water, fish tacos]
Created by: Mark
```

### Place Example:
```
Name: "Griffith Observatory"
Location: "2800 E Observatory Rd, Los Angeles, CA"
Visit Date: May 20, 2024
Description: "Our second date. We hiked up right before sunset and watched the city light up. Mark brought a thermos of hot chocolate and we talked for hours about everything. The view of the Hollywood sign was incredible but I couldn't stop looking at him."
Photos: [city view, selfie at telescope, sunset]
GPS: 34.1184, -118.3004
```

---

## Notes for Figma AI

- This is a **real product for real users** who deeply care about their memories
- **Emotion is more important than features** - make them feel something
- **Photos are the hero** - design around beautiful image display
- **Mobile is primary** - they'll use this on their phones constantly
- **Simple is better** - don't add complexity for complexity's sake
- **Think Instagram meets Moleskine journal** - social media quality UI with journal intimacy
- **Every interaction should feel good** - smooth, delightful, no friction

The goal is to create a digital space that feels like a warm hug, a love letter, and a treasure chest all at once.
