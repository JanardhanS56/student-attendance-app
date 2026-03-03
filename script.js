/* ============================================================
   AttendTrack — Main Script
   ============================================================ */

// ── Data ────────────────────────────────────────────────────
let subjects = JSON.parse(localStorage.getItem('attendtrack_subjects')) || [];
let activities = JSON.parse(localStorage.getItem('attendtrack_activities')) || [];

function save() {
    localStorage.setItem('attendtrack_subjects', JSON.stringify(subjects));
    localStorage.setItem('attendtrack_activities', JSON.stringify(activities));
}

// ── Page Navigation ─────────────────────────────────────────
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.getElementById('page-' + id).classList.add('active');
    document.getElementById('nav-' + id).classList.add('active');

    if (id === 'dashboard') renderDashboard();
    if (id === 'subjects') renderSubjects();
    if (id === 'analytics') renderAnalytics();
    if (id === 'activities') renderActivities();
    window.scrollTo(0, 0);
}

// Prevent default for nav links
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', e => e.preventDefault());
});

// ── Toast Notifications ─────────────────────────────────────
function toast(msg, type = 'info') {
    const icons = { success: '✅', error: '❌', info: '💡' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${icons[type]}</span> ${msg}`;
    document.getElementById('toast-container').appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

// ── Subjects ────────────────────────────────────────────────
function addSubject() {
    const input = document.getElementById('subjectInput');
    const name = input.value.trim();
    if (!name) { toast('Please enter a subject name.', 'error'); return; }
    if (subjects.find(s => s.name.toLowerCase() === name.toLowerCase())) {
        toast('Subject already exists!', 'error'); return;
    }
    subjects.push({ name, total: 0, present: 0 });
    input.value = '';
    save();
    renderSubjects();
    renderDashboard();
    toast(`"${name}" added!`, 'success');
}

function markAttendance(index, status) {
    subjects[index].total++;
    if (status === 'present') subjects[index].present++;
    save();
    renderSubjects();
    renderDashboard();
    const label = status === 'present' ? '✅ Present' : '❌ Absent';
    toast(`${label} marked for ${subjects[index].name}`, status === 'present' ? 'success' : 'error');
}

function deleteSubject(index) {
    const name = subjects[index].name;
    subjects.splice(index, 1);
    save();
    renderSubjects();
    renderDashboard();
    toast(`"${name}" removed.`, 'info');
}

function badgeInfo(pct) {
    if (pct >= 75) return { cls: 'badge-good', label: 'Good' };
    if (pct >= 60) return { cls: 'badge-warn', label: 'Warning' };
    return { cls: 'badge-bad', label: 'At Risk' };
}

function progressClass(pct) {
    if (pct >= 75) return '';
    if (pct >= 60) return 'warn';
    return 'danger';
}

function renderSubjects() {
    const grid = document.getElementById('subjectsGrid');
    if (!grid) return;
    if (subjects.length === 0) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-icon">📚</div><p>No subjects added yet. Add one above!</p></div>`;
        return;
    }
    grid.innerHTML = subjects.map((sub, i) => {
        const pct = sub.total === 0 ? 0 : Math.round((sub.present / sub.total) * 100);
        const absent = sub.total - sub.present;
        const badge = badgeInfo(pct);
        const pClass = progressClass(pct);
        return `
      <div class="subject-card">
        <div class="subject-header">
          <div class="subject-name">${escHtml(sub.name)}</div>
          <span class="subject-badge ${badge.cls}">${badge.label}</span>
        </div>
        <div class="attendance-info">
          <strong>${pct}%</strong>
          Attendance (${sub.present}/${sub.total} classes)
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${pClass}" style="width:${pct}%"></div>
        </div>
        <div class="counters">
          <span class="counter-item"><span class="counter-dot green"></span>${sub.present} Present</span>
          <span class="counter-item"><span class="counter-dot red"></span>${absent} Absent</span>
        </div>
        <div class="subject-actions">
          <button class="btn btn-success btn-sm" onclick="markAttendance(${i},'present')">✅ Present</button>
          <button class="btn btn-danger btn-sm" onclick="markAttendance(${i},'absent')">❌ Absent</button>
          <button class="btn btn-ghost btn-sm" onclick="deleteSubject(${i})" title="Delete">🗑</button>
        </div>
      </div>`;
    }).join('');
}

