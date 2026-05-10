(function () {
  function buildCharts() {
    if (!window.Chart || !window.StageConnectData) return;

    const internships = window.StageConnectData.getInternships();
    const students = window.StageConnectData.getStudents();
    const notifications = window.StageConnectData.getNotifications();
    const reviews = window.StageConnectData.getReviews();
    const reports = window.StageConnectData.getReports();

    const departmentLabels = Object.keys(window.StageConnectData.departmentConfig);
    const departmentValues = departmentLabels.map(
      (label) => internships.filter((item) => item.department === label).length
    );

    const levelLabels = Object.keys(window.StageConnectData.levelConfig);
    const levelValues = levelLabels.map(
      (label) => students.filter((item) => item.level === label).length
    );

    const reviewValues = [
      reviews.filter((item) => item.rating === 5).length,
      reviews.filter((item) => item.rating === 4).length,
      reviews.filter((item) => item.rating <= 3).length
    ];

    const notificationValues = [
      notifications.filter((item) => !item.read).length,
      notifications.filter((item) => item.read).length
    ];

    const reportsByStatus = ["Approved", "Pending", "Review"].map(
      (status) => reports.filter((report) => report.status === status).length
    );

    const chartConfigs = {
      "admin-overview-chart": {
        type: "bar",
        data: {
          labels: departmentLabels,
          datasets: [{
            label: "Internships by department",
            data: departmentValues,
            borderRadius: 10,
            backgroundColor: ["#46c2ff", "#f7a649", "#f1d14f", "#c678ff"]
          }]
        }
      },
      "admin-engagement-chart": {
        type: "line",
        data: {
          labels: levelLabels,
          datasets: [{
            label: "Students by level",
            data: levelValues,
            fill: true,
            borderColor: "#5b8cff",
            backgroundColor: "rgba(91, 140, 255, 0.18)",
            tension: 0.35
          }]
        }
      },
      "admin-reviews-chart": {
        type: "doughnut",
        data: {
          labels: ["5 stars", "4 stars", "3 stars or less"],
          datasets: [{
            data: reviewValues,
            backgroundColor: ["#3dd598", "#5b8cff", "#ff9b5f"],
            borderWidth: 0
          }]
        }
      },
      "admin-notifications-chart": {
        type: "pie",
        data: {
          labels: ["Unread", "Read"],
          datasets: [{
            data: notificationValues,
            backgroundColor: ["#ff6b81", "#46c2ff"],
            borderWidth: 0
          }]
        }
      },
      "admin-reports-chart": {
        type: "bar",
        data: {
          labels: ["Approved", "Pending", "Review"],
          datasets: [{
            label: "Reports status",
            data: reportsByStatus,
            borderRadius: 10,
            backgroundColor: ["#3dd598", "#ff9b5f", "#c678ff"]
          }]
        }
      }
    };

    Object.entries(chartConfigs).forEach(([id, config]) => {
      const canvas = document.getElementById(id);
      if (!canvas) return;
      new Chart(canvas, {
        ...config,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: "#9fb0cd" }
            }
          },
          scales: config.type === "bar" || config.type === "line" ? {
            y: {
              ticks: { color: "#9fb0cd" },
              grid: { color: "rgba(159, 176, 205, 0.12)" }
            },
            x: {
              ticks: { color: "#9fb0cd" },
              grid: { color: "rgba(159, 176, 205, 0.08)" }
            }
          } : {}
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", buildCharts);
})();
