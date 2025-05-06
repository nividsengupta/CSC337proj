
 UA Course Critique

This repository holds the source code for UA Course Critique – “The Course Review Website.” It enables University of Arizona students to browse and share honest course reviews.

## Modules

* **User**

  * Create User
  * Login
  * User / Admin session
* **Post**

  * Manage Posts (admin only)
  * Make Posts
  * View Posts
* **Contact**

  * About us
  * Feedback
  * Delete Feedback (admin only)

## Tech Stack

* **Node.js** with **Express** (`server.js`) 
* **HTML & CSS** front‑end pages (`*.html`, `style.css`)
* Data persistence with **JSON** files (`user_data.json`, `post_data.json`, `contact_data.json`)

## Key Files

| File                                                    | Purpose                                                                   |
| ------------------------------------------------------- | ------------------------------------------------------------------------- |
| `server.js`                                             | Express server routing all endpoints; listens on port 8080.               |
| `home.html`, `home_user.html`, `home_admin.html`        | Landing pages for visitors, authenticated users, and admins.              |
| `login.html`, `create_user.html`                        | Account creation and authentication forms.                                |
| `add.html`, `delete.html`, `view.html`                  | Interfaces to post, delete, and view course reviews.                      |
| `contact.html`                                          | Feedback / query submission form.                                         |
| `style.css`                                             | Global site styling.                                                      |
| `user_data.json`, `post_data.json`, `contact_data.json` | Local JSON stores for users, posts, and messages.                         |

## Running Locally

To run the code locally, change directory to file containing all server pages and run command:

node server.js

The application starts on **[http://localhost:8080](http://localhost:8080)**. 

## Site usage

The site is designed to be intuitive to use.
To access and create posts goto create user tab, and create a log in. Once a log in has been created, goto the log in page to log in to account.
upon successful login, access post review to look up posts on the desired subject or add posts from the add post tab.
To send feedback to the admin team, use the contact us page.

## Admin Controls

Certain admin controls are locked to users with an admin account. To create admin account, goto create user tab and create account as admin with admin code '1234'.
Log in to admin accounts via Log in tab.
Upon successful login, all admin controls should be visible from Home tab. 
* Admin controls are : 
  * Delete review - Deletes specified review
  * View Feedback - Lets admin view a list of all feedback posted via contact us forms
  * Delete Feedback - Lets admin to delete feedback once resolved.