// ── Dashboard ───────────────────────────────────────────────
function renderDashboard() {
    // Stats
    const totalClasses = subjects.reduce((s, x) => s + x.total, 0);
    const totalPresent = subjects.reduce((s, x) => s + x.present, 0);
    const overall = totalClasses === 0 ? 0 : Math.round((totalPresent / totalClasses) * 100);
    const atRisk = subjects.filter(x => x.total > 0 && (x.present / x.total) < 0.75).length;
    const pendingAct = activities.filter(a => !a.done).length;

    setEl('stat-subjects', subjects.length);
    setEl('stat-overall', overall + '%');
    setEl('stat-atrisk', atRisk);
    setEl('stat-activities', pendingAct);

    // Overview
    const ov = document.getElementById('dashboard-overview');
    if (subjects.length === 0) {
        ov.innerHTML = `<div class="empty-state"><div class="empty-icon">📚</div><p>No subjects yet. <a href="#" onclick="showPage('subjects')" style="color:var(--accent)">Add a subject</a> to get started!</p></div>`;
    } else {
        ov.innerHTML = subjects.map((sub, i) => {
            const pct = sub.total === 0 ? 0 : Math.round((sub.present / sub.total) * 100);
            const badge = badgeInfo(pct);
            const pClass = progressClass(pct);
            return `
        <div style="margin-bottom:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span style="font-size:.9rem;font-weight:600;">${escHtml(sub.name)}</span>
            <span style="display:flex;gap:.5rem;align-items:center;">
              <span class="subject-badge ${badge.cls}">${badge.label}</span>
              <span style="font-weight:700;font-size:.9rem;">${pct}%</span>
            </span>
          </div>
          <div class="progress-bar"><div class="progress-fill ${pClass}" style="width:${pct}%"></div></div>
        </div>`;
        }).join('');
    }

    // Pending activities
    const da = document.getElementById('dashboard-activities');
    const pending = activities.filter(a => !a.done);
    if (pending.length === 0) {
        da.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>No pending activities. <a href="#" onclick="showPage('activities')" style="color:var(--accent)">Add an activity</a>.</p></div>`;
    } else {
        da.innerHTML = `<ul class="activity-list">${pending.slice(0, 5).map(a => `
      <li class="activity-item">
        <div class="activity-checkbox">🔲</div>
        <span class="activity-text">${escHtml(a.text)}</span>
        <span class="activity-date">${a.date}</span>
      </li>`).join('')}</ul>
      ${pending.length > 5 ? `<p style="text-align:center;margin-top:.8rem;color:var(--text-secondary);font-size:.82rem;">+${pending.length - 5} more… <a href="#" onclick="showPage('activities')" style="color:var(--accent)">View all</a></p>` : ''}`;
    }
}

// ── Activities ──────────────────────────────────────────────
function addActivity() {
    const input = document.getElementById('activityInput');
    const text = input.value.trim();
    if (!text) { toast('Please enter an activity.', 'error'); return; }
    const now = new Date();
    activities.push({
        text,
        done: false,
        date: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    });
    input.value = '';
    save();
    renderActivities();
    renderDashboard();
    toast('Activity added!', 'success');
}

function toggleActivity(index) {
    activities[index].done = !activities[index].done;
    save();
    renderActivities();
    renderDashboard();
}

function deleteActivity(index) {
    activities.splice(index, 1);
    save();
    renderActivities();
    renderDashboard();
    toast('Activity removed.', 'info');
}

function renderActivities() {
    const list = document.getElementById('activityList');
    if (!list) return;
    if (activities.length === 0) {
        list.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>No activities yet. Add one above!</p></div>`;
        return;
    }
    list.innerHTML = activities.map((act, i) => `
    <li class="activity-item ${act.done ? 'done' : ''}">
      <div class="activity-checkbox ${act.done ? 'checked' : ''}" onclick="toggleActivity(${i})">
        ${act.done ? '✓' : ''}
      </div>
      <span class="activity-text">${escHtml(act.text)}</span>
      <span class="activity-date">${act.date}</span>
      <button class="activity-delete" onclick="deleteActivity(${i})" title="Delete">✕</button>
    </li>`).join('');
}

// ── Analytics & Charts ──────────────────────────────────────
let barChartInst = null, doughnutInst = null, statusInst = null;

function renderAnalytics() {
    const totalClasses = subjects.reduce((s, x) => s + x.total, 0);
    const totalPresent = subjects.reduce((s, x) => s + x.present, 0);
    const totalAbsent = totalClasses - totalPresent;
    const avg = totalClasses === 0 ? 0 : Math.round((totalPresent / totalClasses) * 100);

    setEl('an-total-classes', totalClasses);
    setEl('an-total-present', totalPresent);
    setEl('an-total-absent', totalAbsent);
    setEl('an-avg', avg + '%');

    if (subjects.length === 0) return;

    const names = subjects.map(s => s.name);
    const percents = subjects.map(s => s.total === 0 ? 0 : Math.round((s.present / s.total) * 100));
    const colors = percents.map(p => p >= 75 ? '#22d3a0' : p >= 60 ? '#f7c76a' : '#f7706a');

    Chart.defaults.color = '#9999bb';
    Chart.defaults.font.family = 'Inter, sans-serif';

    // Bar Chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    if (barChartInst) barChartInst.destroy();
    barChartInst = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'Attendance %',
                data: percents,
                backgroundColor: colors,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    min: 0, max: 100,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { callback: v => v + '%' }
                },
                x: { grid: { display: false } }
            }
        }
    });

    // Doughnut Chart
    const dCtx = document.getElementById('doughnutChart').getContext('2d');
    if (doughnutInst) doughnutInst.destroy();
    doughnutInst = new Chart(dCtx, {
        type: 'doughnut',
        data: {
            labels: ['Present', 'Absent'],
            datasets: [{
                data: [totalPresent, totalAbsent],
                backgroundColor: ['#22d3a0', '#f7706a'],
                borderColor: '#16162a',
                borderWidth: 3,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { padding: 20, font: { size: 13 } } }
            },
            cutout: '70%'
        }
    });

    // Stacked bar (status per subject)
    const sCtx = document.getElementById('statusChart').getContext('2d');
    if (statusInst) statusInst.destroy();
    statusInst = new Chart(sCtx, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [
                {
                    label: 'Present',
                    data: subjects.map(s => s.present),
                    backgroundColor: 'rgba(34,211,160,0.75)',
                    borderRadius: { topLeft: 6, topRight: 6 },
                    borderSkipped: false,
                },
                {
                    label: 'Absent',
                    data: subjects.map(s => s.total - s.present),
                    backgroundColor: 'rgba(247,112,106,0.75)',
                    borderRadius: { topLeft: 6, topRight: 6 },
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { padding: 16, font: { size: 12 } } }
            },
            scales: {
                x: { stacked: true, grid: { display: false } },
                y: { stacked: true, grid: { color: 'rgba(255,255,255,0.05)' } }
            }
        }
    });
}

// ── Utilities ────────────────────────────────────────────────
function setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Init ─────────────────────────────────────────────────────
renderDashboard();
renderSubjects();
renderActivities();