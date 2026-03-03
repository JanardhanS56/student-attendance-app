let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let activities = JSON.parse(localStorage.getItem("activities")) || [];

function saveData() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
    localStorage.setItem("activities", JSON.stringify(activities));
}

function addSubject() {
    const name = document.getElementById("subjectName").value;
    if (!name) return;

    subjects.push({
        name: name,
        total: 0,
        present: 0
    });

    document.getElementById("subjectName").value = "";
    saveData();
    renderSubjects();
}

function markAttendance(index, status) {
    subjects[index].total++;
    if (status === "present") {
        subjects[index].present++;
    }
    saveData();
    renderSubjects();
}

function renderSubjects() {
    const list = document.getElementById("subjectList");
    list.innerHTML = "";

    subjects.forEach((sub, index) => {
        const percent = sub.total === 0 ? 0 :
            ((sub.present / sub.total) * 100).toFixed(1);

        list.innerHTML += `
            <div class="subject">
                <strong>${sub.name}</strong><br>
                Attendance: ${percent}% (${sub.present}/${sub.total})<br>
                <button onclick="markAttendance(${index}, 'present')">Present</button>
                <button onclick="markAttendance(${index}, 'absent')">Absent</button>
            </div>
        `;
    });
}

function addActivity() {
    const input = document.getElementById("activityInput");
    const value = input.value;
    if (!value) return;
    //bvpv6623

    activities.push(value);
    input.value = "";
    saveData();
    renderActivities();
}

function renderActivities() {
    const list = document.getElementById("activityList");
    list.innerHTML = "";

    activities.forEach((act, index) => {
        list.innerHTML += `<li>${act}</li>`;
    });
}

renderSubjects();
renderActivities();