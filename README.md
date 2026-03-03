# Student Curriculum & Attendance Tracker

**AttendTrack**

A simple, lightweight web application for tracking student attendance and managing curriculum activities. This app allows educators to monitor attendance records for multiple subjects and keep track of classroom activities.

LINK: https://janardhans56.github.io/student-attendance-app/

<img width="1888" height="1004" alt="image" src="https://github.com/user-attachments/assets/4c999a4d-6178-4d2b-8ed6-d69865c7b6f7" />

<img width="1878" height="983" alt="image" src="https://github.com/user-attachments/assets/c5f233a1-1d10-4de8-8fb3-d713a0056f6c" />



## Features

- **Subject Management**: Add and manage multiple subjects
- **Attendance Tracking**: Mark students as present or absent for each subject
- **Attendance Percentage**: Automatically calculate and display attendance percentage for each subject
- **Activity Log**: Add and maintain a list of curriculum activities
- **Local Storage**: All data is saved locally in your browser (no server required)
- **Simple UI**: Clean and intuitive user interface

## Project Structure

```
student-attendance-app/
├── index.html          # Main HTML file with page structure
├── style.css           # Styling for the application
├── script.js           # JavaScript functionality and logic
├── analytics.html      # Analytics page (under development)
├── subjects.html       # Subjects page (under development)
└── css/                # CSS directory (for modular styles)
```

## How to Use

1. **Add a Subject**:
   - Enter the subject name in the "Add Subject" input field
   - Click "Add Subject" button
   - The subject will appear in the Subjects section

2. **Track Attendance**:
   - For each subject, click "Present" if a student attended or "Absent" if they didn't
   - The attendance percentage is automatically calculated as `(Present / Total) * 100`
   - View the attendance statistics in the format: `X% (present/total)`

3. **Add Activities**:
   - Enter the curriculum activity in the "Add Curriculum Activity" input field
   - Click "Add Activity" button
   - Activities will be displayed in a list below

## Data Persistence

The application uses **localStorage** to save all data locally in your browser:
- `subjects` - Stores all subject data with attendance counts
- `activities` - Stores all recorded activities

Data persists across browser sessions until manually cleared from browser storage.

## Technical Stack

- **HTML5** - Page structure and markup
- **CSS3** - Styling and layout
- **Vanilla JavaScript** - Core functionality without external dependencies

## Browser Compatibility

This application works on all modern browsers that support:
- ES6 JavaScript
- Local Storage API
- HTML5

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start tracking attendance and activities!

No installation or setup required.

## Future Enhancements

- [ ] Analytics dashboard for attendance insights
- [ ] Subject management page
- [ ] Export attendance reports
- [ ] Data backup and restore functionality
- [ ] User authentication
- [ ] Backend database integration

## License

This project is open source and available for educational use.

---

**Created by**: JanardhanS56  
**Last Updated**: March 2026
