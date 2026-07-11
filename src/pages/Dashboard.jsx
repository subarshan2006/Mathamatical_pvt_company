import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [activity, setActivity] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartMonths, setChartMonths] = useState(6);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, perfRes, actRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/performance'),
          api.get('/dashboard/activity?limit=8'),
        ]);
        setStats(statsRes.data.data);
        setPerformance(perfRes.data.data);
        setActivity(actRes.data.data);

        const now = new Date();
        const monthPromises = [];
        for (let i = chartMonths - 1; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          monthPromises.push(
            api.get(`/dashboard/monthly?year=${d.getFullYear()}&month=${d.getMonth() + 1}`)
          );
        }
        const monthResults = await Promise.all(monthPromises);
        const chart = monthResults.map((r) => {
          const o = r.data.data;
          return {
            name: MONTHS[o.month - 1],
            completed: o.overview.completed,
            cancelled: o.overview.cancelled,
            missed: o.overview.missed,
            hours: o.totalHours,
          };
        });
        setChartData(chart);
      } catch {
        // no data yet
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [chartMonths]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h, 10);
    return `${hr > 12 ? hr - 12 : hr || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-welcome">
            Welcome back, <strong>{user?.name || 'Tutor'}</strong>
          </p>
        </div>
        <div className="dashboard-header-right">
          <Link to="/" className="dashboard-nav-btn">
            <ion-icon name="globe-outline"></ion-icon>
            <span>Portfolio</span>
          </Link>
          <button onClick={handleLogout} className="dashboard-logout-btn">
            <ion-icon name="log-out-outline"></ion-icon>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {loading ? (
        <div className="dashboard-loading">
          <div className="auth-spinner" />
          <p>Loading dashboard...</p>
        </div>
      ) : !stats ? (
        <div className="dashboard-empty">
          <ion-icon name="analytics-outline"></ion-icon>
          <h3>No Data Yet</h3>
          <p>Start by adding students and scheduling sessions.</p>
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="dashboard-grid">
            <div className="dashboard-stat-card">
              <div className="stat-icon stat-icon-students">
                <ion-icon name="people-outline"></ion-icon>
              </div>
              <div className="stat-info">
                <h3>{stats.students?.active ?? 0}<span className="stat-sub"> / {stats.students?.total ?? 0}</span></h3>
                <p>Active / Total Students</p>
              </div>
            </div>
            <div className="dashboard-stat-card">
              <div className="stat-icon stat-icon-sessions">
                <ion-icon name="calendar-outline"></ion-icon>
              </div>
              <div className="stat-info">
                <h3>{stats.sessions?.completed ?? 0}<span className="stat-sub"> / {stats.sessions?.total ?? 0}</span></h3>
                <p>Completed / Total Sessions</p>
              </div>
            </div>
            <div className="dashboard-stat-card">
              <div className="stat-icon stat-icon-hours">
                <ion-icon name="time-outline"></ion-icon>
              </div>
              <div className="stat-info">
                <h3>{stats.rates?.attendance ?? 0}%</h3>
                <p>Attendance Rate</p>
              </div>
            </div>
            <div className="dashboard-stat-card">
              <div className="stat-icon stat-icon-homework">
                <ion-icon name="trending-up-outline"></ion-icon>
              </div>
              <div className="stat-info">
                <h3>{stats.rates?.completion ?? 0}%</h3>
                <p>Completion Rate</p>
              </div>
            </div>
          </div>

          {/* Today + Upcoming Sessions */}
          <div className="dashboard-row">
            <div className="dashboard-section">
              <div className="dashboard-section-header">
                <h2 className="dashboard-section-title">
                  <ion-icon name="today-outline"></ion-icon> Today's Sessions
                </h2>
                <span className="dashboard-badge">{stats.sessions?.today ?? 0}</span>
              </div>
              {stats.todaySessions?.length > 0 ? (
                <ul className="dashboard-session-list">
                  {stats.todaySessions.map((s) => (
                    <li key={s._id} className="dashboard-session-item">
                      <div className="session-time-badge">
                        <span>{formatTime(s.startTime)}</span>
                      </div>
                      <div className="session-item-info">
                        <span className="session-item-student">{s.studentId?.name || 'Unknown'}</span>
                        <span className="session-item-topic">{s.topicPlanned || 'No topic'}</span>
                      </div>
                      <span className={`session-status status-${s.status?.toLowerCase()}`}>{s.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="dashboard-no-data">No sessions today</p>
              )}
            </div>

            <div className="dashboard-section">
              <div className="dashboard-section-header">
                <h2 className="dashboard-section-title">
                  <ion-icon name="arrow-forward-outline"></ion-icon> Upcoming
                </h2>
                <span className="dashboard-badge">{stats.sessions?.upcoming ?? 0}</span>
              </div>
              {stats.upcomingSessions?.length > 0 ? (
                <ul className="dashboard-session-list">
                  {stats.upcomingSessions.map((s) => (
                    <li key={s._id} className="dashboard-session-item">
                      <div className="session-date-badge">
                        <span>{formatDate(s.date)}</span>
                      </div>
                      <div className="session-item-info">
                        <span className="session-item-student">{s.studentId?.name || 'Unknown'}</span>
                        <span className="session-item-time">{formatTime(s.startTime)} - {formatTime(s.endTime)}</span>
                      </div>
                      <span className={`session-status status-${s.status?.toLowerCase()}`}>{s.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="dashboard-no-data">No upcoming sessions</p>
              )}
            </div>
          </div>

          {/* Monthly Chart */}
          <div className="dashboard-section dashboard-chart-section">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">
                <ion-icon name="bar-chart-outline"></ion-icon> Monthly Overview
              </h2>
              <div className="dashboard-chart-controls">
                {[3,6,12].map((m) => (
                  <button
                    key={m}
                    className={`chart-range-btn${chartMonths === m ? ' active' : ''}`}
                    onClick={() => setChartMonths(m)}
                  >
                    {m}M
                  </button>
                ))}
              </div>
            </div>
            {chartData.length > 0 ? (
              <div className="dashboard-chart-wrapper">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(0,0%,100%,0.06)" />
                    <XAxis dataKey="name" stroke="hsla(0,0%,100%,0.4)" fontSize={12} />
                    <YAxis stroke="hsla(0,0%,100%,0.4)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(240, 2%, 13%)',
                        border: '1px solid hsla(0,0%,100%,0.1)',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="completed" stroke="hsl(150, 60%, 50%)" strokeWidth={2} dot={false} name="Completed" />
                    <Line type="monotone" dataKey="cancelled" stroke="hsl(0, 43%, 51%)" strokeWidth={2} dot={false} name="Cancelled" />
                    <Line type="monotone" dataKey="missed" stroke="hsl(45, 54%, 58%)" strokeWidth={2} dot={false} name="Missed" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="dashboard-no-data">No chart data available</p>
            )}
          </div>

          {/* Student Performance */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">
                <ion-icon name="school-outline"></ion-icon> Student Performance
              </h2>
            </div>
            {performance.length > 0 ? (
              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Grade</th>
                      <th>Sessions</th>
                      <th>Attendance</th>
                      <th>Avg. Understanding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performance.map((p) => (
                      <tr key={p.student._id}>
                        <td>
                          <Link to={`/students/${p.student._id}`} className="table-link">
                            {p.student.name}
                          </Link>
                        </td>
                        <td>{p.student.grade || '—'}</td>
                        <td>{p.completedSessions} / {p.totalSessions}</td>
                        <td>
                          <div className="progress-bar-mini">
                            <div className="progress-fill-mini" style={{ width: `${p.attendanceRate}%` }} />
                          </div>
                          <span className="progress-text">{p.attendanceRate}%</span>
                        </td>
                        <td>{p.avgUnderstanding != null ? `${p.avgUnderstanding} / 5` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="dashboard-no-data">No active students</p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">
                <ion-icon name="time-outline"></ion-icon> Recent Activity
              </h2>
            </div>
            {activity.length > 0 ? (
              <ul className="dashboard-activity-list">
                {activity.map((a) => (
                  <li key={a._id} className="dashboard-activity-item">
                    <div className={`activity-dot activity-dot-${a.status?.toLowerCase()}`} />
                    <div className="activity-info">
                      <span className="activity-text">
                        <strong>{a.studentId?.name || 'Unknown'}</strong>
                        {' '}{a.status === 'COMPLETED' ? 'completed' : a.status === 'CANCELLED' ? 'cancelled' : a.status === 'MISSED' ? 'missed' : 'scheduled'} a session
                        {a.topicPlanned ? ` — ${a.topicPlanned}` : ''}
                      </span>
                      <span className="activity-time">{formatDate(a.date)} · {formatTime(a.startTime)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dashboard-no-data">No recent activity</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
