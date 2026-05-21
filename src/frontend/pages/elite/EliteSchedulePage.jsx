import EliteLayout from '../../layouts/EliteLayout'
import './EliteSchedulePage.css'

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']

export default function EliteSchedulePage() {
  return (
    <EliteLayout>
      <div className="elite-schedule">
        <div className="es-header">
          <h1 className="elite-page-title" style={{ color: '#006070' }}>Realtime Schedule</h1>
          
          <div className="es-toolbar">
            <div className="es-filters">
              <button className="es-filter-btn active">All Sports</button>
              <button className="es-filter-btn">Tennis</button>
              <button className="es-filter-btn">Basketball</button>
              <button className="es-filter-btn">Squash</button>
            </div>
            <div className="es-legend">
              <span className="es-legend-item"><span className="es-dot available"></span> Available</span>
              <span className="es-legend-item"><span className="es-dot booked"></span> Booked</span>
              <span className="es-legend-item"><span className="es-dot in-use"></span> In-Use</span>
            </div>
          </div>
        </div>

        <div className="es-grid-container">
          <div className="es-grid-wrapper">
            {/* Timeline Header */}
            <div className="es-timeline-header">
              <div className="es-corner"></div>
              {timeSlots.map(time => (
                <div key={time} className="es-time-slot">{time}</div>
              ))}
            </div>

            {/* Grid Body */}
            <div className="es-grid-body">
              {/* Grid Lines Overlay */}
              <div className="es-grid-lines">
                {timeSlots.map((_, i) => (
                  <div key={i} className="es-grid-line"></div>
                ))}
              </div>

              {/* Court 1 */}
              <div className="es-row">
                <div className="es-row-label">Court 1</div>
                <div className="es-row-content">
                  <div className="es-event es-event--booked" style={{ left: '0%', width: '25%' }}>
                    <p className="es-event-title">Team Alpha vs Beta</p>
                    <p className="es-event-time">08:00 - 10:00</p>
                  </div>
                  <div className="es-event es-event--in-use" style={{ left: '25%', width: '12.5%' }}>
                    <p className="es-event-title" style={{ color: '#991b1b' }}>Private Lesson</p>
                    <p className="es-event-time" style={{ color: '#b91c1c' }}>10:00 - 11:00</p>
                  </div>
                </div>
              </div>

              {/* Court 2 */}
              <div className="es-row">
                <div className="es-row-label">Court 2</div>
                <div className="es-row-content">
                  <div className="es-event es-event--maint" style={{ left: '12.5%', width: '31.25%' }}>
                    <p className="es-event-title" style={{ color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                      Net Replacement
                    </p>
                  </div>
                  <div className="es-event es-event--booked" style={{ left: '50%', width: '37.5%' }}>
                    <p className="es-event-title">Regional Tournament Quarterfinals</p>
                    <p className="es-event-time">12:00 - 15:00</p>
                  </div>
                </div>
              </div>

              {/* Court 3 */}
              <div className="es-row">
                <div className="es-row-label">Court 3</div>
                <div className="es-row-content">
                  <div className="es-event es-event--booked" style={{ left: '0%', width: '18.75%' }}>
                    <p className="es-event-title">Open Play</p>
                  </div>
                  <div className="es-event es-event--booked" style={{ left: '25%', width: '12.5%' }}>
                    <p className="es-event-title">Clinic</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </EliteLayout>
  )
}
