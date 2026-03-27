import jsPDF from 'jspdf';

export const generateReport = (data) => {
  const { user, latestPrediction, performances, activities, recommendations, comparison, goalTracker } = data || {};
  const doc = new jsPDF();
  const primary = [102, 126, 234];
  const dark = [30, 41, 59];
  const gray = [100, 116, 139];
  const light = [241, 245, 249];

  let y = 0;

  // Header bar
  doc.setFillColor(...primary);
  doc.rect(0, 0, 210, 45, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Digital Twin Report', 15, 22);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('AI-Powered Academic Performance Analysis', 15, 32);
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`Generated: ${today}`, 15, 40);
  y = 60;

  // Student Info
  doc.setTextColor(...dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Profile', 15, y);
  y += 2;
  doc.setDrawColor(...primary);
  doc.setLineWidth(0.5);
  doc.line(15, y, 195, y);
  y += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gray);
  doc.text(`Name: ${user?.name || 'N/A'}`, 15, y);
  doc.text(`Email: ${user?.email || 'N/A'}`, 110, y);
  y += 20;

  // ── Predicted Score Big Card ──
  doc.setFillColor(...light);
  doc.roundedRect(15, y, 85, 45, 4, 4, 'F');
  doc.setFillColor(...primary);
  doc.roundedRect(110, y, 85, 45, 4, 4, 'F');

  const score = latestPrediction?.predictedScore?.toFixed(1) || 'N/A';
  const risk = latestPrediction?.riskLevel || 'N/A';
  const riskLabel = risk === 'LOW_RISK' ? '🟢 Low Risk' : risk === 'MEDIUM_RISK' ? '🟡 Medium Risk' : risk === 'HIGH_RISK' ? '🔴 High Risk' : 'N/A';

  doc.setTextColor(...gray);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PREDICTED SCORE', 20, y + 12);
  doc.setTextColor(...dark);
  doc.setFontSize(28);
  doc.text(`${score}%`, 20, y + 32);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('RISK LEVEL', 115, y + 12);
  doc.setFontSize(16);
  doc.text(riskLabel, 115, y + 32);
  y += 58;

  // ── Key Metrics ──
  doc.setTextColor(...dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Metrics', 15, y);
  y += 2;
  doc.line(15, y, 195, y);
  y += 10;

  const avgMarks = performances?.length
    ? (performances.reduce((s, p) => s + p.marks, 0) / performances.length).toFixed(1) : '0';
  const totalStudy = activities?.length
    ? activities.reduce((s, a) => s + a.studyHours, 0).toFixed(1) : '0';
  const avgAtt = activities?.length
    ? (activities.reduce((s, a) => s + a.attendance, 0) / activities.length).toFixed(1) : '0';
  const avgSleep = activities?.length
    ? (activities.reduce((s, a) => s + a.sleepHours, 0) / activities.length).toFixed(1) : '0';

  const metrics = [
    ['Average Marks', `${avgMarks}%`],
    ['Total Study Hours', `${totalStudy} hrs`],
    ['Avg Attendance', `${avgAtt}%`],
    ['Avg Sleep', `${avgSleep} hrs`],
  ];
  metrics.forEach(([label, val], i) => {
    const col = i < 2 ? 15 : 110;
    const row = i % 2 === 0 ? y : y + 20;
    doc.setFillColor(...light);
    doc.roundedRect(col, row - 8, 85, 18, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    doc.text(label, col + 5, row - 1);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...dark);
    doc.text(val, col + 5, row + 7);
  });
  y += 42;

  // ── Goal Tracker ──
  if (goalTracker) {
    doc.setTextColor(...dark);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Goal Tracker', 15, y);
    y += 2;
    doc.line(15, y, 195, y);
    y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    doc.text(`Target: ${goalTracker.target}%  |  Current: ${goalTracker.current?.toFixed(1)}%  |  Progress: ${goalTracker.progress?.toFixed(0)}%`, 15, y);
    y += 7;
    // Progress bar
    doc.setFillColor(230, 235, 255);
    doc.roundedRect(15, y, 180, 8, 4, 4, 'F');
    const progressWidth = Math.min(180, (goalTracker.progress / 100) * 180);
    doc.setFillColor(...primary);
    doc.roundedRect(15, y, progressWidth, 8, 4, 4, 'F');
    y += 22;
  }

  // ── You vs Top Students ──
  if (comparison) {
    doc.setTextColor(...dark);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('You vs Top Students', 15, y);
    y += 2;
    doc.line(15, y, 195, y);
    y += 10;

    [
      ['Average Marks', comparison.yourMarks + '%', comparison.topMarks + '%'],
      ['Study Hours/Day', comparison.yourStudyHours + ' hrs', comparison.topStudyHours + ' hrs'],
      ['Attendance', comparison.yourAttendance + '%', comparison.topAttendance + '%'],
    ].forEach(([label, yours, top]) => {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...gray);
      doc.text(label, 15, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primary);
      doc.text(`You: ${yours}`, 80, y);
      doc.setTextColor(150, 150, 150);
      doc.text(`Top: ${top}`, 130, y);
      y += 9;
    });
    y += 8;
  }

  // ── Subject Performance ──
  if (performances?.length) {
    doc.setTextColor(...dark);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Subject Performance', 15, y);
    y += 2;
    doc.line(15, y, 195, y);
    y += 10;

    const subjectMap = performances.reduce((acc, p) => {
      if (!acc[p.subject] || acc[p.subject] < p.marks) acc[p.subject] = p.marks;
      return acc;
    }, {});

    Object.entries(subjectMap).slice(0, 6).forEach(([subject, marks]) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...gray);
      doc.text(subject, 15, y);
      // Bar
      const barW = (marks / 100) * 100;
      doc.setFillColor(230, 235, 255);
      doc.roundedRect(75, y - 5, 100, 7, 3, 3, 'F');
      doc.setFillColor(marks >= 75 ? 16 : marks >= 50 ? 245 : 239, marks >= 75 ? 185 : marks >= 50 ? 158 : 68, marks >= 75 ? 129 : marks >= 50 ? 11 : 68);
      doc.roundedRect(75, y - 5, barW, 7, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...dark);
      doc.text(`${marks}%`, 182, y);
      y += 14;
    });
    y += 5;
  }

  // ── Recommendations ──
  if (recommendations?.length) {
    if (y > 220) { doc.addPage(); y = 20; }
    doc.setTextColor(...dark);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('AI Recommendations', 15, y);
    y += 2;
    doc.line(15, y, 195, y);
    y += 10;

    recommendations.slice(0, 6).forEach((rec, i) => {
      const cleanRec = rec.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').trim();
      doc.setFillColor(...light);
      doc.roundedRect(15, y - 6, 180, 14, 3, 3, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...dark);
      const lines = doc.splitTextToSize(`${i + 1}. ${cleanRec}`, 170);
      doc.text(lines[0], 20, y);
      y += 18;
    });
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(...light);
    doc.rect(0, 282, 210, 15, 'F');
    doc.setFontSize(8);
    doc.setTextColor(...gray);
    doc.text('Digital Twin — AI-Powered Student Analytics System', 15, 291);
    doc.text(`Page ${i} of ${totalPages}`, 180, 291);
  }

  doc.save(`Digital_Twin_Report_${user?.name?.replace(/\s+/g, '_') || 'Student'}.pdf`);
};
